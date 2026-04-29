package DACNTT.garage.service;

import DACNTT.garage.dto.BookingDTO;
import DACNTT.garage.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {
    Page<Booking> searchBookings(
            String search,
            String trangThai,
            String dateFrom,
            String dateTo,
            String loaiDichVu,
            Pageable pageable
    );
    List<Booking> getAllBookings();
    Booking addBooking(Booking booking);
    Booking addBookingCustomer(Booking booking);
    Booking updateBooking(String maLich, BookingDTO dto);
    Booking updateStatus(String maLich, String trangThai);
    void deleteBooking(String maLich);
    Page<Booking> getBookings(Pageable pageable);
}
