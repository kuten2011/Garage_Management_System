package DACNTT.garage.dto;

import lombok.Data;

import java.util.List;

@Data
public class PartOrderRequestDTO {
    private String hoTen;
    private String sdt;
    private String email;
    private String maChiNhanh;
    private String ghiChu;
    private List<PartOrderItemRequestDTO> items;
}
