package DACNTT.garage.scheduler;

import DACNTT.garage.model.Repair;
import DACNTT.garage.model.Vehicle;
import DACNTT.garage.repository.CustomerRepository;
import DACNTT.garage.repository.RepairRepository;
import DACNTT.garage.repository.VehicleRepository;
import DACNTT.garage.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class CustomerCareScheduler {

    @Autowired
    private RepairRepository repairRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CustomerRepository customerRepository;

    // Chạy mỗi ngày lúc 8h sáng
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendCustomerCareEmails() {
        LocalDate today = LocalDate.now();

        // 1. +3 ngày sau sửa xe
        LocalDate threeDaysAgo = today.minusDays(3);
        List<Repair> repairs3Days = repairRepository.findByNgayHoanThanhAndTrangThai(threeDaysAgo, "Hoàn thành");
        for (Repair r : repairs3Days) {
            emailService.sendCareEmail(r.getLichHen().getKhachHang(), r, "care_3days");
        }

        // 2. +7 ngày
        LocalDate sevenDaysAgo = today.minusDays(7);
        List<Repair> repairs7Days = repairRepository.findByNgayHoanThanhAndTrangThai(sevenDaysAgo, "Hoàn thành");
        for (Repair r : repairs7Days) {
            emailService.sendCareEmail(r.getLichHen().getKhachHang(), r, "follow_up_7days");
        }

        // 3. Gần hết bảo hành (còn 7 ngày)
        LocalDate warrantySoon = today.plusDays(7);
        List<Vehicle> vehiclesWarranty = vehicleRepository.findByNgayBaoHanhDen(warrantySoon);
        for (Vehicle v : vehiclesWarranty) {
            emailService.sendWarrantyReminder(customerRepository.findById(v.getKhachHang().getMaKH())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với mã: " + v.getKhachHang().getMaKH())), v);
        }

        // 4. Đến chu kỳ bảo dưỡng
        List<Vehicle> dueMaintenance = vehicleRepository.findDueForMaintenance(today);
        for (Vehicle v : dueMaintenance) {
            emailService.sendMaintenanceReminder(customerRepository.findById(v.getKhachHang().getMaKH())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với mã: " + v.getKhachHang().getMaKH())), v, false);
        }

        // 5. Quá hạn bảo dưỡng
        List<Vehicle> overdueMaintenance = vehicleRepository.findOverdueMaintenance(today);
        for (Vehicle v : overdueMaintenance) {
            emailService.sendMaintenanceReminder(customerRepository.findById(v.getKhachHang().getMaKH())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với mã: " + v.getKhachHang().getMaKH())), v, true);
        }

        // 6. Khách ngủ đông (60-90 ngày không quay lại)
        LocalDate sixtyDaysAgo = today.minusDays(60);
        LocalDate ninetyDaysAgo = today.minusDays(90);
        List<Object[]> dormantCustomers = repairRepository.findDormantCustomers(ninetyDaysAgo, sixtyDaysAgo);
        for (Object[] row : dormantCustomers) {
            String maKH = (String) row[0];
            String hoTen = (String) row[1];
            String email = (String) row[2];
            LocalDate lastVisit = (LocalDate) row[3];
            emailService.sendReactivationEmail(maKH, hoTen, email, lastVisit);
        }
    }
}