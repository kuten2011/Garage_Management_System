package DACNTT.garage.repository;

import DACNTT.garage.model.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchRepository extends JpaRepository<Branch, String> {

    Page<Branch> findAll(Pageable pageable);

    Page<Branch> findByTenChiNhanhContainingIgnoreCase(String tenChiNhanh, Pageable pageable);

    Page<Branch> findByDiaChiContainingIgnoreCase(String diaChi, Pageable pageable);

    Page<Branch> findBySdtContaining(String sdt, Pageable pageable);

    Page<Branch> findByEmailContainingIgnoreCase(String email, Pageable pageable);
}