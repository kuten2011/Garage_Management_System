package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CT_DonDatPhuTung")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartOrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maDon")
    private PartOrder donDat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maPT")
    private Part phuTung;

    private Integer soLuong;
    private Double donGia;
    private Double thanhTien;
}
