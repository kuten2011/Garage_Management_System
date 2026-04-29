package DACNTT.garage.dto;

import DACNTT.garage.model.Customer;
import DACNTT.garage.model.Vehicle;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class BookingDTO {
    private String maLich;
    private String maKH;
    private String hoTenKH;
    private LocalDate ngayHen;
    private LocalTime gioHen;
    private String trangThai;
    private String ghiChu;
}
