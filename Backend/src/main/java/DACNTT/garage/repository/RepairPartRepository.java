package DACNTT.garage.repository;

import DACNTT.garage.model.RepairPart;
import DACNTT.garage.model.RepairPartId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RepairPartRepository extends JpaRepository<RepairPart, RepairPartId> {
    @Query("SELECT COALESCE(SUM(rp.thanhTien), 0) " +
            "FROM RepairPart rp " +
            "WHERE rp.phieu.maPhieu = :maPhieu")
    Double sumThanhTienByMaPhieu(@Param("maPhieu") String maPhieu);
}
