package DACNTT.garage.controller;

import DACNTT.garage.dto.CustomerDTO;
import DACNTT.garage.handle.CustomerHandle;
import DACNTT.garage.mapper.CustomerMapper;
import DACNTT.garage.model.Customer;
import DACNTT.garage.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/api/customers/{maKH}")
    public ResponseEntity<CustomerDTO> getCustomerByMaKH(@PathVariable String maKH) {
        System.out.println("test");
        return customerRepository.findById(maKH)
                .map(customerMapper::toCustomerDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/api/customers/{maKH}")
    public ResponseEntity<CustomerDTO> updateCustomerTest(
            @PathVariable String maKH,
            @RequestBody CustomerDTO customerDTO) {
        // Nên kiểm tra maKH trong DTO có khớp với path không (tùy business rule)
        if (customerDTO.getMaKH() != null && !customerDTO.getMaKH().equals(maKH)) {
            return ResponseEntity.badRequest().body(null); // hoặc throw exception
        }
        customerDTO.setMaKH(maKH); // đảm bảo mã đúng
        return customerHandle.updateCustomer(customerDTO);
    }

    @DeleteMapping("/admin/customers/{maKH}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String maKH) {
        customerHandle.deleteCustomer(maKH);
        return ResponseEntity.noContent().build();
    }

    //Only in UI
    @GetMapping("/api/customers/api/{maKH}")
    public ResponseEntity<CustomerDTO> getCustomerByMaKHH(@PathVariable String maKH) {
        return customerRepository.findByEmail(maKH)
                .map(customerMapper::toCustomerDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/api/customers/api/{maKH}")
    public ResponseEntity<CustomerDTO> updateCustomerInUi(
            @PathVariable String maKH,
            @RequestBody CustomerDTO customerDTO) {
        String maKHH = customerRepository.findByEmail(maKH).get().getMaKH();
        System.out.println(maKHH);
        if (customerDTO.getMaKH() != null && !customerDTO.getMaKH().equals(maKHH)) {
            return ResponseEntity.badRequest().body(null); // hoặc throw exception
        }
        customerDTO.setMaKH(maKHH);
        return customerHandle.updateCustomer(customerDTO);
    }
}