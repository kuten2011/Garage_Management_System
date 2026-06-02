package DACNTT.garage.repository;

import DACNTT.garage.model.PartOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PartOrderRepository extends JpaRepository<PartOrder, String> {
    Optional<PartOrder> findTopByOrderByMaDonDesc();
    List<PartOrder> findByKhachHang_EmailOrderByNgayDatDesc(String email);
    List<PartOrder> findAllByOrderByNgayDatDesc();
}
