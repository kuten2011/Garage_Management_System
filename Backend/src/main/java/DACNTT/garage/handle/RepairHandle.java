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
                    .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y lá»‹ch háº¹n: " + dto.getMaLich()));
            Branch chiNhanh = resolveBranchIfPresent(dto.getMaChiNhanh());

            Employee nhanVien = null;
            if (dto.getMaNV() != null && !dto.getMaNV().isBlank()) {
                nhanVien = employeeRepository.findById(dto.getMaNV())
                        .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y nhÃ¢n viÃªn: " + dto.getMaNV()));
                if (chiNhanh == null) {
                    chiNhanh = nhanVien.getChiNhanh();
                } else {
                    validateEmployeeInBranch(nhanVien, chiNhanh);
                }
            }

            Repair repair = repairMapper.toRepair(dto);
            repair.setLichHen(lichHen);
            repair.setNhanVien(nhanVien);
            repair.setChiNhanh(chiNhanh);

            if (dto.getBienSo() != null && !dto.getBienSo().trim().isEmpty()) {
                Vehicle xe = vehicleRepository.findById(dto.getBienSo().trim())
                        .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y xe vá»›i biá»ƒn sá»‘: " + dto.getBienSo()));

                repair.setXe(xe);
            }
            Repair saved = repairService.createRepair(repair);

            double tongDV = repairServiceService.sumThanhTienByMaPhieu(saved.getMaPhieu());
            double tongPT = repairPartService.sumThanhTienByMaPhieu(saved.getMaPhieu());
            double tongTien = tongDV + tongPT;

            RepairDTO resultDTO = repairMapper.toRepairDTO(saved);
            resultDTO.setTongTien(tongTien);
            if (resultDTO.getThanhToanStatus() == null) {
                resultDTO.setThanhToanStatus("ChÆ°a thanh toÃ¡n");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(resultDTO);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(RepairDTO.builder().ghiChu("Lá»—i: " + e.getMessage()).build());
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

            Repair repair = repairService.findById(maPhieu);
            Booking lichHen = bookingRepository.findById(dto.getMaLich())
                    .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y lá»‹ch háº¹n: " + dto.getMaLich()));
            Branch chiNhanh = resolveBranchIfPresent(dto.getMaChiNhanh());

            Employee nhanVien = null;
            if (dto.getMaNV() != null && !dto.getMaNV().isBlank()) {
                nhanVien = employeeRepository.findById(dto.getMaNV())
                        .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y nhÃ¢n viÃªn: " + dto.getMaNV()));
                if (chiNhanh == null) {
                    chiNhanh = nhanVien.getChiNhanh();
                } else {
                    validateEmployeeInBranch(nhanVien, chiNhanh);
                }
            }

            Vehicle xe = null;
            if (dto.getBienSo() != null && !dto.getBienSo().trim().isEmpty()) {
                xe = vehicleRepository.findById(dto.getBienSo().trim())
                        .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y xe vá»›i biá»ƒn sá»‘: " + dto.getBienSo()));

            }

            repair.setLichHen(lichHen);
            repair.setNhanVien(nhanVien);
            repair.setChiNhanh(chiNhanh);
            repair.setXe(xe);
            repair.setNgayLap(dto.getNgayLap());
            repair.setGhiChu(dto.getGhiChu());
            repair.setTrangThai(dto.getTrangThai());

            Repair updated = repairService.update(maPhieu, repair);
            return ResponseEntity.ok(repairMapper.toRepairDTO(updated));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
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
        // Cáº­p nháº­t tráº¡ng thÃ¡i
        repair.setThanhToanStatus("ÄÃ£ thanh toÃ¡n");
        repair.setTrangThai("HoÃ n thÃ nh");
        repair = repairService.save(repair);
        return ResponseEntity.ok(repairMapper.toRepairDTO(repair));
    }

    public ResponseEntity<?> updatePaymentStatus(String maPhieu, String status, String ghiChu) {
        try {
            Repair repair = repairService.getRepairById(maPhieu);
            if (repair == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "KhÃ´ng tÃ¬m tháº¥y phiáº¿u sá»­a chá»¯a"));
            }

            boolean isPaidStatus = "ÄÃ£ thanh toÃ¡n".equals(status);
            boolean wasPaid = "ÄÃ£ thanh toÃ¡n".equals(repair.getThanhToanStatus());
            if (isPaidStatus && !wasPaid) {
                repair = updateSumMoney(maPhieu);
            }

            repair.setThanhToanStatus(status);
            if (isPaidStatus) {
                repair.setTrangThai("HoÃ n thÃ nh");
            }
            Repair updated = repairService.update(maPhieu, repair);

            return ResponseEntity.ok(Map.of(
                    "message", "Cáº­p nháº­t tráº¡ng thÃ¡i thanh toÃ¡n thÃ nh cÃ´ng",
                    "maPhieu", maPhieu,
                    "thanhToanStatus", status,
                    "trangThai", updated.getTrangThai()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lá»—i cáº­p nháº­t: " + e.getMessage()));
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
//                dto.setThanhToanStatus("ChÆ°a thanh toÃ¡n");
//            }
//            return dto;
//        });
//    }

    public List<RepairDTO> getRepairsByMaKH(String maKH) {
        List<Repair> repairs = repairRepository.findByLichHen_KhachHang_MaKH(customerRepository.findByEmail(maKH).get().getMaKH());

        return repairs.stream().map(repair -> {
                    RepairDTO dto = repairMapper.toRepairDTO(repair);

                    // TÃ­nh tá»•ng tiá»n
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
                        dto.setThanhToanStatus("ChÆ°a thanh toÃ¡n");
                    }

                    return dto;
                }).sorted((a, b) -> b.getNgayLap().compareTo(a.getNgayLap()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Repair updateSumMoney(String maPhieu) {
        Repair repair = repairRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y phiáº¿u sá»­a chá»¯a vá»›i mÃ£: " + maPhieu));

        Branch chiNhanh = resolveRepairBranch(repair);
        String maChiNhanh = chiNhanh.getMaChiNhanh();

        double tongDV = repairServiceService.sumThanhTienByMaPhieu(maPhieu);
        double tongPT = repairPartService.sumThanhTienByMaPhieu(maPhieu);
        double tongTien = tongDV + tongPT;

        repair.setTongTien(tongTien);
        repair.setNgayHoanThanh(LocalDate.now());

        String thangNamHienTai = YearMonth.now().format(THANG_NAM_FORMATTER);
        Report report = reportRepository
                .findByChiNhanh_MaChiNhanhAndThangNam(maChiNhanh, thangNamHienTai)
                .orElseGet(() -> createMonthlyReport(chiNhanh, thangNamHienTai));

        report.setDoanhThu((report.getDoanhThu() != null ? report.getDoanhThu() : 0.0) + tongTien);
        report.setSoXePhucVu((report.getSoXePhucVu() != null ? report.getSoXePhucVu() : 0) + 1);
        reportRepository.save(report);

        return repairRepository.save(repair);
    }

    private Branch resolveBranchIfPresent(String maChiNhanh) {
        if (maChiNhanh == null || maChiNhanh.isBlank()) {
            return null;
        }
        String normalized = maChiNhanh.trim().toUpperCase();
        return branchRepository.findById(normalized)
                .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y chi nhÃ¡nh: " + normalized));
    }

    private void validateEmployeeInBranch(Employee nhanVien, Branch chiNhanh) {
        if (nhanVien.getChiNhanh() == null ||
                !chiNhanh.getMaChiNhanh().equals(nhanVien.getChiNhanh().getMaChiNhanh())) {
            throw new RuntimeException("NhÃ¢n viÃªn khÃ´ng thuá»™c chi nhÃ¡nh " + chiNhanh.getMaChiNhanh());
        }
    }


    private Branch resolveRepairBranch(Repair repair) {
        if (repair.getChiNhanh() != null) {
            return repair.getChiNhanh();
        }
        if (repair.getNhanVien() == null) {
            throw new RuntimeException("Phiáº¿u sá»­a chá»¯a pháº£i cÃ³ nhÃ¢n viÃªn phá»¥ trÃ¡ch Ä‘á»ƒ xÃ¡c Ä‘á»‹nh chi nhÃ¡nh");
        }
        if (repair.getNhanVien().getChiNhanh() == null) {
            throw new RuntimeException("NhÃ¢n viÃªn " + repair.getNhanVien().getMaNV() + " chÆ°a Ä‘Æ°á»£c gáº¯n chi nhÃ¡nh");
        }
        return repair.getNhanVien().getChiNhanh();
    }

    private Report createMonthlyReport(Branch chiNhanh, String thangNam) {
        Report newReport = new Report();
        String maBC = "BC-" + chiNhanh.getMaChiNhanh() + "-" + thangNam.replace("-", "");
        newReport.setMaBC(maBC);
        newReport.setChiNhanh(chiNhanh);
        newReport.setThangNam(thangNam);
        newReport.setDoanhThu(0.0);
        newReport.setSoXePhucVu(0);
        return reportRepository.save(newReport);
    }

    public RepairDTO getRepairDTOById(String maPhieu) {
        Repair repair = repairRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y phiáº¿u sá»­a chá»¯a vá»›i mÃ£: " + maPhieu));

        RepairDTO dto = repairMapper.toRepairDTO(repair);

        // TÃ­nh tá»•ng tiá»n tá»« dá»‹ch vá»¥ + phá»¥ tÃ¹ng
        double tongDV = repairServiceService.sumThanhTienByMaPhieu(maPhieu);
        double tongPT = repairPartService.sumThanhTienByMaPhieu(maPhieu);
        double tongTien = tongDV + tongPT;

        dto.setTongTien(tongTien);
        repairRepository.save(repair);

        // Máº·c Ä‘á»‹nh tráº¡ng thÃ¡i thanh toÃ¡n náº¿u null
        if (dto.getThanhToanStatus() == null) {
            dto.setThanhToanStatus("ChÆ°a thanh toÃ¡n");
        }

        // Máº·c Ä‘á»‹nh chi nhÃ¡nh CN01 cho nhÃ¢n viÃªn náº¿u chÆ°a cÃ³
        if (repair.getNhanVien() != null && repair.getNhanVien().getChiNhanh() == null) {
            Branch defaultBranch = branchRepository.findById("CN01")
                    .orElseThrow(() -> new RuntimeException("KhÃ´ng tÃ¬m tháº¥y chi nhÃ¡nh"));
            repair.getNhanVien().setChiNhanh(defaultBranch);
            employeeRepository.save(repair.getNhanVien());
        }

        return dto;
    }
}



