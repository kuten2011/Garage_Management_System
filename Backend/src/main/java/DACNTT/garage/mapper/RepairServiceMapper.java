// src/main/java/DACNTT/garage/mapper/RepairServiceMapper.java
package DACNTT.garage.mapper;

import DACNTT.garage.dto.RepairServiceDTO;
import DACNTT.garage.model.RepairService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RepairServiceMapper {

    @Mapping(source = "phieu.maPhieu", target = "maPhieu")
    @Mapping(source = "dichVu.maDV", target = "maDV")
    @Mapping(source = "dichVu.tenDV", target = "tenDV")
    @Mapping(source = "dichVu.giaTien", target = "giaTien")
    RepairServiceDTO toRepairServiceDTO(RepairService repairService);
}