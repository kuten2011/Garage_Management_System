package DACNTT.garage.repository;

import DACNTT.garage.model.ServiceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ServiceEntityRepository extends JpaRepository<ServiceEntity, String>, JpaSpecificationExecutor<ServiceEntity> {

    Page<ServiceEntity> findAll(Pageable pageable);
    Page<ServiceEntity> findByTenDVContainingIgnoreCaseOrMaDVContainingIgnoreCase(
            String tenDV, String maDV, Pageable pageable);
    Page<ServiceEntity> findByTenDVContainingIgnoreCaseOrMaDVContainingIgnoreCaseAndGiaTienBetween(
            String tenDV, String maDV, Double from, Double to, Pageable pageable);
    Page<ServiceEntity> findByGiaTienGreaterThanEqual(Double giaTien, Pageable pageable);
    Page<ServiceEntity> findByGiaTienLessThanEqual(Double giaTien, Pageable pageable);
    Page<ServiceEntity> findByGiaTienBetween(Double from, Double to, Pageable pageable);
    Optional<ServiceEntity> findTopByOrderByMaDVDesc();
}
