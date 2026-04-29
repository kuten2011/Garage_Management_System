package DACNTT.garage.repository;

import DACNTT.garage.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, String> {

    Page<Feedback> findAll(Pageable pageable);

    Page<Feedback> findByNoiDungContainingIgnoreCaseOrPhieuSuaChua_Xe_BienSoContainingIgnoreCase(
            String noiDung, String bienSo, Pageable pageable);
    Page<Feedback> findByNoiDungContainingIgnoreCaseOrPhieuSuaChua_Xe_BienSoContainingIgnoreCaseAndTrangThai(
            String noiDung, String bienSo, String trangThai, Pageable pageable);

    Page<Feedback> findByTrangThai(String trangThai, Pageable pageable);
    boolean existsByPhieuSuaChua_MaPhieu(String maPhieu);
    Optional<Feedback> findByPhieuSuaChua_MaPhieu(String maPhieu);
}