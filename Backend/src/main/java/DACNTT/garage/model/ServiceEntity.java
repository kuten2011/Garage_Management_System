package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "DichVu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceEntity {

    @Id
    @Column(length = 10)
    private String maDV;

    private String tenDV;
    private Double giaTien;
    private String moTa;
}
