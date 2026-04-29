package DACNTT.garage.repository;

import DACNTT.garage.model.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface PartRepository extends JpaRepository<Part, String>, JpaSpecificationExecutor<Part> {
    boolean existsByMaPT(String maPT);
    Optional<Part> findTopByOrderByMaPTDesc();
}