package DACNTT.garage.service;

import DACNTT.garage.model.ServiceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ServiceEntityService {
    Page<ServiceEntity> getAllServices(Pageable pageable);
    Page<ServiceEntity> searchServices(String keyword, Double priceFrom, Double priceTo, String maChiNhanh, Pageable pageable);
    ServiceEntity getById(String maDV);
    ServiceEntity save(ServiceEntity entity);
    String generateNextMaDV();
    void deleteById(String maDV);
}
