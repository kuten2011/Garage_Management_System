package DACNTT.garage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ReportDTO {
    private String maBC;
    private String maChiNhanh;
    private String thangNam;
    private Double doanhThu;
    private Integer soXePhucVu;
}
