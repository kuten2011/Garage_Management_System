package DACNTT.garage.service;

import DACNTT.garage.model.Report;
import DACNTT.garage.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReportServiceImpl implements ReportService {
    @Autowired
    private ReportRepository reportRepository;

    @Override
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Override
    public List<Report> getLast12Months() {
        LocalDate twelveMonthsAgo = LocalDate.now().minusMonths(12);
        String fromMonth = twelveMonthsAgo.format(DateTimeFormatter.ofPattern("yyyy-MM"));
        return reportRepository.findAll().stream()
                .filter(r -> r.getThangNam() != null && r.getThangNam().compareTo(fromMonth) >= 0)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> getFilteredReports(String maChiNhanh, String fromMonth, String toMonth,
                                           Double minRevenue, Double maxRevenue,
                                           Integer minCars, Integer maxCars) {
        return reportRepository.findAll().stream()
                .filter(report -> maChiNhanh == null || maChiNhanh.isBlank()
                        || (report.getChiNhanh() != null
                        && report.getChiNhanh().getMaChiNhanh() != null
                        && report.getChiNhanh().getMaChiNhanh().equalsIgnoreCase(maChiNhanh.trim())))
                .filter(report -> fromMonth == null || fromMonth.isBlank()
                        || (report.getThangNam() != null && report.getThangNam().compareTo(fromMonth.trim()) >= 0))
                .filter(report -> toMonth == null || toMonth.isBlank()
                        || (report.getThangNam() != null && report.getThangNam().compareTo(toMonth.trim()) <= 0))
                .filter(report -> minRevenue == null
                        || (report.getDoanhThu() != null && report.getDoanhThu() >= minRevenue))
                .filter(report -> maxRevenue == null
                        || (report.getDoanhThu() != null && report.getDoanhThu() <= maxRevenue))
                .filter(report -> minCars == null
                        || (report.getSoXePhucVu() != null && report.getSoXePhucVu() >= minCars))
                .filter(report -> maxCars == null
                        || (report.getSoXePhucVu() != null && report.getSoXePhucVu() <= maxCars))
                .collect(Collectors.toList());
    }

    @Override
    public Double getTotalRevenue() {
        return reportRepository.findAll().stream()
                .mapToDouble(r -> r.getDoanhThu() != null ? r.getDoanhThu() : 0)
                .sum();
    }

    @Override
    public Integer getTotalCarsServed() {
        return reportRepository.findAll().stream()
                .mapToInt(r -> r.getSoXePhucVu() != null ? r.getSoXePhucVu() : 0)
                .sum();
    }
}
