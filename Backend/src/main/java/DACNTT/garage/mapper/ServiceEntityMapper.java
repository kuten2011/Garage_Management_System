package DACNTT.garage.mapper;

import DACNTT.garage.dto.ServiceEntityDTO;
import DACNTT.garage.model.Branch;
import DACNTT.garage.model.ServiceEntity;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ServiceEntityMapper {

    @Mapping(target = "maChiNhanh", source = "chiNhanh.maChiNhanh")
    @Mapping(target = "tenChiNhanh", source = "chiNhanh.tenChiNhanh")
    ServiceEntityDTO toServiceEntityDTO(ServiceEntity entity);

    @Mapping(target = "chiNhanh", ignore = true)
    ServiceEntity toEntity(ServiceEntityDTO dto);

    @AfterMapping
    default void setBranchFromId(@MappingTarget ServiceEntity entity, ServiceEntityDTO dto) {
        if (dto.getMaChiNhanh() != null && !dto.getMaChiNhanh().isBlank()) {
            Branch branch = new Branch();
            branch.setMaChiNhanh(dto.getMaChiNhanh().trim().toUpperCase());
            entity.setChiNhanh(branch);
        }
    }
}
