package DACNTT.garage.controller;

import DACNTT.garage.dto.chatbot.ChatRequest;
import DACNTT.garage.handle.ChatBotHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
public class ChatBotController {
    @Autowired
    private ChatBotHandle chatBotHandle;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest chatRequest) {
        return chatBotHandle.chat(chatRequest);
    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody ChatRequest chatRequest) {
        return chatBotHandle.searchDocuments(chatRequest);
    }
}
