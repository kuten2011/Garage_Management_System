package DACNTT.garage.mapper;

import DACNTT.garage.dto.ServiceEntityDTO;
import DACNTT.garage.model.ServiceEntity;
import DACNTT.garage.service.ServiceEntityService;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ServiceEntityMapper {
    ServiceEntityDTO toServiceEntityDTO(ServiceEntity entity);
    ServiceEntity toEntity(ServiceEntityDTO dto);
}