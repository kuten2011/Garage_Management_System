package DACNTT.garage.service;

import DACNTT.garage.model.Customer;
import DACNTT.garage.model.Vehicle;
import DACNTT.garage.repository.CustomerRepository;
import DACNTT.garage.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Page<Vehicle> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable);
    }

    @Override
    public Optional<Vehicle> getVehicleById(String bienSo) {
        return vehicleRepository.findById(bienSo);
    }

    @Override
    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsById(vehicle.getBienSo())) {
            throw new RuntimeException("Biển số " + vehicle.getBienSo() + " đã tồn tại!");
        }

        // Nếu chưa có lịch bảo dưỡng → set mặc định từ hôm nay
        if (vehicle.getChuKyBaoDuongThang() != null && vehicle.getNgayBaoDuongTiepTheo() == null) {
            vehicle.setNgayBaoDuongTiepTheo(
                    LocalDate.now().plusMonths(vehicle.getChuKyBaoDuongThang())
            );
        }

        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle updateVehicle(String bienSo, Vehicle updateData) {
        Vehicle existing = getVehicleById(bienSo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe"));

        if (!bienSo.equals(updateData.getBienSo())) {
            existing.setBienSo(updateData.getBienSo());
        }

        if (updateData.getHangXe() != null) {
            existing.setHangXe(updateData.getHangXe());
        }
        if (updateData.getMauXe() != null) {
            existing.setMauXe(updateData.getMauXe());
        }
        if (updateData.getSoKm() != null) {
            existing.setSoKm(updateData.getSoKm());
        }
        if (updateData.getNamSX() != null) {
            existing.setNamSX(updateData.getNamSX());
        }
        if (updateData.getNgayBaoHanhDen() != null) {
            existing.setNgayBaoHanhDen(updateData.getNgayBaoHanhDen());
        }
        if (updateData.getNgayBaoDuongTiepTheo() != null) {
            existing.setNgayBaoDuongTiepTheo(updateData.getNgayBaoDuongTiepTheo());
        }
        if (updateData.getChuKyBaoDuongKm() != null) {
            existing.setChuKyBaoDuongKm(updateData.getChuKyBaoDuongKm());
        }
        if (updateData.getChuKyBaoDuongThang() != null) {
            existing.setChuKyBaoDuongThang(updateData.getChuKyBaoDuongThang());
        }

        // Sửa lỗi: dùng getKhachHang().getMaKH() thay vì getMaKH()
        if (updateData.getKhachHang() != null && updateData.getKhachHang().getMaKH() != null) {
            existing.getKhachHang().setMaKH(updateData.getKhachHang().getMaKH());
        }

        return vehicleRepository.save(existing);
    }

    @Override
    public void deleteVehicle(String bienSo) {
        vehicleRepository.deleteById(bienSo);
    }

    @Override
    public Page<Vehicle> searchVehicles(String search, Integer kmFrom, Integer kmTo,
                                        Integer yearFrom, Integer yearTo, Pageable pageable) {

        return vehicleRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("bienSo")), pattern),
                        cb.like(cb.lower(root.get("khachHang").get("maKH")), pattern),
                        cb.like(cb.lower(root.get("khachHang").get("hoTen")), pattern),
                        cb.like(cb.lower(root.get("hangXe")), pattern)
                ));
            }

            if (kmFrom != null) predicates.add(cb.ge(root.get("soKm"), kmFrom));
            if (kmTo != null) predicates.add(cb.le(root.get("soKm"), kmTo));
            if (yearFrom != null) predicates.add(cb.ge(root.get("namSX"), yearFrom));
            if (yearTo != null) predicates.add(cb.le(root.get("namSX"), yearTo));

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);
    }

    @Override
    public Page<Vehicle> findByNgayBaoDuongTiepTheoBefore(LocalDate date, Pageable pageable) {
        return vehicleRepository.findByNgayBaoDuongTiepTheoBefore(date, pageable);
    }

    @Override
    public Page<Vehicle> findByNgayBaoDuongTiepTheoBetween(LocalDate from, LocalDate to, Pageable pageable) {
        return vehicleRepository.findByNgayBaoDuongTiepTheoBetween(from, to, pageable);
    }

    @Override
    public Page<Vehicle> findByNgayBaoDuongTiepTheoAfter(LocalDate date, Pageable pageable) {
        return vehicleRepository.findByNgayBaoDuongTiepTheoAfter(date, pageable);
    }
}