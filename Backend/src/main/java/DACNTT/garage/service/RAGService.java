package DACNTT.garage.service;

import DACNTT.garage.model.ServiceInfo;
import DACNTT.garage.repository.ServiceInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RAGService {
    private final ServiceInfoRepository serviceInfoRepository;
    private final GeminiService geminiService;

    @Value("${rag.search.top-k:5}")
    private int topK;

    @Value("${rag.search.similarity-threshold:0.7}")
    private double similarityThreshold;

    @Value("${rag.search.max-context-length:4000}")
    private int maxContextLength;

    @Value("${rag.search.min-relevant-docs:1}")
    private int minRelevantDocs;

    @Value("${rag.fallback.enable-ai-fallback:true}")
    private boolean enableAiFallback;

    private static final Pattern DANGEROUS_PATTERN = Pattern.compile("[';\"\\\\]");

    public String answerQuestion(String userQuery) {
        String sanitizedQuery = validateAndSanitizeQuery(userQuery);

        try {
            float[] queryEmbedding = geminiService.generateEmbedding(sanitizedQuery);
            List<ServiceInfo> relevantDocs = hybridSearch(sanitizedQuery, queryEmbedding);

            if (hasRelevantContext(relevantDocs)) {
                String context = buildContextWithLimit(relevantDocs);
                return geminiService.generateText(sanitizedQuery, buildRAGPrompt(sanitizedQuery, context));
            } else if (enableAiFallback) {
                return geminiService.generateText(sanitizedQuery, buildAIFallbackPrompt(sanitizedQuery));
            } else {
                return buildNoResultsResponse();
            }

        } catch (IllegalArgumentException e) {
            return "Xin lỗi, câu hỏi của bạn không hợp lệ. Vui lòng thử lại.";
        } catch (Exception e) {
            return "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";
        }
    }

    private boolean hasRelevantContext(List<ServiceInfo> docs) {
        return docs != null && docs.size() >= minRelevantDocs;
    }

    private String buildRAGPrompt(String userQuery, String context) {
        return String.format("""
                Bạn là trợ lý AI thông minh, chuyên gia tư vấn về sửa chữa, bảo dưỡng và chăm sóc xe ô tô với nhiều năm kinh nghiệm.
                
                ✅ NHIỆM VỤ:
                Trả lời câu hỏi của khách hàng dựa trên THÔNG TIN NỘI BỘ bên dưới.
                
                📋 THÔNG TIN NỘI BỘ:
                %s
                
                ⚠️ NGUYÊN TẮC:
                1. Ưu tiên sử dụng thông tin từ THÔNG TIN NỘI BỘ
                2. Trả lời chính xác, chi tiết dựa trên dữ liệu có sẵn
                3. Nếu thông tin không đầy đủ, hãy nói rõ phần nào bạn biết
                4. Có thể bổ sung kiến thức chung về ô tô nếu liên quan
                5. Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp
                6. Thêm emoji phù hợp để sinh động (🚗 💰 📍 📞)
                
                ❓ CÂU HỎI: %s
                
                💬 TRẢ LỜI:
                """, context, userQuery);
    }

    private String buildAIFallbackPrompt(String userQuery) {
        return String.format("""
                Bạn là trợ lý AI thông minh chuyên về garage ô tô.
                
                ⚠️ TÌNH HUỐNG:
                Hệ thống không tìm thấy thông tin cụ thể trong cơ sở dữ liệu nội bộ.
                
                ✅ NHIỆM VỤ:
                Trả lời dựa trên kiến thức chung về ô tô, sửa chữa, bảo dưỡng xe.
                
                📝 HƯỚNG DẪN:
                1. Trả lời bằng kiến thức chung, chính xác về lĩnh vực ô tô
                2. Nêu rõ đây là thông tin tham khảo chung
                3. Khuyên khách hàng liên hệ trực tiếp để được tư vấn chi tiết
                4. Có thể đưa ra gợi ý hoặc hỏi thêm thông tin
                5. Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp
                
                💡 GỢI Ý FORMAT:
                - Bắt đầu: "Dựa trên kiến thức chung về ô tô, tôi có thể chia sẻ..."
                - Kết thúc: "Để biết thông tin chính xác, vui lòng liên hệ garage..."
                
                ❓ CÂU HỎI: %s
                
                💬 TRẢ LỜI:
                """, userQuery);
    }

    private List<ServiceInfo> hybridSearch(String query, float[] embedding) {
        try {
            if (embedding == null || embedding.length == 0) {
                return keywordSearchFallback(query);
            }

            String embedString = toPgVector(embedding);
            if (!isValidPgVector(embedString)) {
                return keywordSearchFallback(query);
            }

            List<ServiceInfo> results = serviceInfoRepository.hybridSearch(query, embedString, topK);
            if (!results.isEmpty()) {
                return results;
            }

            results = serviceInfoRepository.searchByVectorWithThreshold(embedString, similarityThreshold, topK);
            if (!results.isEmpty()) {
                return results;
            }

            return keywordSearchFallback(query);

        } catch (Exception e) {
            return keywordSearchFallback(query);
        }
    }

    private List<ServiceInfo> keywordSearchFallback(String query) {
        try {
            List<ServiceInfo> results = serviceInfoRepository.fullTextSearch(query, topK);
            if (!results.isEmpty()) {
                return results;
            }

            return serviceInfoRepository.findByTitleContainingIgnoreCase(query)
                    .stream().limit(topK).collect(Collectors.toList());
        } catch (Exception e) {
            return List.of();
        }
    }

    private String buildContextWithLimit(List<ServiceInfo> documents) {
        StringBuilder context = new StringBuilder();
        int currentLength = 0;

        for (int i = 0; i < documents.size(); i++) {
            ServiceInfo doc = documents.get(i);
            String docText = formatDocument(doc, i + 1);

            if (currentLength + docText.length() > maxContextLength) {
                break;
            }

            context.append(docText).append("\n");
            currentLength += docText.length();
        }

        return context.toString().trim();
    }

    private String formatDocument(ServiceInfo doc, int index) {
        StringBuilder sb = new StringBuilder();
        sb.append("--- Tài liệu ").append(index).append(" ---\n");

        if (doc.getTitle() != null) {
            sb.append("Tiêu đề: ").append(doc.getTitle()).append("\n");
        }

        if (doc.getCategory() != null) {
            sb.append("Danh mục: ").append(doc.getCategory()).append("\n");
        }

        if (doc.getContent() != null) {
            String content = doc.getContent();
            if (content.length() > 1000) {
                content = content.substring(0, 1000) + "...";
            }
            sb.append("Nội dung: ").append(content).append("\n");
        }

        return sb.toString();
    }

    @Cacheable(value = "documentSearch", key = "#query.hashCode()")
    public List<ServiceInfo> searchRelevantDocuments(String query) {
        try {
            String sanitizedQuery = validateAndSanitizeQuery(query);
            float[] queryEmbedding = geminiService.generateEmbedding(sanitizedQuery);
            return hybridSearch(sanitizedQuery, queryEmbedding);
        } catch (Exception e) {
            return List.of();
        }
    }

    private String validateAndSanitizeQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Query cannot be null or empty");
        }

        String sanitized = query.trim();

        if (sanitized.length() > 500) {
            sanitized = sanitized.substring(0, 500);
        }

        if (DANGEROUS_PATTERN.matcher(sanitized).find()) {
            sanitized = DANGEROUS_PATTERN.matcher(sanitized).replaceAll("");
        }

        return sanitized;
    }

    private boolean isValidPgVector(String vector) {
        if (vector == null || !vector.startsWith("[") || !vector.endsWith("]")) {
            return false;
        }

        try {
            String content = vector.substring(1, vector.length() - 1);
            String[] parts = content.split(",");

            if (parts.length != 768) {
                return false;
            }

            for (String part : parts) {
                Float.parseFloat(part.trim());
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String toPgVector(float[] embedding) {
        if (embedding == null || embedding.length == 0) {
            throw new IllegalArgumentException("Embedding cannot be null or empty");
        }

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.length; i++) {
            if (Float.isNaN(embedding[i]) || Float.isInfinite(embedding[i])) {
                throw new IllegalArgumentException("Invalid embedding value at " + i);
            }

            sb.append(embedding[i]);
            if (i < embedding.length - 1) sb.append(",");
        }
        sb.append("]");

        return sb.toString();
    }

    private String buildNoResultsResponse() {
        return """
                Xin lỗi, tôi không tìm thấy thông tin liên quan trong hệ thống.
                
                Bạn có thể hỏi về:
                • Dịch vụ sửa chữa và bảo dưỡng xe
                • Thay thế phụ tùng
                • Bảo hiểm và đăng kiểm xe
                • Tư vấn kỹ thuật
                
                Hoặc liên hệ hotline: 1900-xxxx để được hỗ trợ trực tiếp.
                """;
    }

    public boolean isHealthy() {
        try {
            serviceInfoRepository.findByTitleContainingIgnoreCase("test");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}