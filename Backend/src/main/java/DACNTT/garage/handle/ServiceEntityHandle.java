package DACNTT.garage.handle;

import DACNTT.garage.dto.ServiceEntityDTO;
import DACNTT.garage.mapper.ServiceEntityMapper;
import DACNTT.garage.model.ServiceEntity;
import DACNTT.garage.service.ServiceEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ServiceEntityHandle {

    @Autowired
    private ServiceEntityService serviceEntityService;

    @Autowired
    private ServiceEntityMapper serviceEntityMapper;

    public ResponseEntity<Page<ServiceEntityDTO>> getAllServices(
            int page, int size, String search, Double priceFrom, Double priceTo) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("maDV").ascending());

        Page<ServiceEntity> resultPage = serviceEntityService.searchServices(
                search, priceFrom, priceTo, pageable);

        Page<ServiceEntityDTO> dtoPage = resultPage.map(serviceEntityMapper::toServiceEntityDTO);

        return ResponseEntity.ok(dtoPage);
    }

    public ResponseEntity<ServiceEntityDTO> getServiceById(String maDV) {
        ServiceEntity entity = serviceEntityService.getById(maDV);
        return ResponseEntity.ok(serviceEntityMapper.toServiceEntityDTO(entity));
    }

    public ResponseEntity<ServiceEntityDTO> createService(ServiceEntityDTO dto) {
        ServiceEntity entity = serviceEntityMapper.toEntity(dto);
        ServiceEntity saved = serviceEntityService.save(entity);
        return ResponseEntity.status(201).body(serviceEntityMapper.toServiceEntityDTO(saved));
    }

    public ResponseEntity<ServiceEntityDTO> updateService(String maDV, ServiceEntityDTO dto) {
        ServiceEntity entity = serviceEntityMapper.toEntity(dto);
        entity.setMaDV(maDV); // Đảm bảo mã không đổi
        ServiceEntity updated = serviceEntityService.save(entity);
        return ResponseEntity.ok(serviceEntityMapper.toServiceEntityDTO(updated));
    }

    public void deleteService(String maDV) {
        serviceEntityService.deleteById(maDV);
    }
}