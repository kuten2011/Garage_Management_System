package DACNTT.garage.repository;

import DACNTT.garage.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, String>, JpaSpecificationExecutor<Vehicle> {
    Page<Vehicle> findAll(Pageable pageable);
    // Xe có ngày hết bảo hành = ngày cụ thể (gần hết hạn)
    List<Vehicle> findByNgayBaoHanhDen(LocalDate ngayBaoHanhDen);

    // Xe đến kỳ bảo dưỡng (theo ngày dự kiến)
    @Query("SELECT v FROM Vehicle v WHERE v.ngayBaoDuongTiepTheo <= :today")
    List<Vehicle> findDueForMaintenance(@Param("today") LocalDate today);

    // Xe quá hạn bảo dưỡng (quá ngày dự kiến)
    @Query("SELECT v FROM Vehicle v WHERE v.ngayBaoDuongTiepTheo < :today")
    List<Vehicle> findOverdueMaintenance(@Param("today") LocalDate today);

    @Query("""
    SELECT v FROM Vehicle v
    WHERE
    (:filter = 'ALL')
    OR (:filter = 'OVERDUE' AND v.ngayBaoDuongTiepTheo < :today)
    OR (:filter = 'DUE_SOON' AND v.ngayBaoDuongTiepTheo BETWEEN :today AND :soon)
    OR (:filter = 'WARRANTY' AND v.ngayBaoHanhDen BETWEEN :today AND :soon)
    OR (:filter = 'HIGH_KM' AND v.soKm > 100000)
    """)
    Page<Vehicle> filterVehicles(
            @Param("filter") String filter,
            @Param("today") LocalDate today,
            @Param("soon") LocalDate soon,
            Pageable pageable
    );
    Page<Vehicle> findByNgayBaoDuongTiepTheoBefore(LocalDate date, Pageable pageable);

    Page<Vehicle> findByNgayBaoDuongTiepTheoBetween(LocalDate from, LocalDate to, Pageable pageable);

    Page<Vehicle> findByNgayBaoDuongTiepTheoAfter(LocalDate date, Pageable pageable);
}