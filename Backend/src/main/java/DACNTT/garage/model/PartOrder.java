package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "DonDatPhuTung")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartOrder {
    @Id
    @Column(length = 20)
    private String maDon;

    private String hoTen;
    private String sdt;
    private String email;
    private String ghiChu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maKH")
    private Customer khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maChiNhanh")
    private Branch chiNhanh;

    private LocalDateTime ngayDat;
    private String trangThai;
    private Double tongTien;

    @Column(nullable = false)
    @Builder.Default
    private Boolean daTraKho = false;
}
