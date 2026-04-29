package DACNTT.garage.model;

import DACNTT.garage.util.Enum.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "KhachHang")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @Column(length = 10)
    private String maKH;

    private String hoTen;
    private String sdt;
    private String email;
    private String diaChi;
    private String matKhau;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_CUSTOMER;

    @OneToMany(mappedBy = "khachHang", fetch = FetchType.LAZY)
    private List<Vehicle> xeList;
}