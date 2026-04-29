package DACNTT.garage.controller;

import DACNTT.garage.dto.FeedbackDTO;
import DACNTT.garage.handle.FeedbackHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
public class FeedbackController {

    @Autowired
    private FeedbackHandle feedbackHandle;

    // === ADMIN ===
    @GetMapping("/admin/feedbacks")
    public ResponseEntity<Page<FeedbackDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String trangThai) {
        return feedbackHandle.getAllFeedbacks(page, size, search, trangThai);
    }

    @GetMapping("/admin/feedbacks/{maPhanHoi}")
    public ResponseEntity<FeedbackDTO> getById(@PathVariable String maPhanHoi) {
        return feedbackHandle.getFeedbackById(maPhanHoi);
    }

    @PatchMapping("/admin/feedbacks/{maPhanHoi}")
    public ResponseEntity<FeedbackDTO> updateFeedback(
            @PathVariable String maPhanHoi,
            @RequestBody FeedbackDTO dto) {
        return feedbackHandle.updateFeedback(maPhanHoi, dto);
    }

    // === CUSTOMER ===
    @PostMapping("/customer/feedbacks/{maPSC}")
    public ResponseEntity<FeedbackDTO> createFeedback(
            @PathVariable String maPSC,
            @RequestBody FeedbackDTO dto,
            Principal principal) {
        return feedbackHandle.createFeedbackFromCustomer(maPSC, dto, principal);
    }
}