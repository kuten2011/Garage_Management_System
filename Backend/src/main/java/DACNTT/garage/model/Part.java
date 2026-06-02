package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PhuTung")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Part {
    @Id
    @Column(length = 10, updatable = false)
    private String maPT;

    @Column(nullable = false, length = 100)
    private String tenPT;

    @Column(nullable = false)
    private Double donGia;

    @Column(nullable = false)
    @Builder.Default
    private Integer soLuongTon = 0;

    @Column(columnDefinition = "TEXT")
    private String moTa;

    @Column
    private String hinhAnh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maChiNhanh")
    private Branch chiNhanh;
}
