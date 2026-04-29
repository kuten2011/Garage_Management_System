package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BaoCao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @Column(length = 10)
    private String maBC;

    @ManyToOne
    @JoinColumn(name = "maChiNhanh")
    private Branch chiNhanh;

    private String thangNam;
    private Double doanhThu;
    private Integer soXePhucVu;
}
