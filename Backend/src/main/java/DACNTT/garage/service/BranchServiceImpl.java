package DACNTT.garage.service;

import DACNTT.garage.model.Branch;
import DACNTT.garage.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BranchServiceImpl implements BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Override
    public Page<Branch> getAllBranches(Pageable pageable) {
        return branchRepository.findAll(pageable);
    }

    @Override
    public Page<Branch> searchBranches(String ten, String diaChi, String sdt, String email, Pageable pageable) {
        boolean hasTen = ten != null && !ten.trim().isEmpty();
        boolean hasDiaChi = diaChi != null && !diaChi.trim().isEmpty();
        boolean hasSdt = sdt != null && !sdt.trim().isEmpty();
        boolean hasEmail = email != null && !email.trim().isEmpty();

        if (!hasTen && !hasDiaChi && !hasSdt && !hasEmail) {
            return branchRepository.findAll(pageable);
        }

        if (hasTen) {
            return branchRepository.findByTenChiNhanhContainingIgnoreCase(ten.trim(), pageable);
        }
        if (hasDiaChi) {
            return branchRepository.findByDiaChiContainingIgnoreCase(diaChi.trim(), pageable);
        }
        if (hasSdt) {
            return branchRepository.findBySdtContaining(sdt.trim(), pageable);
        }
        if (hasEmail) {
            return branchRepository.findByEmailContainingIgnoreCase(email.trim(), pageable);
        }

        return branchRepository.findAll(pageable);
    }

    @Override
    public Branch getById(String maChiNhanh) {
        return branchRepository.findById(maChiNhanh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi nhánh: " + maChiNhanh));
    }

    @Override
    public Branch save(Branch branch) {
        // KIỂM TRA TRÙNG MÃ CHI NHÁNH TRƯỚC KHI THÊM MỚI
        if (branch.getMaChiNhanh() != null && branchRepository.existsById(branch.getMaChiNhanh())) {
            throw new RuntimeException("Mã chi nhánh '" + branch.getMaChiNhanh() + "' đã tồn tại!");
        }
        return branchRepository.save(branch);
    }

    @Override
    public void deleteById(String maChiNhanh) {
        if (!branchRepository.existsById(maChiNhanh)) {
            throw new RuntimeException("Không tìm thấy chi nhánh để xóa: " + maChiNhanh);
        }
        branchRepository.deleteById(maChiNhanh);
    }
}