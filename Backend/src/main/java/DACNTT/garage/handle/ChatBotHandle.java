package DACNTT.garage.handle;

import DACNTT.garage.dto.chatbot.*;
import DACNTT.garage.model.ServiceInfo;
import DACNTT.garage.service.RAGService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@Slf4j
public class ChatBotHandle {
    @Autowired
    private RAGService ragService;

    public ResponseEntity<?> chat(ChatRequest chatRequest) {
        try {
            long startTime = System.currentTimeMillis();

            // Validate input
            if (chatRequest.getMessage() == null || chatRequest.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ErrorResponse.builder()
                                .error("INVALID_INPUT")
                                .message("Message không được để trống")
                                .timestamp(LocalDateTime.now())
                                .build()
                );
            }
            // Get relevant documents first
            List<ServiceInfo> relevantDocs = ragService.searchRelevantDocuments(chatRequest.getMessage());

            // Generate answer
            String answer = ragService.answerQuestion(chatRequest.getMessage());

            long processingTime = System.currentTimeMillis() - startTime;

            // Build response
            ChatResponse response = ChatResponse.builder()
                    .response(answer)
                    .conversationId(chatRequest.getConversationId() != null
                            ? chatRequest.getConversationId()
                            : UUID.randomUUID().toString())
                    .timestamp(LocalDateTime.now())
                    .sources(buildSourceDocuments(relevantDocs))
                    .metadata(ResponseMetadata.builder()
                            .documentCount(relevantDocs.size())
                            .processingTimeMs(processingTime)
                            .searchMethod("hybrid")
                            .build())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ErrorResponse.builder()
                            .error("INTERNAL_ERROR")
                            .message("Đã có lỗi xảy ra. Vui lòng thử lại sau.")
                            .timestamp(LocalDateTime.now())
                            .build()
            );
        }
    }

    public ResponseEntity<?> searchDocuments(ChatRequest chatRequest) {
        try {
            List<ServiceInfo> documents = ragService.searchRelevantDocuments(chatRequest.getMessage());

            return ResponseEntity.ok(
                    documents.stream()
                            .map(doc -> SourceDocument.builder()
                                    .id(doc.getId())
                                    .title(doc.getTitle())
                                    .category(doc.getCategory())
                                    .snippet(truncate(doc.getContent(), 200))
                                    .build())
                            .collect(Collectors.toList())
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ErrorResponse.builder()
                            .error("SEARCH_ERROR")
                            .message("Không thể tìm kiếm tài liệu")
                            .timestamp(LocalDateTime.now())
                            .build()
            );
        }
    }

    private List<SourceDocument> buildSourceDocuments(List<ServiceInfo> docs) {
        return docs.stream()
                .map(doc -> SourceDocument.builder()
                        .id(doc.getId())
                        .title(doc.getTitle())
                        .category(doc.getCategory())
                        .snippet(truncate(doc.getContent(), 150))
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Helper: Truncate text
     */
    private String truncate(String text, int maxLength) {
        if (text == null) return "";
        if (text.length() <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    }
}
