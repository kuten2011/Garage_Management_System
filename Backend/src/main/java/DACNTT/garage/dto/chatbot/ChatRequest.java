package DACNTT.garage.dto.chatbot;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String message;
    private String conversationId;
}
