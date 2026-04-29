package DACNTT.garage.service;

import DACNTT.garage.model.ServiceEntity;
import DACNTT.garage.repository.ServiceEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ServiceEntityServiceImpl implements ServiceEntityService {

    @Autowired
    private ServiceEntityRepository serviceEntityRepository;

    @Override
    public Page<ServiceEntity> getAllServices(Pageable pageable) {
        return serviceEntityRepository.findAll(pageable);
    }

    @Override
    public Page<ServiceEntity> searchServices(String keyword, Double priceFrom, Double priceTo, Pageable pageable) {
        if ((keyword == null || keyword.trim().isEmpty()) && priceFrom == null && priceTo == null) {
            return serviceEntityRepository.findAll(pageable);
        }

        if ((priceFrom == null && priceTo == null) && (keyword != null && !keyword.trim().isEmpty())) {
            return serviceEntityRepository.findByTenDVContainingIgnoreCaseOrMaDVContainingIgnoreCase(
                    keyword, keyword, pageable);
        }

        if (priceFrom != null && priceTo == null) {
            return serviceEntityRepository.findByGiaTienGreaterThanEqual(priceFrom, pageable);
        }

        if (priceFrom == null && priceTo != null) {
            return serviceEntityRepository.findByGiaTienLessThanEqual(priceTo, pageable);
        }

        if (priceFrom != null && priceTo != null) {
            if (keyword == null || keyword.trim().isEmpty()) {
                return serviceEntityRepository.findByGiaTienBetween(priceFrom, priceTo, pageable);
            } else {
                return serviceEntityRepository.findByTenDVContainingIgnoreCaseOrMaDVContainingIgnoreCaseAndGiaTienBetween(
                        keyword, keyword, priceFrom, priceTo, pageable);
            }
        }

        return serviceEntityRepository.findAll(pageable);
    }

    @Override
    public ServiceEntity getById(String maDV) {
        return serviceEntityRepository.findById(maDV)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với mã: " + maDV));
    }

    @Override
    public ServiceEntity save(ServiceEntity entity) {
        return serviceEntityRepository.save(entity);
    }

    @Override
    public void deleteById(String maDV) {
        if (!serviceEntityRepository.existsById(maDV)) {
            throw new RuntimeException("Không tìm thấy dịch vụ để xóa: " + maDV);
        }
        serviceEntityRepository.deleteById(maDV);
    }
}