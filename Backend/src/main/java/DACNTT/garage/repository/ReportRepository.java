package DACNTT.garage.repository;

import DACNTT.garage.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, String> {
    Optional<Report> findByChiNhanh_MaChiNhanhAndThangNam(String maChiNhanh, String thangNam);
    List<Report> findByChiNhanh_MaChiNhanh(String maChiNhanh);
}