package DACNTT.garage.handle;

import DACNTT.garage.dto.ReportDTO;
import DACNTT.garage.mapper.ReportMapper;
import DACNTT.garage.model.Report;
import DACNTT.garage.repository.BranchRepository;
import DACNTT.garage.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ReportHandle {
    @Autowired
    private ReportService reportService;
    @Autowired
    private ReportMapper reportMapper;

    @Autowired
    private BranchRepository branchRepository;

    @Cacheable(
            value = "reports",
            key = "'list:' + T(java.util.Objects).toString(#p0) + '|' + T(java.util.Objects).toString(#p1) + '|' + T(java.util.Objects).toString(#p2) + '|' + T(java.util.Objects).toString(#p3) + '|' + T(java.util.Objects).toString(#p4) + '|' + T(java.util.Objects).toString(#p5) + '|' + T(java.util.Objects).toString(#p6)"
    )
    public ResponseEntity<List<ReportDTO>> getAllReports(String maChiNhanh, String fromMonth, String toMonth,
                                                         Double minRevenue, Double maxRevenue,
                                                         Integer minCars, Integer maxCars) {
        List<Report> reports = reportService.getFilteredReports(
                maChiNhanh, fromMonth, toMonth, minRevenue, maxRevenue, minCars, maxCars
        );
        List<ReportDTO> reportDTOs = reports.stream()
                .map(reportMapper::toReportDTO)
                .sorted(Comparator.comparing(ReportDTO::getThangNam).thenComparing(ReportDTO::getMaChiNhanh, Comparator.nullsLast(String::compareTo)))
                .collect(Collectors.toList());
        return ResponseEntity.ok(reportDTOs);
    }

    @Cacheable(value = "reports", key = "'last12months'")
    public ResponseEntity<List<ReportDTO>> getLast12MonthsReport() {
        List<Report> reports = reportService.getLast12Months();
        List<ReportDTO> dtos = reports.stream()
                .map(reportMapper::toReportDTO)
                .sorted(Comparator.comparing(ReportDTO::getThangNam))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @Cacheable(
            value = "reportSummary",
            key = "'summary:' + T(java.util.Objects).toString(#p0) + '|' + T(java.util.Objects).toString(#p1) + '|' + T(java.util.Objects).toString(#p2) + '|' + T(java.util.Objects).toString(#p3) + '|' + T(java.util.Objects).toString(#p4) + '|' + T(java.util.Objects).toString(#p5) + '|' + T(java.util.Objects).toString(#p6)"
    )
    public ResponseEntity<?> getSummary(String maChiNhanh, String fromMonth, String toMonth,
                                        Double minRevenue, Double maxRevenue,
                                        Integer minCars, Integer maxCars) {
        List<Report> reports = reportService.getFilteredReports(
                maChiNhanh, fromMonth, toMonth, minRevenue, maxRevenue, minCars, maxCars
        );

        long totalBranches = reports.stream()
                .map(report -> report.getChiNhanh() != null ? report.getChiNhanh().getMaChiNhanh() : null)
                .filter(id -> id != null && !id.isBlank())
                .distinct()
                .count();

        Double totalRevenue = reports.stream()
                .mapToDouble(report -> report.getDoanhThu() != null ? report.getDoanhThu() : 0)
                .sum();

        Integer totalCars = reports.stream()
                .mapToInt(report -> report.getSoXePhucVu() != null ? report.getSoXePhucVu() : 0)
                .sum();

        Map<String, Object> summary = Map.of(
                "totalBranches", totalBranches,
                "totalRevenue", totalRevenue != null ? totalRevenue : 0,
                "totalCars", totalCars != null ? totalCars : 0
        );
        return ResponseEntity.ok(summary);
    }
}
