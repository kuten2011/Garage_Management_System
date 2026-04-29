package DACNTT.garage.repository;

import DACNTT.garage.model.RepairService;
import DACNTT.garage.model.RepairServiceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RepairServiceRepository extends JpaRepository<RepairService, RepairServiceId> {
    List<RepairService> findByPhieu_MaPhieu(String maPhieu);
    @Query("SELECT COALESCE(SUM(rs.thanhTien), 0) " +
            "FROM RepairService rs " +
            "WHERE rs.phieu.maPhieu = :maPhieu")
    Double sumThanhTienByMaPhieu(@Param("maPhieu") String maPhieu);
}