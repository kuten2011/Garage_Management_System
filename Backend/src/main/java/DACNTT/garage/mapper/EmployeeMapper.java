package DACNTT.garage.mapper;

import DACNTT.garage.dto.EmployeeDTO;
import DACNTT.garage.model.Branch;
import DACNTT.garage.model.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(source = "chiNhanh.maChiNhanh", target = "maChiNhanh")
    EmployeeDTO toEmployeeDTO(Employee employee);

    // Không cần map role ở đây vì sẽ set thủ công ở service
    @Mapping(target = "chiNhanh", ignore = true)
    @Mapping(target = "role", ignore = true)  // quan trọng: ignore để tránh null
    Employee toEmployee(EmployeeDTO employeeDTO);
}