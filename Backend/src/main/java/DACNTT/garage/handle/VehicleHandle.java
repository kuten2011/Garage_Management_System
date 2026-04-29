package DACNTT.garage.handle;

import DACNTT.garage.dto.VehicleDTO;
import DACNTT.garage.mapper.VehicleMapper;
import DACNTT.garage.model.Customer;
import DACNTT.garage.model.Vehicle;
import DACNTT.garage.repository.CustomerRepository;
import DACNTT.garage.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Component
public class VehicleHandle {

    @Autowired private VehicleService vehicleService;
    @Autowired private VehicleMapper vehicleMapper;

    @Autowired private CustomerRepository customerRepository;

    public ResponseEntity<Page<VehicleDTO>> getAllVehicles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("bienSo").ascending());
        Page<Vehicle> vehicles = vehicleService.getAllVehicles(pageable);
        Page<VehicleDTO> dtoPage = vehicles.map(vehicleMapper::toVehicleDTO);
        return ResponseEntity.ok(dtoPage);
    }

    public ResponseEntity<Page<VehicleDTO>> getVehicles(
            int page,
            int size,
            String search,
            String filter
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("ngayBaoDuongTiepTheo").ascending());

        Page<Vehicle> vehicles;

        // ===============================
        // 1. Không filter, không search
        // ===============================
        if ((search == null || search.isBlank()) && (filter == null || filter.equals("ALL"))) {
            vehicles = vehicleService.getAllVehicles(pageable);
        }

        // ===============================
        // 2. Chỉ search
        // ===============================
        else if (filter == null || filter.equals("ALL")) {
            vehicles = vehicleService.searchVehicles(search, null, null, null, null, pageable);
        }

        // ===============================
        // 3. Có filter bảo dưỡng
        // ===============================
        else {
            LocalDate today = LocalDate.now();

            switch (filter) {
                case "OVERDUE" -> {
                    // Xe quá hạn bảo dưỡng
                    vehicles = vehicleService.findByNgayBaoDuongTiepTheoBefore(today, pageable);
                }
                case "DUE_SOON" -> {
                    // Sắp tới hạn (trong 7 ngày)
                    vehicles = vehicleService.findByNgayBaoDuongTiepTheoBetween(
                            today,
                            today.plusDays(7),
                            pageable
                    );
                }
                case "OK" -> {
                    // Còn hạn
                    vehicles = vehicleService.findByNgayBaoDuongTiepTheoAfter(today.plusDays(7), pageable);
                }
                default -> vehicles = vehicleService.getAllVehicles(pageable);
            }

            // Nếu có search + filter
            if (search != null && !search.isBlank()) {
                String s = search.toLowerCase();

                List<Vehicle> filtered = vehicles.getContent().stream()
                        .filter(v ->
                                v.getBienSo().toLowerCase().contains(s)
                                        || (v.getKhachHang().getMaKH() != null && customerRepository
                                        .findById(v.getKhachHang().getMaKH())
                                        .map(c -> c.getHoTen().toLowerCase().contains(s))
                                        .orElse(false))
                        )
                        .toList();

                vehicles = new PageImpl<>(
                        filtered,
                        pageable,
                        filtered.size()
                );
            }
        }

        return ResponseEntity.ok(vehicles.map(vehicleMapper::toVehicleDTO));
    }

    public ResponseEntity<VehicleDTO> getVehicleById(String bienSo) {
        Vehicle vehicle = vehicleService.getVehicleById(bienSo).get();
        return ResponseEntity.ok(vehicleMapper.toVehicleDTO(vehicle));
    }

    public ResponseEntity<VehicleDTO> createVehicle(VehicleDTO dto) {
        Vehicle vehicle = vehicleMapper.toVehicle(dto);
        Vehicle saved = vehicleService.createVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleMapper.toVehicleDTO(saved));
    }

    public ResponseEntity<VehicleDTO> updateVehicle(String bienSo, VehicleDTO dto) {
        // Lấy xe hiện tại từ service (service trả về Vehicle trực tiếp, không Optional)
        Vehicle existing = vehicleService.getVehicleById(bienSo).get();

        if (existing == null) {
            throw new RuntimeException("Không tìm thấy xe với biển số: " + bienSo);
        }

        // Map từ DTO sang entity (cập nhật các field)
        Vehicle vehicleToUpdate = vehicleMapper.toVehicle(dto);
        vehicleToUpdate.setBienSo(bienSo); // Giữ nguyên biển số (primary key)

        // Gọi method update của service
        Vehicle updated = vehicleService.updateVehicle(bienSo, vehicleToUpdate);

        return ResponseEntity.ok(vehicleMapper.toVehicleDTO(updated));
    }

    public ResponseEntity<Void> deleteVehicle(String bienSo) {
        vehicleService.deleteVehicle(bienSo);
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<VehicleDTO> patchVehicle(String bienSo, Map<String, Object> updates) {
        Vehicle existing = vehicleService.getVehicleById(bienSo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe: " + bienSo));

        // Chỉ cập nhật các field có trong updates
        updates.forEach((key, value) -> {
            switch (key) {
                case "maKH" -> {
                    if (value != null && !value.toString().trim().isEmpty()) {
                        String newMaKH = value.toString().trim();
                        // Tạo Customer tạm chỉ có maKH để Hibernate tự load full entity khi save
                        Customer newCustomer = new Customer();
                        newCustomer.setMaKH(newMaKH);
                        existing.setKhachHang(newCustomer);
                    } else {
                        throw new IllegalArgumentException("Mã khách hàng không được để trống khi cập nhật");
                    }
                }
                case "hangXe" -> existing.setHangXe(value instanceof String ? (String) value : null);
                case "mauXe" -> existing.setMauXe(value instanceof String ? (String) value : null);
                case "soKm" -> existing.setSoKm(value instanceof Integer ? (Integer) value : null);
                case "namSX" -> existing.setNamSX(value instanceof Integer ? (Integer) value : null);
                case "ngayBaoHanhDen" ->
                        existing.setNgayBaoHanhDen(value == null || value.toString().isEmpty()
                                ? null : LocalDate.parse(value.toString()));
                case "ngayBaoDuongTiepTheo" ->
                        existing.setNgayBaoDuongTiepTheo(value == null || value.toString().isEmpty()
                                ? null : LocalDate.parse(value.toString()));
                case "chuKyBaoDuongKm" ->
                        existing.setChuKyBaoDuongKm(value instanceof Integer ? (Integer) value : null);
                case "chuKyBaoDuongThang" ->
                        existing.setChuKyBaoDuongKm(value instanceof Integer ? (Integer) value : null);
                default -> { /* Bỏ qua field không hợp lệ */ }
            }
        });

        // Tự động cập nhật ngày bảo dưỡng tiếp theo nếu thay đổi chu kỳ tháng
        if (updates.containsKey("chuKyBaoDuongThang") && existing.getChuKyBaoDuongThang() != null) {
            existing.setNgayBaoDuongTiepTheo(
                    LocalDate.now().plusMonths(existing.getChuKyBaoDuongThang())
            );
        }

        Vehicle updated = vehicleService.updateVehicle(bienSo, existing);
        return ResponseEntity.ok(vehicleMapper.toVehicleDTO(updated));
    }
}