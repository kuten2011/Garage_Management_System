package DACNTT.garage.dto.security;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String hoTen;
    private String sdt;
    private String email;
    private String diaChi;
    private String matKhau;
}