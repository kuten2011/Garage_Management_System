package DACNTT.garage.mapper;

import DACNTT.garage.dto.BookingDTO;
import DACNTT.garage.model.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(target = "maKH", expression = "java(booking.getKhachHang() != null ? booking.getKhachHang().getMaKH() : null)")
    @Mapping(target = "hoTenKH", expression = "java(booking.getKhachHang() != null ? booking.getKhachHang().getHoTen() : null)")
    BookingDTO toBookingDTO(Booking booking);

    @Mapping(target = "khachHang", ignore = true)
    @Mapping(target = "maKH", source = "maKH")
    Booking toEntity(BookingDTO dto);
}