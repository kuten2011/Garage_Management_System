package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "PhieuSuaChua")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Repair {

    @Id
    @Column(name = "maPhieu", length = 20)
    private String maPhieu;

    @ManyToOne
    @JoinColumn(name = "maLich")
    private Booking lichHen;

    @ManyToOne
    @JoinColumn(name = "maNV")
    private Employee nhanVien;

    @ManyToOne
    @JoinColumn(name = "bienSo")
    private Vehicle xe;

    private LocalDate ngayLap;
    private String ghiChu;

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'Chờ tiếp nhận'")
    private String trangThai = "Chờ tiếp nhận";

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'Chưa thanh toán'")
    private String thanhToanStatus = "Chưa thanh toán";

    private Double tongTien = 0.0;

    private LocalDate ngayHoanThanh; // Ngày hoàn thành sửa chữa (khi trạng thái = "Hoàn thành")
}