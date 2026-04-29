package DACNTT.garage.controller;

import DACNTT.garage.dto.payment.PaymentCreateRequest;
import DACNTT.garage.dto.payment.PaymentCreateResponse;
import DACNTT.garage.dto.payment.PaymentReturnResponse;
import DACNTT.garage.handle.PaymentHandle;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@RequestMapping("/admin/payment")
public class PaymentController {
    @Autowired
    private PaymentHandle paymentHandle;

    @PostMapping("/create")
    public ResponseEntity<PaymentCreateResponse> createPayment(
            @RequestBody PaymentCreateRequest paymentCreateRequest,
            HttpServletRequest request) {
        return paymentHandle.handleCreatePayment(paymentCreateRequest, request);
    }

    @GetMapping("/vnpay-return")
    public RedirectView paymentReturn(@RequestParam Map<String, String> params) {
        return paymentHandle.handlePaymentReturn(params);
    }

    @GetMapping("/vnpay-ipn")
    public ResponseEntity<?> paymentIPN(@RequestParam Map<String, String> params) {
        return paymentHandle.handlePaymentIPN(params);
    }
}
