package DACNTT.garage.handle;

import DACNTT.garage.dto.ReportDTO;
import DACNTT.garage.mapper.ReportMapper;
import DACNTT.garage.model.Report;
import DACNTT.garage.repository.BranchRepository;
import DACNTT.garage.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
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

    public ResponseEntity<List<ReportDTO>> getAllReports() {
        List<Report> reports = reportService.getAllReports();
        List<ReportDTO> reportDTOs = new ArrayList<>();
        for (Report report : reports) {
            reportDTOs.add(reportMapper.toReportDTO(report));
        }
        return ResponseEntity.ok(reportDTOs);
    }

    public ResponseEntity<List<ReportDTO>> getLast12MonthsReport() {
        List<Report> reports = reportService.getLast12Months();
        List<ReportDTO> dtos = reports.stream()
                .map(reportMapper::toReportDTO)
                .sorted(Comparator.comparing(ReportDTO::getThangNam))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    public ResponseEntity<?> getSummary() {
        long totalBranches = branchRepository.count();
        Double totalRevenue = reportService.getTotalRevenue();
        Integer totalCars = reportService.getTotalCarsServed();

        Map<String, Object> summary = Map.of(
                "totalBranches", totalBranches,
                "totalRevenue", totalRevenue != null ? totalRevenue : 0,
                "totalCars", totalCars != null ? totalCars : 0
        );
        return ResponseEntity.ok(summary);
    }
}
