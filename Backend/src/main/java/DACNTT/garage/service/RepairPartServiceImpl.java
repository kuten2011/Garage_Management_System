package DACNTT.garage.service;

import DACNTT.garage.model.RepairPart;
import DACNTT.garage.model.RepairPartId;
import DACNTT.garage.repository.RepairPartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RepairPartServiceImpl implements RepairPartService {
    @Autowired
    private RepairPartRepository repairPartRepository;
    @Override
    public RepairPart save(RepairPart repairPart) {
        return repairPartRepository.save(repairPart);
    }

    @Override
    public void deleteById(RepairPartId id) {
        repairPartRepository.deleteById(id);
    }

    @Override
    public boolean existsById(RepairPartId id) {
        return repairPartRepository.existsById(id);
    }

    @Override
    public Double sumThanhTienByMaPhieu(String maPhieu) {
        return repairPartRepository.sumThanhTienByMaPhieu(maPhieu);
    }
}
