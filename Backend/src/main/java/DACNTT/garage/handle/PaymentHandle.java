package DACNTT.garage.handle;

import DACNTT.garage.dto.payment.PaymentCreateRequest;
import DACNTT.garage.dto.payment.PaymentCreateResponse;
import DACNTT.garage.dto.payment.PaymentReturnResponse;
import DACNTT.garage.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

@Component
public class PaymentHandle {
    @Autowired
    private VNPayService vnPayService;

    public ResponseEntity<PaymentCreateResponse> handleCreatePayment(
            PaymentCreateRequest request,
            HttpServletRequest httpRequest) {

        try {
            if (request.getAmount() <= 0) {
                PaymentCreateResponse errorResponse = PaymentCreateResponse.builder()
                        .paymentUrl(null)
                        .build();
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String ipAddress = getIpAddress(httpRequest);
            String paymentUrl = vnPayService.createPaymentUrl(request.getAmount(), ipAddress);

            PaymentCreateResponse response = PaymentCreateResponse.builder()
                    .paymentUrl(paymentUrl)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            PaymentCreateResponse errorResponse = PaymentCreateResponse.builder()
                    .paymentUrl(null)
                    .build();
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    public RedirectView handlePaymentReturn(Map<String, String> params) {
        try {
            boolean isValid = vnPayService.verifyPayment(params);

            if (!isValid) {
                return redirectToFrontend("failed", params, "Chữ ký không hợp lệ");
            }

            String responseCode = params.get("vnp_ResponseCode");
            String txnRef = params.get("vnp_TxnRef");

            if ("00".equals(responseCode)) {
                return redirectToFrontend("success", params, null);
            } else {
                return redirectToFrontend("failed", params, null);
            }
        } catch (Exception e) {
            return redirectToFrontend("failed", params, "Lỗi xử lý thanh toán");
        }
    }

    private RedirectView redirectToFrontend(String status, Map<String, String> params, String errorMessage) {
        StringBuilder url = new StringBuilder("http://localhost:5173/payment/" + status + "?");

        try {
            if (params.containsKey("vnp_Amount")) {
                url.append("amount=").append(params.get("vnp_Amount")).append("&");
            }
            if (params.containsKey("vnp_TxnRef")) {
                url.append("txnRef=").append(params.get("vnp_TxnRef")).append("&");
            }
            if (params.containsKey("vnp_TransactionNo")) {
                url.append("transactionId=").append(params.get("vnp_TransactionNo")).append("&");
            }
            if (params.containsKey("vnp_OrderInfo")) {
                url.append("orderInfo=").append(URLEncoder.encode(params.get("vnp_OrderInfo"), "UTF-8")).append("&");
            }
            if (params.containsKey("vnp_ResponseCode")) {
                url.append("responseCode=").append(params.get("vnp_ResponseCode")).append("&");
            }
            if (params.containsKey("vnp_BankCode")) {
                url.append("bankCode=").append(params.get("vnp_BankCode")).append("&");
            }
            if (params.containsKey("vnp_PayDate")) {
                url.append("payDate=").append(params.get("vnp_PayDate")).append("&");
            }

            if (errorMessage != null) {
                url.append("message=").append(URLEncoder.encode(errorMessage, "UTF-8")).append("&");
            }

            if (url.length() > 0 && url.charAt(url.length() - 1) == '&') {
                url.deleteCharAt(url.length() - 1);
            }

        } catch (UnsupportedEncodingException e) {
            System.err.println("Error encoding URL: " + e.getMessage());
        }

        return new RedirectView(url.toString());
    }

    public ResponseEntity<?> handlePaymentIPN(Map<String, String> params) {
        try {
            boolean isValid = vnPayService.verifyPayment(params);
            if (!isValid) {
                return ResponseEntity.ok(Map.of("RspCode", "97", "Message", "Invalid Signature"));
            }

            String responseCode = params.get("vnp_ResponseCode");
            String txnRef = params.get("vnp_TxnRef");
            long amount = Long.parseLong(params.get("vnp_Amount")) / 100;

            if ("00".equals(responseCode)) {
                // Xử lý thanh toán thành công
                // TODO: Update database;
                System.out.println("Payment SUCCESS - TxnRef: " + txnRef + ", Amount: " + amount);
            } else {
                // Xử lý thanh toán thất bại
                // TODO: Update database;
                System.out.println("Payment FAILED - TxnRef: " + txnRef + ", ResponseCode: " + responseCode);
            }
            return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
        } catch (Exception e) {
            // 4. Nếu có lỗi trong quá trình xử lý
            System.err.println("Error processing IPN: " + e.getMessage());
            return ResponseEntity.ok(Map.of("RspCode", "99", "Message", "Unknown error"));
        }
    }

    private String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }
}
