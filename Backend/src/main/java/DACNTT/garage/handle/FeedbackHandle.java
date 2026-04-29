package DACNTT.garage.handle;

import DACNTT.garage.dto.FeedbackDTO;
import DACNTT.garage.mapper.FeedbackMapper;
import DACNTT.garage.model.Feedback;
import DACNTT.garage.model.Repair;
import DACNTT.garage.repository.CustomerRepository;
import DACNTT.garage.repository.FeedbackRepository;
import DACNTT.garage.repository.RepairRepository;
import DACNTT.garage.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class FeedbackHandle {

    @Autowired private FeedbackService feedbackService;
    @Autowired private FeedbackMapper feedbackMapper;
    @Autowired private RepairRepository repairRepository;
    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private CustomerRepository customerRepository;

    public ResponseEntity<Page<FeedbackDTO>> getAllFeedbacks(int page, int size, String search, String trangThai) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "ngayGui"));
        Page<Feedback> result = feedbackService.getAllFeedbacks(pageable, search, trangThai);
        return ResponseEntity.ok(result.map(feedbackMapper::toFeedbackDTO));
    }

    public ResponseEntity<FeedbackDTO> getFeedbackById(String maPhanHoi) {
        Feedback feedback = feedbackService.getById(maPhanHoi);
        return ResponseEntity.ok(feedbackMapper.toFeedbackDTO(feedback));
    }

    public ResponseEntity<FeedbackDTO> updateFeedback(String maPhanHoi, FeedbackDTO dto) {
        Feedback existing = feedbackService.getById(maPhanHoi);

        if (dto.getPhanHoiQL() != null) {
            existing.setPhanHoiQL(dto.getPhanHoiQL());
        }
        if (dto.getTrangThai() != null) {
            existing.setTrangThai(dto.getTrangThai());
        }

        Feedback updated = feedbackService.updateFeedback(existing);
        return ResponseEntity.ok(feedbackMapper.toFeedbackDTO(updated));
    }

    public ResponseEntity<FeedbackDTO> createFeedbackFromCustomer(String maPSC, FeedbackDTO dto, Principal principal) {
        Repair repair = repairRepository.findById(maPSC)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu sửa chữa"));

        String maKHFromToken = customerRepository.findByEmail(principal.getName()).get().getMaKH();
        if (!repair.getLichHen().getKhachHang().getMaKH().equals(maKHFromToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        if (feedbackRepository.existsByPhieuSuaChua_MaPhieu(maPSC)) {
            return ResponseEntity.badRequest().body(null);
        }

        Feedback feedback = Feedback.builder()
                .maPhanHoi(generateId())
                .phieuSuaChua(repair)
                .ngayGui(LocalDateTime.now())
                .noiDung(dto.getNoiDung())
                .soSao(dto.getSoSao())
                .trangThai("Chưa phản hồi")
                .build();

        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(feedbackMapper.toFeedbackDTO(saved));
    }

    private String generateId() {
         List<Feedback> all = feedbackRepository.findAll();
         int nextNumber = all.size() + 1;
        return String.format("PH%02d", nextNumber);
    }
}