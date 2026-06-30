package DACNTT.garage.service;

import DACNTT.garage.model.ServiceEntity;
import DACNTT.garage.repository.ServiceEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Page<ServiceEntity> searchServices(String keyword, Double priceFrom, Double priceTo, String maChiNhanh, Pageable pageable) {
        if ((keyword == null || keyword.trim().isEmpty()) && priceFrom == null && priceTo == null && (maChiNhanh == null || maChiNhanh.isBlank())) {
            return serviceEntityRepository.findAll(pageable);
        }

        if ((priceFrom == null && priceTo == null) && (keyword != null && !keyword.trim().isEmpty()) && (maChiNhanh == null || maChiNhanh.isBlank())) {
            return serviceEntityRepository.findByTenDVContainingIgnoreCaseOrMaDVContainingIgnoreCase(
                    keyword, keyword, pageable);
        }

        if (priceFrom != null && priceTo == null && (maChiNhanh == null || maChiNhanh.isBlank())) {
            return serviceEntityRepository.findByGiaTienGreaterThanEqual(priceFrom, pageable);
        }

        if (priceFrom == null && priceTo != null && (maChiNhanh == null || maChiNhanh.isBlank())) {
            return serviceEntityRepository.findByGiaTienLessThanEqual(priceTo, pageable);
        }

        if (priceFrom != null && priceTo != null && (maChiNhanh == null || maChiNhanh.isBlank())) {
            if (keyword == null || keyword.trim().isEmpty()) {
                return serviceEntityRepository.findByGiaTienBetween(priceFrom, priceTo, pageable);
            } else {
                return serviceEntityRepository.findByTenDVContainingIgnoreCaseOrMaDVContainingIgnoreCaseAndGiaTienBetween(
                        keyword, keyword, priceFrom, priceTo, pageable);
            }
        }

        return serviceEntityRepository.findAll((root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("tenDV")), pattern),
                        cb.like(cb.lower(root.get("maDV")), pattern)
                ));
            }
            if (priceFrom != null) {
                predicates.add(cb.ge(root.get("giaTien"), priceFrom));
            }
            if (priceTo != null) {
                predicates.add(cb.le(root.get("giaTien"), priceTo));
            }
            if (maChiNhanh != null && !maChiNhanh.isBlank()) {
                predicates.add(cb.equal(root.join("chiNhanh").get("maChiNhanh"), maChiNhanh.trim().toUpperCase()));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        }, pageable);
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
    public String generateNextMaDV() {
        return serviceEntityRepository.findTopByOrderByMaDVDesc()
                .map(entity -> {
                    String code = entity.getMaDV();
                    if (code == null || !code.matches("^DV[0-9]+$")) {
                        return "DV01";
                    }
                    int num = Integer.parseInt(code.substring(2)) + 1;
                    return String.format("DV%02d", num);
                })
                .orElse("DV01");
    }

    @Override
    public void deleteById(String maDV) {
        if (!serviceEntityRepository.existsById(maDV)) {
            throw new RuntimeException("Không tìm thấy dịch vụ để xóa: " + maDV);
        }
        serviceEntityRepository.deleteById(maDV);
    }
}
