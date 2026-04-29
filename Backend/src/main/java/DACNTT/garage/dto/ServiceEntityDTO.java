package DACNTT.garage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ServiceEntityDTO {
    private String maDV;
    private String tenDV;
    private Double giaTien;
    private String moTa;
}
