package DACNTT.garage.mapper;

import DACNTT.garage.dto.RepairDTO;
import DACNTT.garage.model.Repair;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RepairMapper {

    // Map từ entity sang DTO – ignore các field sẽ set thủ công ở Handle
    @Mapping(source = "lichHen.maLich", target = "maLich")
    @Mapping(source = "nhanVien.maNV", target = "maNV")
    @Mapping(source = "xe.bienSo", target = "bienSo")
    @Mapping(source = "lichHen.khachHang", target = "khachHang")
    @Mapping(source = "xe", target = "xe")
    @Mapping(target = "tongTien", ignore = true) // tính thủ công
    RepairDTO toRepairDTO(Repair repair);

    // Map từ DTO sang entity khi tạo mới
    @Mapping(source = "maLich", target = "lichHen.maLich")
    @Mapping(source = "maNV", target = "nhanVien.maNV")
    @Mapping(source = "bienSo", target = "xe.bienSo")
    Repair toRepair(RepairDTO dto);

    // Update entity từ DTO – chỉ ignore các relation không muốn update
    @Mapping(target = "lichHen", ignore = true)
    @Mapping(target = "nhanVien", ignore = true)
    @Mapping(target = "xe", ignore = true)
    void updateRepairFromDTO(RepairDTO dto, @MappingTarget Repair repair);
}