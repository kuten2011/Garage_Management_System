package DACNTT.garage.dto.payment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentCreateResponse {
    private String paymentUrl;
}
