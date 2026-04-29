// src/main/java/DACNTT/garage/mapper/VehicleMapper.java
package DACNTT.garage.mapper;

import DACNTT.garage.dto.VehicleDTO;
import DACNTT.garage.model.Customer;
import DACNTT.garage.model.Vehicle;

import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

    @Mapping(target = "maKH", source = "khachHang.maKH")
    @Mapping(target = "tenKH", source = "khachHang.hoTen")
    VehicleDTO toVehicleDTO(Vehicle vehicle);

    @Mapping(target = "khachHang", ignore = true) // Không map ngược object, chỉ dùng maKH
    Vehicle toVehicle(VehicleDTO dto);

    // Khi tạo mới, cần set khachHang từ maKH
    @AfterMapping
    default void setKhachHangFromMaKH(@MappingTarget Vehicle vehicle, VehicleDTO dto) {
        if (dto.getMaKH() != null && !dto.getMaKH().isEmpty()) {
            vehicle.setKhachHang(Customer.builder().maKH(dto.getMaKH()).build());
        }
    }
}