package DACNTT.garage.handle;

import DACNTT.garage.dto.BranchDTO;
import DACNTT.garage.dto.BranchPageDTO;
import DACNTT.garage.mapper.BranchMapper;
import DACNTT.garage.model.Branch;
import DACNTT.garage.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class BranchHandle {

    @Autowired
    private BranchService branchService;

    @Autowired
    private BranchMapper branchMapper;

    @Autowired
    private BranchCacheService branchCacheService;

    public ResponseEntity<Page<BranchDTO>> getAllBranches(int page, int size,
                                                          String ten, String diaChi, String sdt, String email) {
        BranchPageDTO cached = branchCacheService.getAllBranches(page, size, ten, diaChi, sdt, email);
        Pageable pageable = PageRequest.of(cached.getPage(), cached.getSize(), Sort.by("maChiNhanh"));
        Page<BranchDTO> dtoPage = new PageImpl<>(cached.getContent(), pageable, cached.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    public ResponseEntity<BranchDTO> getBranchById(String maChiNhanh) {
        BranchDTO dto = branchCacheService.getBranchById(maChiNhanh);
        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<BranchDTO> createBranch(BranchDTO dto) {
        Branch branch = branchMapper.toEntity(dto);
        Branch saved = branchService.create(branch);
        branchCacheService.evictBranches();
        return ResponseEntity.status(HttpStatus.CREATED).body(branchMapper.toBranchDTO(saved));
    }

    public ResponseEntity<BranchDTO> updateBranch(String maChiNhanh, BranchDTO dto) {
        Branch branch = branchMapper.toEntity(dto);
        branch.setMaChiNhanh(maChiNhanh);
        Branch updated = branchService.update(maChiNhanh, branch);
        branchCacheService.evictBranches();
        return ResponseEntity.ok(branchMapper.toBranchDTO(updated));
    }

    public void deleteBranch(String maChiNhanh) {
        branchService.deleteById(maChiNhanh);
        branchCacheService.evictBranches();
    }
}
