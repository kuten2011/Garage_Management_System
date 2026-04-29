package DACNTT.garage.service;

import DACNTT.garage.model.Repair;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RepairService {
    Page<Repair> getAllRepairs(Pageable pageable);
    Repair findById(String maPhieu);
    Repair createRepair(Repair repair);
    Repair update(String maPhieu, Repair updateData);
    Repair updateStatus(String maPhieu, String trangThai);
    void deleteById(String maPhieu);
    Repair getRepairById(String maPhieu);
    Repair save(Repair repair);
//    Page<Repair> findByMaKH(String MakH, Pageable pageable);
}