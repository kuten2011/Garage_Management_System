package DACNTT.garage.service;

import DACNTT.garage.model.Report;

import java.util.List;

public interface ReportService {
    List<Report> getAllReports();
    List<Report> getLast12Months();
    Double getTotalRevenue();
    Integer getTotalCarsServed();
}
