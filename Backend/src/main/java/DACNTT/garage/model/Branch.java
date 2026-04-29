package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ChiNhanh")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Branch {

    @Id
    @Column(length = 10)
    private String maChiNhanh;

    private String tenChiNhanh;
    private String diaChi;
    private String sdt;
    private String email;
}
