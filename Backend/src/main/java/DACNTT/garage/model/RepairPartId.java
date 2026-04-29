package DACNTT.garage.model;

import java.io.Serializable;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairPartId implements Serializable {
    private String phieu;
    private String phuTung;
}
