package DACNTT.garage.dto.chatbot;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String response;
    private String conversationId;
    private LocalDateTime timestamp;
    private List<SourceDocument> sources; // Các tài liệu được tham khảo
    private ResponseMetadata metadata;
}
