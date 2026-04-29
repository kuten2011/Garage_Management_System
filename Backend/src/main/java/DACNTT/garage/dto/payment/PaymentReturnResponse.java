package DACNTT.garage.dto.payment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentReturnResponse {
    private String status;
    private String message;
    private String transactionId;
    private Long amount;
    private String responseCode;
}
