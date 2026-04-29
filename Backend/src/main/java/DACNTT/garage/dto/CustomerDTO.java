package DACNTT.garage.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CustomerDTO {
    private String maKH;
    private String hoTen;
    private String sdt;
    private String email;
    private String diaChi;

    private List<VehicleDTO> xeList;
    private String matKhau;
}