package DACNTT.garage.service;

import DACNTT.garage.dto.BookingDTO;
import DACNTT.garage.model.Booking;
import DACNTT.garage.model.Customer;
import DACNTT.garage.model.Vehicle;
import DACNTT.garage.repository.BookingRepository;
import DACNTT.garage.repository.CustomerRepository;
import DACNTT.garage.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking addBooking(Booking booking) {
        if (booking.getMaLich() == null || booking.getMaLich().trim().isEmpty()) {
            booking.setMaLich(generateNextMaLich());
        }

        String maKH = booking.getMaKH() != null ? booking.getMaKH()
                : (booking.getKhachHang() != null ? booking.getKhachHang().getMaKH() : null);
        if (maKH == null || maKH.isBlank()) {
            throw new RuntimeException("Mã khách hàng không được để trống!");
        }
        Customer customer = customerRepository.findById(maKH)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng: " + maKH));
        booking.setKhachHang(customer);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking addBookingCustomer(Booking booking) {
        if (booking.getMaLich() == null || booking.getMaLich().trim().isEmpty()) {
            booking.setMaLich(generateNextMaLich());
        }

        String maKH = booking.getMaKH() != null ? booking.getMaKH()
                : (booking.getKhachHang() != null ? booking.getKhachHang().getMaKH() : null);
        if (maKH == null || maKH.isBlank()) {
            throw new RuntimeException("Mã khách hàng không được để trống!");
        }
        Customer customer = customerRepository.findByEmail(maKH)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng: " + maKH));
        booking.setKhachHang(customer);

        return bookingRepository.save(booking);
    }

    private String generateNextMaLich() {
        Booking lastBooking = bookingRepository.findTopByOrderByMaLichDesc()
                .orElse(null);

        if (lastBooking == null || lastBooking.getMaLich() == null) {
            return "LH01";
        }

        String lastCode = lastBooking.getMaLich();

        try {
            int lastNumber = Integer.parseInt(lastCode.substring(2));
            int nextNumber = lastNumber + 1;

            return String.format("LH%02d", nextNumber);
        } catch (Exception e) {
            return "LH01";
        }
    }

    @Override
    public Booking updateBooking(String maLich, BookingDTO dto) {
        Booking booking = bookingRepository.findById(maLich)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn: " + maLich));

        Customer customer = customerRepository.findById(dto.getMaKH())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng: " + dto.getMaKH()));

        booking.setKhachHang(customer);
        booking.setNgayHen(dto.getNgayHen());
        booking.setGioHen(dto.getGioHen());
        booking.setTrangThai(dto.getTrangThai());
        booking.setGhiChu(dto.getGhiChu());

        return bookingRepository.save(booking);
    }

    @Override
    public Booking updateStatus(String maLich, String trangThai) {
        Booking booking = bookingRepository.findById(maLich)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn: " + maLich));

        if (!List.of("Chờ xác nhận", "Đã xác nhận", "Hoàn thành").contains(trangThai)) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ");
        }

        booking.setTrangThai(trangThai);
        return bookingRepository.save(booking);
    }

    @Override
    public void deleteBooking(String maLich) {
        Booking booking = bookingRepository.findById(maLich)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn: " + maLich));
        bookingRepository.delete(booking);
    }

    @Override
    public Page<Booking> getBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable);
    }

    @Override
    public Page<Booking> searchBookings(String search,
                                        String trangThai,
                                        String dateFrom,
                                        String dateTo,
                                        String loaiDichVu,
                                        Pageable pageable) {

        return bookingRepository.findAll((root, query, cb) -> {
            var predicates = new ArrayList<Predicate>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("xe").get("bienSo")), pattern),
                        cb.like(cb.lower(root.get("khachHang").get("tenKH")), pattern),
                        cb.like(root.get("khachHang").get("soDienThoai"), pattern)
                ));
            }

            if (trangThai != null && !trangThai.isBlank()) {
                predicates.add(cb.equal(root.get("trangThai"), trangThai));
            }

            if (dateFrom != null && !dateFrom.isBlank()) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("ngayHen"), LocalDate.parse(dateFrom)));
            }

            if (dateTo != null && !dateTo.isBlank()) {
                predicates.add(cb.lessThanOrEqualTo(root.get("ngayHen"), LocalDate.parse(dateTo)));
            }

            return predicates.isEmpty()
                    ? cb.conjunction()
                    : cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);
    }
}