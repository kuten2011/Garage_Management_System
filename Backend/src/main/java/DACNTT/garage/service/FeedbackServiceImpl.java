package DACNTT.garage.service;

import DACNTT.garage.model.Feedback;
import DACNTT.garage.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired private FeedbackRepository feedbackRepository;

    @Override
    public Page<Feedback> getAllFeedbacks(Pageable pageable, String search, String trangThai) {
        // Chuẩn hóa input
        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasStatus = trangThai != null && !trangThai.trim().isEmpty();

        String searchPattern = hasSearch ? "%" + search.trim().toLowerCase() + "%" : null;

        // Trường hợp 1: Không có lọc gì → trả tất cả
        if (!hasSearch && !hasStatus) {
            return feedbackRepository.findAll(pageable);
        }

        // Trường hợp 2: Chỉ có trạng thái → lọc theo trạng thái
        if (!hasSearch && hasStatus) {
            return feedbackRepository.findByTrangThai(trangThai, pageable);
        }

        // Trường hợp 3: Chỉ có search → tìm theo nội dung hoặc biển số
        if (hasSearch && !hasStatus) {
            return feedbackRepository.findByNoiDungContainingIgnoreCaseOrPhieuSuaChua_Xe_BienSoContainingIgnoreCase(
                    searchPattern, searchPattern, pageable);
        }

        // Trường hợp 4: CẢ SEARCH VÀ TRẠNG THÁI → kết hợp cả 2 (QUAN TRỌNG NHẤT)
        if (hasSearch && hasStatus) {
            return feedbackRepository.findByNoiDungContainingIgnoreCaseOrPhieuSuaChua_Xe_BienSoContainingIgnoreCaseAndTrangThai(
                    searchPattern, searchPattern, trangThai, pageable);
        }

        // Dự phòng
        return feedbackRepository.findAll(pageable);
    }

    @Override
    public Feedback getById(String maPhanHoi) {
        return feedbackRepository.findById(maPhanHoi)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phản hồi: " + maPhanHoi));
    }

    @Override
    public Feedback updateFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }
}