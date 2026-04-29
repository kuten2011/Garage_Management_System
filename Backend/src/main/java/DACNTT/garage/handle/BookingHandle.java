package DACNTT.garage.handle;

import DACNTT.garage.dto.BookingDTO;
import DACNTT.garage.dto.RepairDTO;
import DACNTT.garage.mapper.BookingMapper;
import DACNTT.garage.model.Booking;
import DACNTT.garage.model.Repair;
import DACNTT.garage.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BookingHandle {
    @Autowired
    private BookingService bookingService;
    @Autowired
    private BookingMapper bookingMapper;

    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        List<BookingDTO> bookingDTOs = new ArrayList<>();
        for (Booking booking : bookings) {
            bookingDTOs.add(bookingMapper.toBookingDTO(booking));
        }
        return ResponseEntity.ok(bookingDTOs);
    }

    public ResponseEntity<?> addBooking(BookingDTO bookingDTO) {
        try {
            Booking booking = bookingMapper.toEntity(bookingDTO);
            Booking saved = bookingService.addBooking(booking);
            BookingDTO result = bookingMapper.toBookingDTO(saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tạo booking: " + e.getMessage());
        }
    }

    public ResponseEntity<?> addBookingCustomer(BookingDTO bookingDTO) {
        try {
            Booking booking = bookingMapper.toEntity(bookingDTO);
            Booking saved = bookingService.addBookingCustomer(booking);
            BookingDTO result = bookingMapper.toBookingDTO(saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tạo booking: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateBooking(String maLich, BookingDTO bookingDTO) {
        try {
            Booking updated = bookingService.updateBooking(maLich, bookingDTO);
            return ResponseEntity.ok(bookingMapper.toBookingDTO(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy lịch hẹn với mã: " + maLich);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi cập nhật: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateStatus(String maLich, String trangThai) {
        try {
            Booking updated = bookingService.updateStatus(maLich, trangThai);
            return ResponseEntity.ok(bookingMapper.toBookingDTO(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy lịch hẹn: " + maLich);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi cập nhật trạng thái: " + e.getMessage());
        }
    }

    public ResponseEntity<?> deleteBooking(String maLich) {
        try {
            bookingService.deleteBooking(maLich);
            return ResponseEntity.ok("Xóa lịch hẹn thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy lịch hẹn: " + maLich);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi xóa: " + e.getMessage());
        }
    }

    public ResponseEntity<Page<BookingDTO>> getBookings(int page, int size, String sort) {
        try {
            Sort sortable;
            if (sort == null || sort.isBlank() || !sort.contains(",")) {
                sortable = Sort.by(Sort.Direction.DESC, "ngayHen");
            } else {
                String[] parts = sort.split(",");
                String property = parts[0].trim();
                Sort.Direction direction = parts.length > 1
                        ? Sort.Direction.fromString(parts[1].trim().toUpperCase())
                        : Sort.Direction.DESC;

                if (List.of("maLich", "ngayHen", "gioHen", "trangThai").contains(property)) {
                    sortable = Sort.by(direction, property);
                } else {
                    sortable = Sort.by(Sort.Direction.DESC, "ngayHen");
                }
            }

            Pageable pageable = PageRequest.of(page, size, sortable);
            Page<Booking> bookingPage = bookingService.getBookings(pageable);
            Page<BookingDTO> dtoPage = bookingPage.map(bookingMapper::toBookingDTO);

            return ResponseEntity.ok(dtoPage);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(null);
        }
    }

    public ResponseEntity<Page<BookingDTO>> searchBookings(
            int page, int size,
            String search, String trangThai,
            String dateFrom, String dateTo,
            String loaiDichVu,
            String sortBy, String sortDir) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "desc"),
                sortBy != null && !sortBy.isBlank() ? sortBy : "ngayHen");

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Booking> result = bookingService.searchBookings(
                search, trangThai, dateFrom, dateTo, loaiDichVu, pageable);

        Page<BookingDTO> dtoPage = result.map(bookingMapper::toBookingDTO);
        return ResponseEntity.ok(dtoPage);
    }
}