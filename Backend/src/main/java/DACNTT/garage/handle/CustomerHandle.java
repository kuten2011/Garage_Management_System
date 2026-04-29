package DACNTT.garage.handle;

import DACNTT.garage.dto.CustomerDTO;
import DACNTT.garage.dto.security.ErrorResponse;
import DACNTT.garage.dto.security.RegisterRequest;
import DACNTT.garage.mapper.CustomerMapper;
import DACNTT.garage.model.Customer;
import DACNTT.garage.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CustomerHandle {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        List<CustomerDTO> customerDTOs = new ArrayList<>();
        for (Customer customer : customers) {
            customerDTOs.add(customerMapper.toCustomerDTO(customer));
        }
        return ResponseEntity.ok(customerDTOs);
    }

    public ResponseEntity<?> registerCustomer(RegisterRequest request) {
        try {
            String encodedPassword = passwordEncoder.encode(request.getMatKhau());
            Customer customer = customerService.registerCustomer(request, encodedPassword);
            return ResponseEntity.status(HttpStatus.CREATED).body(customerMapper.toCustomerDTO(customer));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(e.getMessage()));
        }
    }

    public ResponseEntity<CustomerDTO> createCustomer(CustomerDTO customerDTO) {
        try {
            if (customerDTO.getMatKhau() == null || customerDTO.getMatKhau().isBlank()) {
                return ResponseEntity.badRequest().body(null);
            }
            String encodedPassword = passwordEncoder.encode(customerDTO.getMatKhau());
            Customer customer = customerMapper.toCustomer(customerDTO);
            customer.setMatKhau(encodedPassword);
            Customer saved = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(customerMapper.toCustomerDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    public ResponseEntity<CustomerDTO> updateCustomer(CustomerDTO customerDTO) {
        try {
            Customer existing = customerService.getCustomerById(customerDTO.getMaKH())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

            // PATCH: chỉ update field != null
            if (customerDTO.getHoTen() != null)
                existing.setHoTen(customerDTO.getHoTen());

            if (customerDTO.getSdt() != null)
                existing.setSdt(customerDTO.getSdt());

            if (customerDTO.getEmail() != null)
                existing.setEmail(customerDTO.getEmail());

            if (customerDTO.getDiaChi() != null)
                existing.setDiaChi(customerDTO.getDiaChi());

            // Đổi mật khẩu (nếu có)
            if (customerDTO.getMatKhau() != null && !customerDTO.getMatKhau().isBlank()) {
                existing.setMatKhau(passwordEncoder.encode(customerDTO.getMatKhau()));
            }

            Customer updated = customerService.updateCustomer(existing);
            return ResponseEntity.ok(customerMapper.toCustomerDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    public void deleteCustomer(String maKH) {
        customerService.deleteCustomer(maKH);
    }
}