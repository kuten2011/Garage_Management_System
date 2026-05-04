package DACNTT.garage.controller;

import DACNTT.garage.dto.RepairPartDTO;
import DACNTT.garage.handle.RepairPartHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RepairPartController {

    @Autowired private RepairPartHandle repairPartHandle;

    @GetMapping("/customer/repair-parts/phieu/{maPhieu}")
    public ResponseEntity<?> getPartsByPhieu(
            @PathVariable String maPhieu,
            Authentication authentication) {

        String email = authentication.getName();

        // Staff truy cập được hết
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_EMPLOYEE")
                        || a.getAuthority().equals("ROLE_MANAGER"));

        if (!isStaff && !repairPartHandle.isOwner(maPhieu, email)) {
            return ResponseEntity.status(403).body("Không có quyền truy cập!");
        }

        return repairPartHandle.getPartsByPhieu(maPhieu);
    }

    // Thêm phụ tùng vào phiếu
    @PostMapping("/admin/repair-parts/phieu/{maPhieu}")
    public ResponseEntity<RepairPartDTO> addPart(
            @PathVariable String maPhieu,
            @RequestBody RepairPartDTO dto) {
        dto.setMaPhieu(maPhieu);
        return repairPartHandle.addPart(dto);
    }

    // Xóa phụ tùng khỏi phiếu
    @DeleteMapping("/admin/repair-parts/phieu/{maPhieu}/phutung/{maPT}")
    public ResponseEntity<Void> removePart(
            @PathVariable String maPhieu,
            @PathVariable String maPT) {
        repairPartHandle.removePart(maPhieu, maPT);
        return ResponseEntity.noContent().build();
    }
}