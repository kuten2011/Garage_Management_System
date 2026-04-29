package DACNTT.garage.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class EmployeeDTO {
    private String maNV;
    private String hoTen;
    private String vaiTro;
    private String sdt;
    private String email;
    private String matKhau;
    private String maChiNhanh;
}
