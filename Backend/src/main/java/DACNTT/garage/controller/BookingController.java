package DACNTT.garage.controller;

import DACNTT.garage.dto.BookingDTO;
import DACNTT.garage.handle.BookingHandle;
import DACNTT.garage.model.Booking;
import DACNTT.garage.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class BookingController {

    @Autowired
    private BookingHandle bookingHandle;

    @GetMapping("/admin/bookings")
    public ResponseEntity<Page<BookingDTO>> searchBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String loaiDichVu,
            @RequestParam(defaultValue = "ngayHen") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        return bookingHandle.searchBookings(page, size, search, trangThai,
                dateFrom, dateTo, loaiDichVu, sortBy, sortDir);
    }

    @GetMapping("/admin/bookings/all")
    public ResponseEntity<Page<BookingDTO>> getBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ngayHen,desc") String sort) {
        return bookingHandle.getBookings(page, size, sort);
    }

    @PostMapping("/customer/bookings")
    public ResponseEntity<?> addBookingCustomer(@RequestBody BookingDTO bookingDTO) {
        return bookingHandle.addBookingCustomer(bookingDTO);
    }

    @PostMapping("/admin/bookings")
    public ResponseEntity<?> addBooking(@RequestBody BookingDTO bookingDTO) {
        return bookingHandle.addBooking(bookingDTO);
    }

    @PutMapping("/admin/bookings/{maLich}")
    public ResponseEntity<?> updateBooking(
            @PathVariable String maLich,
            @RequestBody BookingDTO bookingDTO) {
        return bookingHandle.updateBooking(maLich, bookingDTO);
    }

    @PatchMapping("/admin/bookings/{maLich}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String maLich,
            @RequestBody Map<String, String> body) {

        String trangThai = body.get("trangThai");
        if (trangThai == null || trangThai.isBlank()) {
            return ResponseEntity.badRequest().body("Thiếu trường trangThai");
        }
        return bookingHandle.updateStatus(maLich, trangThai);
    }

    @DeleteMapping("/admin/bookings/{maLich}")
    public ResponseEntity<?> deleteBooking(@PathVariable String maLich) {
        return bookingHandle.deleteBooking(maLich);
    }
}