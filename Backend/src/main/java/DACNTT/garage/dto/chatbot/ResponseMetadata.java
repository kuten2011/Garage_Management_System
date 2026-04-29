package DACNTT.garage.dto.chatbot;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMetadata {
    private int documentCount; // Số documents được tìm thấy
    private long processingTimeMs; // Thời gian xử lý
    private String searchMethod; // "hybrid", "vector", "keyword"
}
