package DACNTT.garage.service;

import DACNTT.garage.model.Customer;
import DACNTT.garage.model.Repair;
import DACNTT.garage.model.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDate;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendCareEmail(Customer khachHang, Repair repair, String templateType) {
        String subject = "";
        String content = "";

        switch (templateType) {
            case "care_3days":
                subject = "Cảm ơn quý khách đã tin tưởng Garage chúng tôi!";
                content = "<p>Kính chào " + khachHang.getHoTen() + ",</p>" +
                        "<p>Xe của quý khách đã được sửa chữa hoàn tất vào ngày " + repair.getNgayHoanThanh() + ".</p>" +
                        "<p>Quý khách vui lòng cho chúng tôi biết xe đang chạy có ổn không ạ?</p>" +
                        "<p>Trân trọng,<br>Đội ngũ Garage</p>";
                break;
            case "follow_up_7days":
                subject = "Hỏi thăm tình trạng xe sau 1 tuần sử dụng";
                content = "<p>Xin chào " + khachHang.getHoTen() + ",</p>" +
                        "<p>Đã 1 tuần kể từ khi quý khách nhận xe. Xe có vấn đề gì không ạ?</p>" +
                        "<p>Nếu cần hỗ trợ, đừng ngần ngại liên hệ chúng tôi nhé!</p>";
                break;
        }

        sendHtmlEmail(khachHang.getEmail(), subject, content);
    }

    public void sendWarrantyReminder(Customer khachHang, Vehicle xe) {
        String subject = "Thông báo: Bảo hành xe sắp hết hạn!";
        String content = "<p>Kính gửi " + khachHang.getHoTen() + ",</p>" +
                "<p>Bảo hành xe biển số <strong>" + xe.getBienSo() + "</strong> sẽ hết hạn vào ngày <strong>" + xe.getNgayBaoHanhDen() + "</strong>.</p>" +
                "<p>Vui lòng mang xe đến kiểm tra trước khi hết hạn để được hỗ trợ tốt nhất.</p>";
        sendHtmlEmail(khachHang.getEmail(), subject, content);
    }

    public void sendMaintenanceReminder(Customer khachHang, Vehicle xe, boolean overdue) {
        String subject = overdue ? "Xe của quý khách đã quá hạn bảo dưỡng!" : "Đã đến lúc bảo dưỡng định kỳ";
        String content = "<p>Xin chào " + khachHang.getHoTen() + ",</p>" +
                "<p>Xe biển số <strong>" + xe.getBienSo() + "</strong> đã đến kỳ bảo dưỡng định kỳ.</p>" +
                (overdue ? "<p style='color:red;'>Hiện tại đã quá hạn bảo dưỡng!</p>" : "") +
                "<p>Hãy đặt lịch ngay hôm nay để đảm bảo xe luôn hoạt động tốt nhất!</p>" +
                "<p><a href='http://localhost:3000/book-appointment'>Đặt lịch online</a></p>";
        sendHtmlEmail(khachHang.getEmail(), subject, content);
    }

    public void sendReactivationEmail(String maKH, String hoTen, String email, LocalDate lastVisit) {
        String subject = "Chúng tôi nhớ quý khách! Ưu đãi đặc biệt dành riêng cho bạn";
        String content = "<p>Kính chào " + hoTen + ",</p>" +
                "<p>Lần cuối quý khách ghé garage là ngày " + lastVisit + ".</p>" +
                "<p>Chúng tôi rất mong được phục vụ quý khách trở lại!</p>" +
                "<p><strong>Ưu đãi đặc biệt: Giảm 20% dịch vụ bảo dưỡng cho khách cũ quay lại trong tháng này!</strong></p>" +
                "<p>Hẹn gặp lại quý khách!</p>";
        sendHtmlEmail(email, subject, content);
    }

    private void sendHtmlEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true = HTML
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Gửi mail thất bại đến " + to + ": " + e.getMessage());
        }
    }
}