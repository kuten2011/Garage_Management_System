package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CT_SuaChua_DichVu")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(RepairServiceId.class)
public class RepairService {

    @Id
    @ManyToOne
    @JoinColumn(name = "maPhieu")
    private Repair phieu;

    @Id
    @ManyToOne
    @JoinColumn(name = "maDV")
    private ServiceEntity dichVu;

    private Integer soLuong;
    private String ghiChu;

    // THÊM FIELD NÀY – LỖI SẼ BIẾN MẤT NGAY!
    private Double thanhTien;
}