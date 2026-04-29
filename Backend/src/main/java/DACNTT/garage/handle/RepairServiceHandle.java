package DACNTT.garage.handle;

import DACNTT.garage.dto.RepairServiceDTO;
import DACNTT.garage.mapper.RepairServiceMapper;
import DACNTT.garage.model.*;
import DACNTT.garage.repository.RepairRepository;
import DACNTT.garage.repository.ServiceEntityRepository;
import DACNTT.garage.repository.RepairServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RepairServiceHandle {

    @Autowired private RepairServiceRepository repairServiceRepository;
    @Autowired private RepairRepository repairRepository;
    @Autowired private ServiceEntityRepository serviceEntityRepository;
    @Autowired private RepairServiceMapper repairServiceMapper;

    public ResponseEntity<RepairServiceDTO> addService(RepairServiceDTO dto) {
        Repair phieu = repairRepository.findById(dto.getMaPhieu())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu: " + dto.getMaPhieu()));

        ServiceEntity dichVu = serviceEntityRepository.findById(dto.getMaDV())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ: " + dto.getMaDV()));

        RepairService entity = new RepairService();
        entity.setPhieu(phieu);
        entity.setDichVu(dichVu);
        entity.setSoLuong(dto.getSoLuong());

        entity.setThanhTien(dichVu.getGiaTien() * dto.getSoLuong());

        RepairService saved = repairServiceRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repairServiceMapper.toRepairServiceDTO(saved));
    }

    public void removeService(String maPhieu, String maDV) {
        RepairServiceId id = new RepairServiceId(maPhieu, maDV);
        if (!repairServiceRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy dịch vụ trong phiếu này!");
        }
        repairServiceRepository.deleteById(id);
    }

    public ResponseEntity<List<RepairServiceDTO>> getServicesByPhieu(String maPhieu) {
        List<RepairService> services = repairServiceRepository.findByPhieu_MaPhieu(maPhieu); // Thêm method này vào repository nếu chưa có
        List<RepairServiceDTO> dtos = services.stream()
                .map(repairServiceMapper::toRepairServiceDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}