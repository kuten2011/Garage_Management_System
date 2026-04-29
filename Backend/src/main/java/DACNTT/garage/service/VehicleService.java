package DACNTT.garage.service;

import DACNTT.garage.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface VehicleService {
    Page<Vehicle> getAllVehicles(Pageable pageable);
    Vehicle createVehicle(Vehicle vehicle);
    Vehicle updateVehicle(String bienSo, Vehicle vehicle);
    void deleteVehicle(String bienSo);
    Page<Vehicle> searchVehicles(String search, Integer kmFrom, Integer kmTo,
                                 Integer yearFrom, Integer yearTo, Pageable pageable);

    Optional<Vehicle> getVehicleById(String bienSo);
    Page<Vehicle> findByNgayBaoDuongTiepTheoBefore(LocalDate date, Pageable pageable);

    Page<Vehicle> findByNgayBaoDuongTiepTheoBetween(LocalDate from, LocalDate to, Pageable pageable);

    Page<Vehicle> findByNgayBaoDuongTiepTheoAfter(LocalDate date, Pageable pageable);
}