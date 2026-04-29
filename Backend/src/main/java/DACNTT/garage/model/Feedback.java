package DACNTT.garage.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "PhanHoi")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @Column(length = 10)
    private String maPhanHoi;

    @ManyToOne
    @JoinColumn(name = "maPSC", nullable = false)
    private Repair phieuSuaChua;

    @Column(nullable = false)
    private String noiDung;

    @Column(nullable = false)
    private Integer soSao;

    @Column(nullable = false)
    private LocalDateTime ngayGui = LocalDateTime.now();

    @Builder.Default
    private String trangThai = "Chưa phản hồi";

    private String phanHoiQL;
}