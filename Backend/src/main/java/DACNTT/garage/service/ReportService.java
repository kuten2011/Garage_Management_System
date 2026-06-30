package DACNTT.garage.service;

import DACNTT.garage.model.Report;

import java.util.List;

public interface ReportService {
    List<Report> getAllReports();
    List<Report> getLast12Months();
    List<Report> getFilteredReports(String maChiNhanh, String fromMonth, String toMonth,
                                    Double minRevenue, Double maxRevenue,
                                    Integer minCars, Integer maxCars);
    Double getTotalRevenue();
    Integer getTotalCarsServed();
}
