package DACNTT.garage.handle;

import DACNTT.garage.dto.ServiceEntityDTO;
import DACNTT.garage.dto.ServiceBatchCreateRequest;
import DACNTT.garage.mapper.ServiceEntityMapper;
import DACNTT.garage.model.ServiceEntity;
import DACNTT.garage.repository.BranchRepository;
import DACNTT.garage.service.ServiceEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ServiceEntityHandle {

    @Autowired
    private ServiceEntityService serviceEntityService;

    @Autowired
    private ServiceEntityMapper serviceEntityMapper;

    @Autowired
    private BranchRepository branchRepository;

    public ResponseEntity<Page<ServiceEntityDTO>> getAllServices(
            int page, int size, String search, Double priceFrom, Double priceTo, String maChiNhanh) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("maDV").ascending());

        Page<ServiceEntity> resultPage = serviceEntityService.searchServices(
                search, priceFrom, priceTo, maChiNhanh, pageable);

        Page<ServiceEntityDTO> dtoPage = resultPage.map(serviceEntityMapper::toServiceEntityDTO);

        return ResponseEntity.ok(dtoPage);
    }

    public ResponseEntity<ServiceEntityDTO> getServiceById(String maDV) {
        ServiceEntity entity = serviceEntityService.getById(maDV);
        return ResponseEntity.ok(serviceEntityMapper.toServiceEntityDTO(entity));
    }

    public ResponseEntity<ServiceEntityDTO> createService(ServiceEntityDTO dto) {
        try {
            dto.setMaChiNhanh(resolveRequiredBranch(dto.getMaChiNhanh()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        ServiceEntity entity = serviceEntityMapper.toEntity(dto);
        ServiceEntity saved = serviceEntityService.save(entity);
        return ResponseEntity.status(201).body(serviceEntityMapper.toServiceEntityDTO(saved));
    }

    public ResponseEntity<List<ServiceEntityDTO>> createServicesBatch(ServiceBatchCreateRequest request) {
        try {
            if (request == null || request.getTenDV() == null || request.getTenDV().isBlank()) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getGiaTien() == null) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getMaChiNhanhList() == null || request.getMaChiNhanhList().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<ServiceEntityDTO> created = new ArrayList<>();
            for (String branchCode : request.getMaChiNhanhList()) {
                String maChiNhanh = resolveRequiredBranch(branchCode);
                ServiceEntityDTO dto = ServiceEntityDTO.builder()
                        .maDV(serviceEntityService.generateNextMaDV())
                        .tenDV(request.getTenDV().trim())
                        .giaTien(request.getGiaTien())
                        .moTa(request.getMoTa())
                        .maChiNhanh(maChiNhanh)
                        .build();
                ServiceEntity entity = serviceEntityMapper.toEntity(dto);
                ServiceEntity saved = serviceEntityService.save(entity);
                created.add(serviceEntityMapper.toServiceEntityDTO(saved));
            }
            return ResponseEntity.status(201).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<ServiceEntityDTO> updateService(String maDV, ServiceEntityDTO dto) {
        try {
            dto.setMaChiNhanh(resolveRequiredBranch(dto.getMaChiNhanh()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        ServiceEntity entity = serviceEntityMapper.toEntity(dto);
        entity.setMaDV(maDV); // Đảm bảo mã không đổi
        ServiceEntity updated = serviceEntityService.save(entity);
        return ResponseEntity.ok(serviceEntityMapper.toServiceEntityDTO(updated));
    }

    public void deleteService(String maDV) {
        serviceEntityService.deleteById(maDV);
    }

    private String resolveRequiredBranch(String maChiNhanh) {
        if (maChiNhanh == null || maChiNhanh.isBlank()) {
            throw new IllegalArgumentException("Dịch vụ phải thuộc một chi nhánh");
        }
        String normalized = maChiNhanh.trim().toUpperCase();
        if (!branchRepository.existsById(normalized)) {
            throw new IllegalArgumentException("Không tìm thấy chi nhánh: " + normalized);
        }
        return normalized;
    }
}
