package DACNTT.garage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class BranchDTO {
    private String maChiNhanh;
    private String tenChiNhanh;
    private String diaChi;
    private String sdt;
    private String email;
}
