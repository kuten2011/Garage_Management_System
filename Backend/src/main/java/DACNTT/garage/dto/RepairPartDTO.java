// src/main/java/DACNTT/garage/dto/RepairPartDTO.java
package DACNTT.garage.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RepairPartDTO {
    private String maPhieu;
    private String maPT;
    private String tenPT;
    private Integer soLuong;
    private Double thanhTien;

    private Double donGia;
    private Integer soLuongTon;
}