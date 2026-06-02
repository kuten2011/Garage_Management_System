package DACNTT.garage.mapper;

import DACNTT.garage.dto.VehicleDTO;
import DACNTT.garage.model.Branch;
import DACNTT.garage.model.Customer;
import DACNTT.garage.model.Vehicle;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

    @Mapping(target = "maKH", source = "khachHang.maKH")
    @Mapping(target = "tenKH", source = "khachHang.hoTen")
    @Mapping(target = "maChiNhanh", source = "chiNhanh.maChiNhanh")
    @Mapping(target = "tenChiNhanh", source = "chiNhanh.tenChiNhanh")
    VehicleDTO toVehicleDTO(Vehicle vehicle);

    @Mapping(target = "khachHang", ignore = true)
    @Mapping(target = "chiNhanh", ignore = true)
    Vehicle toVehicle(VehicleDTO dto);

    @AfterMapping
    default void setRelationsFromIds(@MappingTarget Vehicle vehicle, VehicleDTO dto) {
        if (dto.getMaKH() != null && !dto.getMaKH().isBlank()) {
            vehicle.setKhachHang(Customer.builder().maKH(dto.getMaKH().trim()).build());
        }
        if (dto.getMaChiNhanh() != null && !dto.getMaChiNhanh().isBlank()) {
            Branch branch = new Branch();
            branch.setMaChiNhanh(dto.getMaChiNhanh().trim().toUpperCase());
            vehicle.setChiNhanh(branch);
        }
    }
}
