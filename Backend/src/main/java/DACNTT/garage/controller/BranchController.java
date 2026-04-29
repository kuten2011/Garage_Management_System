package DACNTT.garage.controller;

import DACNTT.garage.dto.BranchDTO;
import DACNTT.garage.handle.BranchHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/branches")
public class BranchController {

    @Autowired
    private BranchHandle branchHandle;

    @GetMapping
    public ResponseEntity<Page<BranchDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) String diaChi,
            @RequestParam(required = false) String sdt,
            @RequestParam(required = false) String email) {

        return branchHandle.getAllBranches(page, size, ten, diaChi, sdt, email);
    }

    @GetMapping("/{maChiNhanh}")
    public ResponseEntity<BranchDTO> getById(@PathVariable String maChiNhanh) {
        return branchHandle.getBranchById(maChiNhanh);
    }

    @PostMapping
    public ResponseEntity<BranchDTO> create(@RequestBody BranchDTO dto) {
        return branchHandle.createBranch(dto);
    }

    @PutMapping("/{maChiNhanh}")
    public ResponseEntity<BranchDTO> update(@PathVariable String maChiNhanh, @RequestBody BranchDTO dto) {
        return branchHandle.updateBranch(maChiNhanh, dto);
    }

    @DeleteMapping("/{maChiNhanh}")
    public ResponseEntity<Void> delete(@PathVariable String maChiNhanh) {
        branchHandle.deleteBranch(maChiNhanh);
        return ResponseEntity.noContent().build();
    }
}