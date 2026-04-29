package DACNTT.garage.mapper;

import DACNTT.garage.dto.PartDTO;
import DACNTT.garage.model.Part;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PartMapper {
    PartDTO toPartDTO(Part part);
    Part toEntity(PartDTO dto);
}