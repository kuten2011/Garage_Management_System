package DACNTT.garage.service;

import DACNTT.garage.config.GeminiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {
    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper;
    private final WebClient webClient;

    private static final int EMBEDDING_DIMENSION = 768;
    private static final int MAX_CONCURRENT_REQUESTS = 5;

    private final Semaphore rateLimiter = new Semaphore(MAX_CONCURRENT_REQUESTS);
    private final ConcurrentHashMap<String, Integer> errorCounts = new ConcurrentHashMap<>();
    private static final int CIRCUIT_BREAKER_THRESHOLD = 5;

    @Cacheable(value = "embeddings", key = "#text.hashCode()", unless = "#result == null")
    public float[] generateEmbedding(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text cannot be null or empty");
        }

        try {
            rateLimiter.acquire();

            float[] embedding = generateEmbeddingAsync(text)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            validateEmbedding(embedding);
            resetErrorCount("embedding");
            return embedding;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Request was interrupted", e);
        } catch (Exception e) {
            handleApiError("embedding", e);
            throw new RuntimeException("Failed to generate embedding", e);
        } finally {
            rateLimiter.release();
        }
    }

    public Mono<float[]> generateEmbeddingAsync(String text) {
        String modelName = "gemini-embedding-001";   // hoặc "gemini-embedding-2-preview" nếu muốn thử model mới

        // SỬA Ở ĐÂY: Không được có "models/" thừa trước modelName
        String url = "/models/" + modelName + ":embedContent?key=" + geminiConfig.getApiKey();

        Map<String, Object> requestBody = Map.of(
                "content", Map.of(
                        "parts", List.of(Map.of("text", sanitizeInput(text)))
                )
                // Nếu muốn vector ngắn hơn để tiết kiệm bộ nhớ (khuyến nghị):
                // ,"outputDimensionality", 1536   // hoặc 768
        );

        return webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(this::isRetryableError))
                .map(this::parseEmbeddingResponse)
                .doOnError(e -> log.error("Error generating embedding for text (length {}): {}",
                        text.length(), e.getMessage(), e));
    }

    public String generateText(String prompt, String context) {
        if (prompt == null || prompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt cannot be null or empty");
        }

        try {
            rateLimiter.acquire();

            String response = generateTextAsync(prompt, context)
                    .timeout(Duration.ofSeconds(45))
                    .block();

            resetErrorCount("text_generation");
            return response;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Request was interrupted", e);
        } catch (Exception e) {
            handleApiError("text_generation", e);
            throw new RuntimeException("Failed to generate text", e);
        } finally {
            rateLimiter.release();
        }
    }

    public Mono<String> generateTextAsync(String prompt, String context) {
        String fullPrompt = context != null ? context : prompt;
        String url = "/" + geminiConfig.getModel() + ":generateContent?key=" + geminiConfig.getApiKey();
        Map<String, Object> request = buildTextGenerationRequest(fullPrompt);

        return webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .retryWhen(Retry.backoff(2, Duration.ofSeconds(2))
                        .filter(this::isRetryableError))
                .map(this::parseTextResponse)
                .doOnSuccess(text -> log.info("Generated response of {} chars", text.length()))
                .doOnError(e -> log.error("Error generating text: {}", e.getMessage()));
    }

//    public Mono<String> generateTextStream(String prompt, String context) {
//        String fullPrompt = context != null ? context : prompt;
//        String url = "/" + geminiConfig.getModel() + ":streamGenerateContent?key=" + geminiConfig.getApiKey();
//        Map<String, Object> request = buildTextGenerationRequest(fullPrompt);
//
//        return webClient.post()
//                .uri(url)
//                .header("Content-Type", "application/json")
//                .bodyValue(request)
//                .retrieve()
//                .bodyToMono(String.class)
//                .doOnError(e -> log.error("Error streaming text: {}", e.getMessage()))
//                .onErrorResume(e -> Mono.error(new RuntimeException("Failed to stream text", e)));
//    }

    private Map<String, Object> buildEmbeddingRequest(String text) {
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();

        part.put("text", sanitizeInput(text));
        content.put("parts", List.of(part));
        request.put("content", content);

        return request;
    }

    private Map<String, Object> buildTextGenerationRequest(String prompt) {
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();

        part.put("text", sanitizeInput(prompt));
        content.put("parts", List.of(part));
        request.put("contents", List.of(content));

        return request;
    }

    private float[] parseEmbeddingResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode valuesNode = jsonNode.path("embedding").path("values");

            if (valuesNode.isMissingNode() || !valuesNode.isArray()) {
                throw new RuntimeException("Invalid embedding response format");
            }

            float[] embedding = new float[valuesNode.size()];
            for (int i = 0; i < valuesNode.size(); i++) {
                embedding[i] = (float) valuesNode.get(i).asDouble();
            }

            return embedding;

        } catch (Exception e) {
            log.error("Failed to parse embedding response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse embedding", e);
        }
    }

    private String parseTextResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode candidates = jsonNode.path("candidates");

            if (candidates.isMissingNode() || candidates.isEmpty()) {
                throw new RuntimeException("No candidates in response");
            }

            String generatedText = candidates.get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();

            if (generatedText == null || generatedText.isEmpty()) {
                throw new RuntimeException("Empty text in response");
            }

            return generatedText;

        } catch (Exception e) {
            log.error("Failed to parse text response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse response", e);
        }
    }

    private void validateEmbedding(float[] embedding) {
        if (embedding == null) {
            throw new IllegalStateException("Embedding is null");
        }
        if (embedding.length != 768 && embedding.length != 1536 && embedding.length != 3072) {
            log.warn("Embedding dimension lạ: {}", embedding.length);
        }

        if (embedding.length != EMBEDDING_DIMENSION) {
            throw new IllegalStateException(
                    String.format("Invalid embedding dimension: expected %d, got %d",
                            EMBEDDING_DIMENSION, embedding.length));
        }
        for (float value : embedding) {
            if (Float.isNaN(value) || Float.isInfinite(value)) {
                throw new IllegalStateException("Embedding contains invalid values");
            }
        }
    }

    private String sanitizeInput(String input) {
        if (input == null) return "";
        return input.trim()
                .replaceAll("[\u0000-\u001F\u007F-\u009F]", "")
                .replaceAll("\\s+", " ");
    }

    private boolean isRetryableError(Throwable throwable) {
        if (throwable instanceof WebClientResponseException) {
            WebClientResponseException ex = (WebClientResponseException) throwable;
            int status = ex.getStatusCode().value();
            return status == 429 || (status >= 500 && status < 600);
        }
        return false;
    }

    private void handleApiError(String operation, Exception e) {
        int count = errorCounts.merge(operation, 1, Integer::sum);

        if (count >= CIRCUIT_BREAKER_THRESHOLD) {
            log.error("Circuit breaker opened for operation: {}", operation);
            throw new RuntimeException("Service temporarily unavailable for " + operation);
        }

        log.warn("Error count for {}: {}/{}", operation, count, CIRCUIT_BREAKER_THRESHOLD);
    }

    private void resetErrorCount(String operation) {
        errorCounts.put(operation, 0);
    }

    public boolean isHealthy() {
        return errorCounts.values().stream()
                .allMatch(count -> count < CIRCUIT_BREAKER_THRESHOLD);
    }

    public Map<String, Object> getHealthStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("healthy", isHealthy());
        status.put("errorCounts", new HashMap<>(errorCounts));
        status.put("availablePermits", rateLimiter.availablePermits());
        return status;
    }
}