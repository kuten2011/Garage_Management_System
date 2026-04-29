package DACNTT.garage.handle;

import DACNTT.garage.dto.BranchDTO;
import DACNTT.garage.mapper.BranchMapper;
import DACNTT.garage.model.Branch;
import DACNTT.garage.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class BranchHandle {

    @Autowired private BranchService branchService;
    @Autowired private BranchMapper branchMapper;

    public ResponseEntity<Page<BranchDTO>> getAllBranches(int page, int size,
                                                          String ten, String diaChi, String sdt, String email) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("maChiNhanh"));
        Page<Branch> result = branchService.searchBranches(ten, diaChi, sdt, email, pageable);
        return ResponseEntity.ok(result.map(branchMapper::toBranchDTO));
    }

    public ResponseEntity<BranchDTO> getBranchById(String maChiNhanh) {
        Branch branch = branchService.getById(maChiNhanh);
        return ResponseEntity.ok(branchMapper.toBranchDTO(branch));
    }

    public ResponseEntity<BranchDTO> createBranch(BranchDTO dto) {
        Branch branch = branchMapper.toEntity(dto);
        Branch saved = branchService.save(branch);
        return ResponseEntity.status(HttpStatus.CREATED).body(branchMapper.toBranchDTO(saved));
    }

    public ResponseEntity<BranchDTO> updateBranch(String maChiNhanh, BranchDTO dto) {
        Branch branch = branchMapper.toEntity(dto);
        branch.setMaChiNhanh(maChiNhanh);
        Branch updated = branchService.save(branch);
        return ResponseEntity.ok(branchMapper.toBranchDTO(updated));
    }

    public void deleteBranch(String maChiNhanh) {
        branchService.deleteById(maChiNhanh);
    }
}