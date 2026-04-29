package DACNTT.garage.dto.chatbot;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SourceDocument {
    private Long id;
    private String title;
    private String category;
    private String snippet; // Đoạn text ngắn từ document
    private Double relevanceScore; // Optional: điểm relevance
}
