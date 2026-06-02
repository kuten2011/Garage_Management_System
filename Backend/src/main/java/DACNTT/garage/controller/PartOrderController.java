package DACNTT.garage.controller;

import DACNTT.garage.dto.PartOrderDTO;
import DACNTT.garage.dto.PartOrderItemRequestDTO;
import DACNTT.garage.dto.PartOrderRequestDTO;
import DACNTT.garage.model.Branch;
import DACNTT.garage.model.Customer;
import DACNTT.garage.model.Part;
import DACNTT.garage.model.PartOrder;
import DACNTT.garage.model.PartOrderItem;
import DACNTT.garage.repository.BranchRepository;
import DACNTT.garage.repository.CustomerRepository;
import DACNTT.garage.repository.PartOrderItemRepository;
import DACNTT.garage.repository.PartOrderRepository;
import DACNTT.garage.repository.PartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class PartOrderController {
    private static final String STATUS_WAITING = "Chờ xác nhận";
    private static final String STATUS_CONFIRMED = "Đã xác nhận";
    private static final String STATUS_PAID = "Thanh toán thành công";
    private static final String STATUS_REJECTED = "Từ chối";
    private static final String STATUS_FAILED = "Thanh toán thất bại";

    @Autowired private PartOrderRepository orderRepository;
    @Autowired private PartOrderItemRepository itemRepository;
    @Autowired private PartRepository partRepository;
    @Autowired private BranchRepository branchRepository;
    @Autowired private CustomerRepository customerRepository;

    @PostMapping("/customer/part-orders")
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody PartOrderRequestDTO request, Principal principal) {
        try {
            Customer customer = resolveCurrentCustomer(principal);
            validateRequest(request);

            Branch branch = branchRepository.findById(request.getMaChiNhanh().trim().toUpperCase())
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay chi nhanh"));

            List<PartOrderLineHolder> lines = new ArrayList<>();
            double total = 0.0;

            for (PartOrderItemRequestDTO line : request.getItems()) {
                Part part = partRepository.findById(line.getMaPT())
                        .orElseThrow(() -> new IllegalArgumentException("Khong tim thay phu tung: " + line.getMaPT()));
                if (part.getChiNhanh() == null || !branch.getMaChiNhanh().equals(part.getChiNhanh().getMaChiNhanh())) {
                    throw new IllegalArgumentException("Phu tung " + part.getMaPT() + " khong thuoc chi nhanh da chon");
                }
                int quantity = line.getSoLuong() == null ? 1 : line.getSoLuong();
                if (quantity <= 0) {
                    throw new IllegalArgumentException("So luong phai lon hon 0");
                }
                if (part.getSoLuongTon() == null || part.getSoLuongTon() < quantity) {
                    throw new IllegalArgumentException("Phu tung " + part.getMaPT() + " khong du so luong ton");
                }
                lines.add(new PartOrderLineHolder(part, quantity));
                total += part.getDonGia() * quantity;
            }

            PartOrder order = PartOrder.builder()
                    .maDon(generateNextMaDon())
                    .khachHang(customer)
                    .hoTen(request.getHoTen().trim())
                    .sdt(request.getSdt().trim())
                    .email(request.getEmail())
                    .ghiChu(request.getGhiChu())
                    .chiNhanh(branch)
                    .ngayDat(LocalDateTime.now())
                    .trangThai(STATUS_WAITING)
                    .tongTien(total)
                    .daTraKho(false)
                    .build();
            orderRepository.save(order);

            List<PartOrderItem> savedItems = new ArrayList<>();
            for (PartOrderLineHolder holder : lines) {
                Part part = holder.part();
                int quantity = holder.quantity();
                part.setSoLuongTon(part.getSoLuongTon() - quantity);
                partRepository.save(part);

                double lineTotal = part.getDonGia() * quantity;
                savedItems.add(itemRepository.save(PartOrderItem.builder()
                        .donDat(order)
                        .phuTung(part)
                        .soLuong(quantity)
                        .donGia(part.getDonGia())
                        .thanhTien(lineTotal)
                        .build()));
            }

            return ResponseEntity.status(201).body(toDTO(order, savedItems));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/admin/part-orders")
    public ResponseEntity<List<PartOrderDTO>> getOrders() {
        List<PartOrderDTO> orders = orderRepository.findAllByOrderByNgayDatDesc().stream()
                .map(order -> toDTO(order, itemRepository.findByDonDat_MaDon(order.getMaDon())))
                .toList();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/customer/part-orders")
    public ResponseEntity<List<PartOrderDTO>> getMyOrders(Principal principal) {
        Customer customer = resolveCurrentCustomer(principal);
        List<PartOrderDTO> orders = orderRepository.findByKhachHang_EmailOrderByNgayDatDesc(customer.getEmail()).stream()
                .map(order -> toDTO(order, itemRepository.findByDonDat_MaDon(order.getMaDon())))
                .toList();
        return ResponseEntity.ok(orders);
    }

    @PatchMapping("/admin/part-orders/{maDon}/status")
    @Transactional
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String maDon,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("trangThai");
            if (status == null || status.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Trang thai khong hop le"));
            }

            PartOrder order = orderRepository.findById(maDon)
                    .orElseThrow(() -> new IllegalArgumentException("Khong tim thay don dat"));

            applyStatusTransition(order, status.trim());

            List<PartOrderItem> items = itemRepository.findByDonDat_MaDon(order.getMaDon());
            return ResponseEntity.ok(toDTO(order, items));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private void applyStatusTransition(PartOrder order, String status) {
        String current = order.getTrangThai();
        if (STATUS_PAID.equals(current) || STATUS_REJECTED.equals(current) || STATUS_FAILED.equals(current)) {
            throw new IllegalArgumentException("Don da ket thuc, khong the cap nhat lai");
        }

        if (STATUS_REJECTED.equals(status) || STATUS_FAILED.equals(status)) {
            if (!Boolean.TRUE.equals(order.getDaTraKho())) {
                restoreStock(order);
                order.setDaTraKho(true);
            }
            order.setTrangThai(status);
            orderRepository.save(order);
            return;
        }

        if (STATUS_CONFIRMED.equals(status)) {
            if (!STATUS_WAITING.equals(current)) {
                throw new IllegalArgumentException("Chi co the xac nhan don dang cho xac nhan");
            }
            order.setTrangThai(status);
            orderRepository.save(order);
            return;
        }

        if (STATUS_PAID.equals(status)) {
            if (!STATUS_CONFIRMED.equals(current)) {
                throw new IllegalArgumentException("Chi co the ghi nhan thanh toan sau khi don da xac nhan");
            }
            order.setTrangThai(status);
            orderRepository.save(order);
            return;
        }

        if (STATUS_WAITING.equals(status)) {
            throw new IllegalArgumentException("Khong the hoan don ve trang thai cho xac nhan");
        }

        throw new IllegalArgumentException("Trang thai khong duoc ho tro");
    }

    private void restoreStock(PartOrder order) {
        List<PartOrderItem> items = itemRepository.findByDonDat_MaDon(order.getMaDon());
        for (PartOrderItem item : items) {
            Part part = item.getPhuTung();
            part.setSoLuongTon((part.getSoLuongTon() == null ? 0 : part.getSoLuongTon()) + item.getSoLuong());
            partRepository.save(part);
        }
    }

    private void validateRequest(PartOrderRequestDTO request) {
        if (request.getHoTen() == null || request.getHoTen().isBlank()) {
            throw new IllegalArgumentException("Vui long nhap ho ten");
        }
        if (request.getSdt() == null || request.getSdt().isBlank()) {
            throw new IllegalArgumentException("Vui long nhap so dien thoai");
        }
        if (request.getMaChiNhanh() == null || request.getMaChiNhanh().isBlank()) {
            throw new IllegalArgumentException("Vui long chon chi nhanh");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Gio hang dang trong");
        }
    }

    private String generateNextMaDon() {
        return orderRepository.findTopByOrderByMaDonDesc()
                .map(order -> {
                    String code = order.getMaDon();
                    if (code == null || !code.matches("^DDPT[0-9]{3,}$")) {
                        return "DDPT001";
                    }
                    int next = Integer.parseInt(code.substring(4)) + 1;
                    return String.format("DDPT%03d", next);
                })
                .orElse("DDPT001");
    }

    private PartOrderDTO toDTO(PartOrder order, List<PartOrderItem> items) {
        return PartOrderDTO.builder()
                .maDon(order.getMaDon())
                .hoTen(order.getHoTen())
                .sdt(order.getSdt())
                .email(order.getEmail())
                .maKH(order.getKhachHang() != null ? order.getKhachHang().getMaKH() : null)
                .maChiNhanh(order.getChiNhanh() != null ? order.getChiNhanh().getMaChiNhanh() : null)
                .tenChiNhanh(order.getChiNhanh() != null ? order.getChiNhanh().getTenChiNhanh() : null)
                .ngayDat(order.getNgayDat())
                .trangThai(order.getTrangThai())
                .tongTien(order.getTongTien())
                .ghiChu(order.getGhiChu())
                .daTraKho(order.getDaTraKho())
                .items(items.stream().map(item -> PartOrderDTO.PartOrderLineDTO.builder()
                        .maPT(item.getPhuTung().getMaPT())
                        .tenPT(item.getPhuTung().getTenPT())
                        .soLuong(item.getSoLuong())
                        .donGia(item.getDonGia())
                        .thanhTien(item.getThanhTien())
                        .build()).toList())
                .build();
    }

    private Customer resolveCurrentCustomer(Principal principal) {
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            throw new IllegalArgumentException("Vui long dang nhap");
        }
        return customerRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay khach hang dang nhap"));
    }

    private record PartOrderLineHolder(Part part, int quantity) {}
}
