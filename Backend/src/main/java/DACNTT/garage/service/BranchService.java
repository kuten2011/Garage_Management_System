// src/main/java/DACNTT/garage/service/BranchService.java
package DACNTT.garage.service;

import DACNTT.garage.model.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BranchService {
    Page<Branch> getAllBranches(Pageable pageable);

    Page<Branch> searchBranches(String ten, String diaChi, String sdt, String email, Pageable pageable);

    Branch getById(String maChiNhanh);

    Branch save(Branch branch);

    void deleteById(String maChiNhanh);
}