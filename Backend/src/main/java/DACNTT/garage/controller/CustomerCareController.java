// File: CustomerCareController.java
package DACNTT.garage.controller;

import DACNTT.garage.scheduler.CustomerCareScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/customer-care")
public class CustomerCareController {

    @Autowired
    private CustomerCareScheduler customerCareScheduler;

    @PostMapping("/run-manually")
    public ResponseEntity<?> runCustomerCareManually() {
        try {
            customerCareScheduler.sendCustomerCareEmails();
            return ResponseEntity.ok("Đã thực thi gửi email chăm sóc khách hàng thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Lỗi khi thực thi gửi email: " + e.getMessage());
        }
    }
}