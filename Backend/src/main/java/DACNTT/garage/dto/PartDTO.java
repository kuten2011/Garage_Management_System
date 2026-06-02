package DACNTT.garage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PartDTO {
    private String maPT;
    private String tenPT;
    private Double donGia;
    private Integer soLuongTon;
    private String moTa;
    private String hinhAnh;
    private String maChiNhanh;
    private String tenChiNhanh;
}
