package DACNTT.garage.repository;

import DACNTT.garage.model.Repair;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RepairRepository extends JpaRepository<Repair, String> {

    @Query("SELECT r FROM Repair r WHERE r.maPhieu = (SELECT MAX(r2.maPhieu) FROM Repair r2)")
    Optional<Repair> findTopByOrderByMaPhieuDesc();

    boolean existsByMaPhieu(String maPhieu);

    Optional<Repair> findByMaPhieu(String maPhieu);

    @Query("SELECT r FROM Repair r " +
            "LEFT JOIN FETCH r.lichHen lh " +
            "LEFT JOIN FETCH lh.khachHang kh " +
            "LEFT JOIN FETCH r.xe x " +
            "LEFT JOIN FETCH r.nhanVien nv " +
            "WHERE r.maPhieu = :maPhieu")
    Optional<Repair> findByIdWithDetails(@Param("maPhieu") String maPhieu);

    List<Repair> findByLichHen_KhachHang_MaKH(String maKH);

    // Tìm phiếu hoàn thành đúng vào ngày cụ thể
    List<Repair> findByNgayHoanThanhAndTrangThai(LocalDate ngayHoanThanh, String trangThai);

    @Query("""
    SELECT r.lichHen.khachHang.maKH, 
           r.lichHen.khachHang.hoTen, 
           r.lichHen.khachHang.email, 
           MAX(r.ngayLap)
    FROM Repair r
    WHERE r.ngayLap BETWEEN :fromDate AND :toDate
    AND r.trangThai = 'Hoàn thành'
    GROUP BY r.lichHen.khachHang.maKH, 
             r.lichHen.khachHang.hoTen, 
             r.lichHen.khachHang.email
    """)
    List<Object[]> findDormantCustomers(LocalDate fromDate, LocalDate toDate);

}