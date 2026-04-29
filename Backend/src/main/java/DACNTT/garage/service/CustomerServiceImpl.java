package DACNTT.garage.service;

import DACNTT.garage.dto.security.RegisterRequest;
import DACNTT.garage.model.Customer;
import DACNTT.garage.repository.CustomerRepository;
import DACNTT.garage.util.Enum.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAllWithVehicles(); // Load kèm xeList
    }

    private String generateCustomerId() {
        String lastId = customerRepository.findAll()
                .stream()
                .map(Customer::getMaKH)
                .filter(id -> id != null && id.startsWith("KH"))
                .max(Comparator.comparingInt(id -> Integer.parseInt(id.substring(2))))
                .orElse("KH00");

        int nextNumber = Integer.parseInt(lastId.substring(2)) + 1;
        return String.format("KH%02d", nextNumber);
    }

    public boolean isEmailExists(String email) {
        return customerRepository.existsByEmail(email);
    }

    public boolean isPhoneExists(String sdt) {
        return customerRepository.existsBySdt(sdt);
    }

    @Override
    public Customer registerCustomer(RegisterRequest request, String encodedPassword) {
        if (isEmailExists(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        if (isPhoneExists(request.getSdt())) {
            throw new RuntimeException("Số điện thoại đã được sử dụng");
        }

        Customer customer = new Customer();
        customer.setMaKH(generateCustomerId());
        customer.setHoTen(request.getHoTen().trim());
        customer.setSdt(request.getSdt());
        customer.setEmail(request.getEmail().toLowerCase());
        customer.setDiaChi(request.getDiaChi() != null ? request.getDiaChi().trim() : "");
        customer.setMatKhau(encodedPassword);
        customer.setRole(Role.ROLE_CUSTOMER);

        return customerRepository.save(customer);
    }

    @Override
    public Customer createCustomer(Customer customer) {
        customer.setMaKH(generateCustomerId());
        customer.setRole(Role.ROLE_CUSTOMER);
        return customerRepository.save(customer);
    }

    @Override
    public Optional<Customer> getCustomerById(String maKH) {
        return customerRepository.findById(maKH);
    }

    @Override
    public Customer updateCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public void deleteCustomer(String maKH) {
        if (!customerRepository.existsById(maKH)) {
            throw new RuntimeException("Không tìm thấy khách hàng với mã: " + maKH);
        }
        customerRepository.deleteById(maKH);
    }
}