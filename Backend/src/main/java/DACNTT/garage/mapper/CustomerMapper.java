package DACNTT.garage.mapper;

import DACNTT.garage.dto.CustomerDTO;
import DACNTT.garage.model.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = { VehicleMapper.class })
public interface CustomerMapper {

    @Mapping(target = "xeList", source = "xeList")
    CustomerDTO toCustomerDTO(Customer customer);

    @Mapping(target = "xeList", ignore = true)
    @Mapping(target = "matKhau", ignore = true)
    @Mapping(target = "role", constant = "ROLE_CUSTOMER")
    @Mapping(target = "maKH", ignore = true)
    Customer toCustomer(CustomerDTO customerDTO);

    @Mapping(target = "xeList", ignore = true)
    @Mapping(target = "matKhau", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "maKH", ignore = true)
    void updateCustomerFromDTO(CustomerDTO customerDTO, @MappingTarget Customer customer);
}