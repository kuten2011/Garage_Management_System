package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Xe")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @Column(name = "bienSo", length = 10)
    private String bienSo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maKH", nullable = false)
    private Customer khachHang;

    @Column(name = "hangXe", length = 50)
    private String hangXe;

    @Column(name = "mauXe", length = 50)
    private String mauXe;

    @Column(name = "soKm")
    private Integer soKm;

    @Column(name = "namSX")
    private Integer namSX;

    @Column(name = "ngayBaoHanhDen")
    private LocalDate ngayBaoHanhDen;

    @Column(name = "ngayBaoDuongTiepTheo")
    private LocalDate ngayBaoDuongTiepTheo;

    @Column(name = "chuKyBaoDuongKm")
    private Integer chuKyBaoDuongKm = 10000;

    @Column(name = "chuKyBaoDuongThang")
    private Integer chuKyBaoDuongThang = 12;
}