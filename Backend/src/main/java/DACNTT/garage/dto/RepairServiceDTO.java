package DACNTT.garage.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RepairServiceDTO {
    private String maPhieu;
    private String maDV;
    private String tenDV;
    private Integer soLuong;
    private Double thanhTien;

    private Double giaTien;
}