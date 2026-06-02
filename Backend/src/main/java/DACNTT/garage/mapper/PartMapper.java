package DACNTT.garage.mapper;

import DACNTT.garage.dto.PartDTO;
import DACNTT.garage.model.Branch;
import DACNTT.garage.model.Part;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PartMapper {

    @Mapping(target = "maChiNhanh", source = "chiNhanh.maChiNhanh")
    @Mapping(target = "tenChiNhanh", source = "chiNhanh.tenChiNhanh")
    PartDTO toPartDTO(Part part);

    @Mapping(target = "chiNhanh", ignore = true)
    Part toEntity(PartDTO dto);

    @AfterMapping
    default void setBranchFromId(@MappingTarget Part part, PartDTO dto) {
        if (dto.getMaChiNhanh() != null && !dto.getMaChiNhanh().isBlank()) {
            Branch branch = new Branch();
            branch.setMaChiNhanh(dto.getMaChiNhanh().trim().toUpperCase());
            part.setChiNhanh(branch);
        }
    }
}
