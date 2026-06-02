package DACNTT.garage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceBatchCreateRequest {
    private String tenDV;
    private Double giaTien;
    private String moTa;
    @Builder.Default
    private List<String> maChiNhanhList = new ArrayList<>();
}
