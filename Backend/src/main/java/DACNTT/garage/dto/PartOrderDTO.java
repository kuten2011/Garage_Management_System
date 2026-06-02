package DACNTT.garage.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PartOrderDTO {
    private String maDon;
    private String hoTen;
    private String sdt;
    private String email;
    private String maKH;
    private String maChiNhanh;
    private String tenChiNhanh;
    private LocalDateTime ngayDat;
    private String trangThai;
    private Double tongTien;
    private String ghiChu;
    private Boolean daTraKho;
    private List<PartOrderLineDTO> items;

    @Data
    @Builder
    public static class PartOrderLineDTO {
        private String maPT;
        private String tenPT;
        private Integer soLuong;
        private Double donGia;
        private Double thanhTien;
    }
}
