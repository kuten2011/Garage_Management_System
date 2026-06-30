package DACNTT.garage.controller;

import DACNTT.garage.dto.ReportDTO;
import DACNTT.garage.handle.ReportHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/reports")
public class ReportController {

    @Autowired
    private ReportHandle reportHandle;

    // Tất cả báo cáo
    @GetMapping
    public ResponseEntity<List<ReportDTO>> getAllReports(
            @RequestParam(required = false) String maChiNhanh,
            @RequestParam(required = false) String fromMonth,
            @RequestParam(required = false) String toMonth,
            @RequestParam(required = false) Double minRevenue,
            @RequestParam(required = false) Double maxRevenue,
            @RequestParam(required = false) Integer minCars,
            @RequestParam(required = false) Integer maxCars) {
        return reportHandle.getAllReports(maChiNhanh, fromMonth, toMonth, minRevenue, maxRevenue, minCars, maxCars);
    }

    // Báo cáo 12 tháng gần nhất (cho biểu đồ)
    @GetMapping("/last12months")
    public ResponseEntity<List<ReportDTO>> getLast12Months() {
        return reportHandle.getLast12MonthsReport();
    }

    // Tổng hợp nhanh (doanh thu, số xe, chi nhánh)
    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(
            @RequestParam(required = false) String maChiNhanh,
            @RequestParam(required = false) String fromMonth,
            @RequestParam(required = false) String toMonth,
            @RequestParam(required = false) Double minRevenue,
            @RequestParam(required = false) Double maxRevenue,
            @RequestParam(required = false) Integer minCars,
            @RequestParam(required = false) Integer maxCars) {
        return reportHandle.getSummary(maChiNhanh, fromMonth, toMonth, minRevenue, maxRevenue, minCars, maxCars);
    }
}
