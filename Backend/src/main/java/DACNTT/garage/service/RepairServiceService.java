// src/main/java/DACNTT/garage/service/RepairServiceService.java
package DACNTT.garage.service;

import DACNTT.garage.model.RepairService;
import DACNTT.garage.model.RepairServiceId;

public interface RepairServiceService {
    RepairService save(RepairService repairService);
    void deleteById(RepairServiceId id);
    boolean existsById(RepairServiceId id);
    Double sumThanhTienByMaPhieu(String maPhieu);
}