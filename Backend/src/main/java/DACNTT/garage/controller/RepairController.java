package DACNTT.garage.controller;

import DACNTT.garage.dto.RepairDTO;
import DACNTT.garage.handle.RepairHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
public class RepairController {

    @Autowired
    private RepairHandle repairHandle;

    @GetMapping("/admin/repairs")
    public ResponseEntity<Page<RepairDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ngayLap,desc") String sort) {
        return repairHandle.getAllRepairs(page, size, sort);
    }

    @GetMapping("/customer/repairs/{maPhieu}")
    public ResponseEntity<RepairDTO> getById(@PathVariable String maPhieu) {
        return repairHandle.getRepairById(maPhieu);
    }

    @PostMapping("/admin/repairs")
    public ResponseEntity<?> createRepair(@RequestBody RepairDTO dto) {
        return repairHandle.createRepair(dto);
    }

    @PutMapping("/admin/repairs/{maPhieu}")
    public ResponseEntity<RepairDTO> update(
            @PathVariable String maPhieu,
            @RequestBody RepairDTO dto) {
        return repairHandle.updateRepair(maPhieu, dto);
    }

    @PatchMapping("/admin/repairs/{maPhieu}/status")
    public ResponseEntity<RepairDTO> updateStatus(
            @PathVariable String maPhieu,
            @RequestBody Map<String, String> body) {
        return repairHandle.updateRepairStatus(maPhieu, body);
    }

    @DeleteMapping("/admin/repairs/{maPhieu}")
    public ResponseEntity<Void> delete(@PathVariable String maPhieu) {
        return repairHandle.deleteRepair(maPhieu);
    }

    // THANH TOÁN TIỀN MẶT
    @PostMapping("/admin/repairs/{maPhieu}/pay-cash")
    public ResponseEntity<?> payWithCash(@PathVariable String maPhieu) {
        repairHandle.updateSumMoney(maPhieu);
        return repairHandle.updatePaymentStatus(maPhieu, "Đã thanh toán", "Thanh toán tiền mặt");
    }

    // TẠO QR CHUYỂN KHOẢN
    @GetMapping(value = "/customer/repairs/{maPhieu}/qr", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> generateQRCode(@PathVariable String maPhieu) {
        try {
            RepairDTO repair = repairHandle.getRepairDTOById(maPhieu);
            if (repair == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy phiếu sửa chữa"));
            }

            double tongTienRaw = repair.getTongTien() != null ? repair.getTongTien() : 0.0;
            long tongTien = Math.round(tongTienRaw);

            if (tongTien <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tổng tiền không hợp lệ"));
            }

            // ===== THÔNG TIN TÀI KHOẢN GARAGE =====
            String bankShortName = "mbbank";
            String accountNo = "0944799819";
            String accountName = "Vo Nguyen Anh Khoa";
            String description = maPhieu;

            String qrImageUrl = "https://img.vietqr.io/image/" + bankShortName + "-" + accountNo + "-compact2.png" +
                    "?amount=" + tongTien +
                    "&addInfo=" + URLEncoder.encode(description, StandardCharsets.UTF_8) +
                    "&accountName=" + URLEncoder.encode(accountName, StandardCharsets.UTF_8);

            return ResponseEntity.ok(Map.of(
                    "qrCode", qrImageUrl,
                    "maPhieu", maPhieu,
                    "tongTien", tongTienRaw,
                    "noiDungChuyenKhoan", description,
                    "bankInfo", accountName + " - " + accountNo + " (MB Bank)"
            ));

        } catch (Exception e) {
            e.printStackTrace(); // In stack trace để debug
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi tạo mã QR: " + e.getMessage()));
        }
    }

    @PostMapping("/admin/repairs/{maPhieu}/confirm-payment")
    public ResponseEntity<?> confirmTransferPayment(@PathVariable String maPhieu) {
        return repairHandle.updatePaymentStatus(maPhieu, "Đã thanh toán", "Xác nhận chuyển khoản thủ công");
    }

//    @GetMapping("/customer/repairs")
//    public ResponseEntity<Page<RepairDTO>> getRepairsByCustomer(Principal principal, Pageable pageable) {
//        String maKH = principal.getName();
//        return ResponseEntity.ok(repairHandle.getRepairsByMaKH(maKH, pageable));
//    }

    @GetMapping("/customer/repairs")
    public ResponseEntity<List<RepairDTO>> getCustomerRepairs(Principal principal) {
        String maKH = principal.getName();
        List<RepairDTO> repairs = repairHandle.getRepairsByMaKH(maKH);
        return ResponseEntity.ok(repairs);
    }
}