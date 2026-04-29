package DACNTT.garage.service;

import DACNTT.garage.model.RepairPart;
import DACNTT.garage.model.RepairPartId;

public interface RepairPartService {
    RepairPart save(RepairPart repairPart);
    void deleteById(RepairPartId id);
    boolean existsById(RepairPartId id);
    Double sumThanhTienByMaPhieu(String maPhieu);
}