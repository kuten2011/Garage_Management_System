package DACNTT.garage.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@Data
@ConfigurationProperties(prefix = "gemini")
public class GeminiConfig {
    private String apiKey;
    private String model;

    @Bean
    public WebClient geminiWebClient(WebClient.Builder builder, GeminiConfig config) {
        return builder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")   // ← Phải có /v1beta
                .build();
    }
}
