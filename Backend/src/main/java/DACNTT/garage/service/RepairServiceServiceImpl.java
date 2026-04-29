package DACNTT.garage.service;

import DACNTT.garage.model.RepairService;
import DACNTT.garage.model.RepairServiceId;
import DACNTT.garage.repository.RepairServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RepairServiceServiceImpl implements RepairServiceService {

    @Autowired
    private RepairServiceRepository repairServiceRepository;

    @Override
    public RepairService save(RepairService repairService) {
        return repairServiceRepository.save(repairService);
    }

    @Override
    public void deleteById(RepairServiceId id) {
        repairServiceRepository.deleteById(id);
    }

    @Override
    public boolean existsById(RepairServiceId id) {
        return repairServiceRepository.existsById(id);
    }

    @Override
    public Double sumThanhTienByMaPhieu(String maPhieu) {
        return repairServiceRepository.sumThanhTienByMaPhieu(maPhieu);
    }
}