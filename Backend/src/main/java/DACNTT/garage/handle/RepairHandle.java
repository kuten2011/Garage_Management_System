package DACNTT.garage.handle;

import DACNTT.garage.dto.RepairDTO;
import DACNTT.garage.mapper.RepairMapper;
import DACNTT.garage.model.*;
import DACNTT.garage.repository.*;
import DACNTT.garage.service.RepairPartService;
import DACNTT.garage.service.RepairService;
import DACNTT.garage.service.RepairServiceService;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class RepairHandle {

    @Autowired
    private RepairService repairService;

    @Autowired
    private RepairMapper repairMapper;

    @Autowired
    private RepairServiceService repairServiceService;

    @Autowired
    private RepairPartService repairPartService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private RepairRepository repairRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private ReportRepository reportRepository;

    private static final String MA_CHI_NHANH = "CN01"; // Có thể lấy động sau
    private static final DateTimeFormatter THANG_NAM_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

    public ResponseEntity<Page<RepairDTO>> getAllRepairs(int page, int size, String sort) {
        Sort sortable = Sort.by(Sort.Direction.DESC, "ngayLap");
        if (sort != null && sort.contains(",")) {
            try {
                String[] parts = sort.split(",");
                String field = parts[0].trim();
                String dir = parts.length > 1 ? parts[1].trim().toUpperCase() : "DESC";

                if (List.of("maPhieu", "ngayLap", "trangThai").contains(field)) {
                    sortable = Sort.by("ASC".equals(dir) ? Sort.Direction.ASC : Sort.Direction.DESC, field);
                }
            } catch (Exception ignored) {}
        }

        Pageable pageable = PageRequest.of(page, size, sortable);
        Page<Repair> repairPage = repairService.getAllRepairs(pageable);
        Page<RepairDTO> dtoPage = repairPage.map(repairMapper::toRepairDTO);

        return ResponseEntity.ok(dtoPage);
    }

    public ResponseEntity<RepairDTO> createRepair(RepairDTO dto) {
        try {
            if (dto.getMaPhieu() != null && !dto.getMaPhieu().isBlank()) {
                return ResponseEntity.badRequest().build();
            }

            Booking lichHen = bookingRepository.findById(dto.getMaLich())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn: " + dto.getMaLich()));

            Employee nhanVien = null;
            if (dto.getMaNV() != null && !dto.getMaNV().isBlank()) {
                nhanVien = employeeRepository.findById(dto.getMaNV())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên: " + dto.getMaNV()));
            }

            Repair repair = repairMapper.toRepair(dto);
            repair.setLichHen(lichHen);
            repair.setNhanVien(nhanVien);

            if (dto.getBienSo() != null && !dto.getBienSo().trim().isEmpty()) {
                Vehicle xe = vehicleRepository.findById(dto.getBienSo().trim())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với biển số: " + dto.getBienSo()));
                repair.setXe(xe);
            }
            Repair saved = repairService.createRepair(repair);

            double tongDV = repairServiceService.sumThanhTienByMaPhieu(saved.getMaPhieu());
            double tongPT = repairPartService.sumThanhTienByMaPhieu(saved.getMaPhieu());
            double tongTien = tongDV + tongPT;

            RepairDTO resultDTO = repairMapper.toRepairDTO(saved);
            resultDTO.setTongTien(tongTien);
            if (resultDTO.getThanhToanStatus() == null) {
                resultDTO.setThanhToanStatus("Chưa thanh toán");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(resultDTO);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(RepairDTO.builder().ghiChu("Lỗi: " + e.getMessage()).build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<RepairDTO> updateRepair(String maPhieu, RepairDTO dto) {
        try {
            if (!maPhieu.equals(dto.getMaPhieu())) {
                return ResponseEntity.badRequest().build();
            }

            Repair repair = repairMapper.toRepair(dto);
            Repair updated = repairService.update(maPhieu, repair);
            return ResponseEntity.ok(repairMapper.toRepairDTO(updated));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<RepairDTO> updateRepairStatus(String maPhieu, Map<String, String> body) {
        String trangThai = body.get("trangThai");
        if (trangThai == null || trangThai.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Repair updated = repairService.updateStatus(maPhieu, trangThai);
            return ResponseEntity.ok(repairMapper.toRepairDTO(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<Void> deleteRepair(String maPhieu) {
        try {
            repairService.deleteById(maPhieu);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    public ResponseEntity<RepairDTO> getRepairById(String maPhieu) {
        Repair repair = repairService.getRepairById(maPhieu);
        return ResponseEntity.ok(repairMapper.toRepairDTO(repair));
    }

    public ResponseEntity<RepairDTO> confirmTransferPayment(String maPhieu) {
        Repair repair = repairService.getRepairById(maPhieu);
        if (repair == null) {
            return ResponseEntity.notFound().build();
        }
        // Cập nhật trạng thái
        repair.setThanhToanStatus("Đã thanh toán");
        repair.setTrangThai("Hoàn thành");
        repair = repairService.save(repair);
        return ResponseEntity.ok(repairMapper.toRepairDTO(repair));
    }

    public ResponseEntity<?> updatePaymentStatus(String maPhieu, String status, String ghiChu) {
        try {
            Repair repair = repairService.getRepairById(maPhieu);
            if (repair == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Không tìm thấy phiếu sửa chữa"));
            }
            repair.setThanhToanStatus(status);
            if ("Đã thanh toán".equals(status)) {
                repair.setTrangThai("Hoàn thành");
            }
            Repair updated = repairService.update(maPhieu, repair);

            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật trạng thái thanh toán thành công",
                    "maPhieu", maPhieu,
                    "thanhToanStatus", status,
                    "trangThai", updated.getTrangThai()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi cập nhật: " + e.getMessage()));
        }
    }

//    public Page<RepairDTO> getRepairsByMaKH(String maKH, Pageable pageable) {
//        Page<Repair> page = repairService.findByMaKH(maKH, pageable);
//
//        return page.map(repair -> {
//            RepairDTO dto = repairMapper.toRepairDTO(repair);
//            double tongDV = repairServiceService.sumThanhTienByMaPhieu(repair.getMaPhieu());
//            double tongPT = repairPartService.sumThanhTienByMaPhieu(repair.getMaPhieu());
//            dto.setTongTien(tongDV + tongPT);
//            if (dto.getThanhToanStatus() == null) {
//                dto.setThanhToanStatus("Chưa thanh toán");
//            }
//            return dto;
//        });
//    }

    public List<RepairDTO> getRepairsByMaKH(String maKH) {
        List<Repair> repairs = repairRepository.findByLichHen_KhachHang_MaKH(customerRepository.findByEmail(maKH).get().getMaKH());

        return repairs.stream().map(repair -> {
                    RepairDTO dto = repairMapper.toRepairDTO(repair);

                    // Tính tổng tiền
                    double tongDV = repairServiceService.sumThanhTienByMaPhieu(repair.getMaPhieu());
                    double tongPT = repairPartService.sumThanhTienByMaPhieu(repair.getMaPhieu());
                    dto.setTongTien(tongDV + tongPT);

                    feedbackRepository.findByPhieuSuaChua_MaPhieu(repair.getMaPhieu())
                            .ifPresent(feedback -> {
                                dto.setDaDanhGia(true);
                                dto.setSoSao(feedback.getSoSao());
                                dto.setNoiDungPhanHoi(feedback.getNoiDung());
                                dto.setNgayDanhGia(feedback.getNgayGui());
                                dto.setPhanHoiQL(feedback.getPhanHoiQL());
                            });

                    if (dto.getThanhToanStatus() == null) {
                        dto.setThanhToanStatus("Chưa thanh toán");
                    }

                    return dto;
                }).sorted((a, b) -> b.getNgayLap().compareTo(a.getNgayLap()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Repair updateSumMoney(String maPhieu) {
        // 1. Tìm phiếu sửa chữa
        Repair repair = repairRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu sửa chữa với mã: " + maPhieu));

        // 2. Tính tổng tiền phụ tùng + dịch vụ
        double tongDV = repairServiceService.sumThanhTienByMaPhieu(maPhieu);
        double tongPT = repairPartService.sumThanhTienByMaPhieu(maPhieu);
        double tongTien = tongDV + tongPT;

        // 3. Cập nhật tổng tiền và ngày hoàn thành cho phiếu sửa chữa
        repair.setTongTien(tongTien);
        repair.setNgayHoanThanh(LocalDate.now());

        // 4. Cập nhật báo cáo doanh thu tháng hiện tại
        String thangNamHienTai = YearMonth.now().format(THANG_NAM_FORMATTER); // "2026-01"

        Report report = reportRepository
                .findByChiNhanh_MaChiNhanhAndThangNam(MA_CHI_NHANH, thangNamHienTai)
                .orElseGet(() -> {
                    // Nếu chưa có báo cáo tháng này → tạo mới
                    Report newReport = new Report();

                    // Tạo mã báo cáo tự động (ví dụ: BC-CN01-202601)
                    String maBC = "BC-" + MA_CHI_NHANH + "-" + thangNamHienTai.replace("-", "");
                    newReport.setMaBC(maBC);

                    // Giả sử bạn có cách lấy entity Branch, ví dụ:
                    Branch chiNhanh = new Branch();
                    chiNhanh.setMaChiNhanh(MA_CHI_NHANH);
                    // Hoặc inject BranchRepository và findById
                    newReport.setChiNhanh(chiNhanh);

                    newReport.setThangNam(thangNamHienTai);
                    newReport.setDoanhThu(0.0);
                    newReport.setSoXePhucVu(0);

                    return reportRepository.save(newReport); // lưu để có ID hợp lệ
                });

        // Cộng dồn doanh thu và số xe phục vụ
        report.setDoanhThu(report.getDoanhThu() + tongTien);
        report.setSoXePhucVu(report.getSoXePhucVu() + 1);

        // Lưu lại
        reportRepository.save(report);
        return repairRepository.save(repair);
    }

    public RepairDTO getRepairDTOById(String maPhieu) {
        Repair repair = repairRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu sửa chữa với mã: " + maPhieu));

        RepairDTO dto = repairMapper.toRepairDTO(repair);

        // Tính tổng tiền từ dịch vụ + phụ tùng
        double tongDV = repairServiceService.sumThanhTienByMaPhieu(maPhieu);
        double tongPT = repairPartService.sumThanhTienByMaPhieu(maPhieu);
        double tongTien = tongDV + tongPT;

        dto.setTongTien(tongTien);
        repairRepository.save(repair);

        // Mặc định trạng thái thanh toán nếu null
        if (dto.getThanhToanStatus() == null) {
            dto.setThanhToanStatus("Chưa thanh toán");
        }

        // Mặc định chi nhánh CN01 cho nhân viên nếu chưa có
        if (repair.getNhanVien() != null && repair.getNhanVien().getChiNhanh() == null) {
            Branch defaultBranch = branchRepository.findById("CN01")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chi nhánh"));
            repair.getNhanVien().setChiNhanh(defaultBranch);
            employeeRepository.save(repair.getNhanVien());
        }

        return dto;
    }
}