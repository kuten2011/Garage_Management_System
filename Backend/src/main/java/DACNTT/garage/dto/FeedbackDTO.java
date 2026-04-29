package DACNTT.garage.dto;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FeedbackDTO {
    private String maPhanHoi;
    private String maPSC;
    private String noiDung;
    private Integer soSao;
    private LocalDateTime ngayGui;
    private String trangThai;
    private String phanHoiQL;

    private String bienSo;
    private String hoTenKhach;
    private String maKH;
}