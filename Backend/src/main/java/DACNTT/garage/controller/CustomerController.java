package DACNTT.garage.controller;

import DACNTT.garage.dto.CustomerDTO;
import DACNTT.garage.handle.CustomerHandle;
import DACNTT.garage.mapper.CustomerMapper;
import DACNTT.garage.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CustomerController {

    @Autowired
    private CustomerHandle customerHandle;

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping(value = {"/admin/customers", "/admin/customers/"})
    public ResponseEntity<?> getAllCustomers() {
        return customerHandle.getAllCustomers();
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody CustomerDTO customerDTO) {
        return customerHandle.createCustomer(customerDTO);
    }

    @PutMapping("/admin/customers/{maKH}")
    public ResponseEntity<CustomerDTO> updateCustomer(
            @PathVariable String maKH,
            @RequestBody CustomerDTO customerDTO) {
        customerDTO.setMaKH(maKH);
        return customerHandle.updateCustomer(customerDTO);
    }

    @GetMapping("/customer/{maKH}")
    public ResponseEntity<CustomerDTO> getCustomerByMaKH(@PathVariable String maKH) {
        return customerRepository.findById(maKH)
                .map(customerMapper::toCustomerDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/customer/{maKH}")
    public ResponseEntity<CustomerDTO> updateCustomerTest(
            @PathVariable String maKH,
            @RequestBody CustomerDTO customerDTO) {
        if (customerDTO.getMaKH() != null && !customerDTO.getMaKH().equals(maKH)) {
            return ResponseEntity.badRequest().body(null);
        }
        customerDTO.setMaKH(maKH);
        return customerHandle.updateCustomer(customerDTO);
    }

    @DeleteMapping("/admin/customers/{maKH}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String maKH) {
        customerHandle.deleteCustomer(maKH);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/customer/by-email/{email}")
    public ResponseEntity<CustomerDTO> getCustomerByEmail(@PathVariable String email) {
        return customerRepository.findByEmail(email)
                .map(customerMapper::toCustomerDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/customer/by-email/{email}")
    public ResponseEntity<CustomerDTO> updateCustomerInUi(
            @PathVariable String email,
            @RequestBody CustomerDTO customerDTO) {
        String maKHH = customerRepository.findByEmail(email).get().getMaKH();
        if (customerDTO.getMaKH() != null && !customerDTO.getMaKH().equals(maKHH)) {
            return ResponseEntity.badRequest().body(null);
        }
        customerDTO.setMaKH(maKHH);
        return customerHandle.updateCustomer(customerDTO);
    }
}
