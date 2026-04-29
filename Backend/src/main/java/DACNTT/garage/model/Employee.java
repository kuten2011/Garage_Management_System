package DACNTT.garage.model;

import DACNTT.garage.util.Enum.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "NhanVien")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @Column(length = 10)
    private String maNV;

    private String hoTen;
    private String vaiTro;
    private String sdt;
    private String email;
    private String matKhau;

    @ManyToOne
    @JoinColumn(name = "maChiNhanh")
    private Branch chiNhanh;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_EMPLOYEE;
}