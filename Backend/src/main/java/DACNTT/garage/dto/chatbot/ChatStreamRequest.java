package DACNTT.garage.dto.chatbot;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatStreamRequest {
    private String message;
    private String conversationId;
    private boolean stream;
}
