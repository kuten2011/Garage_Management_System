package DACNTT.garage.mapper;

import DACNTT.garage.dto.BranchDTO;
import DACNTT.garage.model.Branch;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BranchMapper {
    BranchDTO toBranchDTO(Branch branch);
    Branch toEntity(BranchDTO dto);
}