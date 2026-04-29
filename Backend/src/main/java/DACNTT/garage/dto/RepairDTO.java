package DACNTT.garage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RepairDTO {
    private String maPhieu;
    private String maLich;
    private String maNV;
    private LocalDate ngayLap;
    private String ghiChu;
    private String trangThai;
    private String bienSo;

    private String thanhToanStatus;

    private Double tongTien;

    private CustomerDTO khachHang;
    private VehicleDTO xe;

    @Builder.Default
    private boolean daDanhGia = false;

    private Integer soSao;
    private String noiDungPhanHoi;
    private LocalDateTime ngayDanhGia;
    private String phanHoiQL;

    public boolean isDaDanhGia() { return daDanhGia; }
    public void setDaDanhGia(boolean daDanhGia) { this.daDanhGia = daDanhGia; }
}