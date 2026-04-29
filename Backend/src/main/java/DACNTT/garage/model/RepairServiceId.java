package DACNTT.garage.model;

import java.io.Serializable;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairServiceId implements Serializable {
    private String phieu;
    private String dichVu;
}