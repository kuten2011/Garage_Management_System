package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CT_SuaChua_PhuTung")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(RepairPartId.class)
public class RepairPart {

    @Id
    @ManyToOne
    @JoinColumn(name = "maPhieu")
    private Repair phieu;

    @Id
    @ManyToOne
    @JoinColumn(name = "maPT")
    private Part phuTung;

    private Integer soLuong;
    private Double thanhTien;
}
