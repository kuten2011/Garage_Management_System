package DACNTT.garage.service;

import DACNTT.garage.dto.CustomerDTO;
import DACNTT.garage.dto.security.RegisterRequest;
import DACNTT.garage.model.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    List<Customer> getAllCustomers();

    Customer registerCustomer(RegisterRequest request, String encodedPassword);

    Customer createCustomer(Customer customer);

    Optional<Customer> getCustomerById(String maKH);

    Customer updateCustomer(Customer customer);

    void deleteCustomer(String maKH);
}