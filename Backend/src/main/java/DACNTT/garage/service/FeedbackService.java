package DACNTT.garage.service;

import DACNTT.garage.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FeedbackService {
    Page<Feedback> getAllFeedbacks(Pageable pageable, String search, String trangThai);
    Feedback getById(String maPhanHoi);
    Feedback updateFeedback(Feedback feedback);
}