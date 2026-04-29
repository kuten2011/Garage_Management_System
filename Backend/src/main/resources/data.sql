-- ===============================
-- THÊM DỮ LIỆU MẪU (ĐÃ SỬA ĐÚNG THỨ TỰ VÀ TÊN BẢNG)
-- ===============================

-- Chi nhánh
INSERT INTO "ChiNhanh" ("maChiNhanh", "tenChiNhanh", "diaChi", "sdt", "email")
VALUES
('CN01', 'Chi nhánh Quận 1', '123 Nguyễn Huệ, Q1, TP.HCM', '0909123456', 'cnq1@garage.vn'),
('CN02', 'Chi nhánh Bình Thạnh', '45 Điện Biên Phủ, Q.BT, TP.HCM', '0909988776', 'cnbt@garage.vn')
ON CONFLICT ("maChiNhanh") DO NOTHING;

-- Khách hàng
INSERT INTO "KhachHang" ("maKH", "hoTen", "sdt", "email", "diaChi", "matKhau", "role")
VALUES
('KH01', 'Nguyễn Văn A', '0905123456', 'a.nguyen@gmail.com', 'Q1, TP.HCM', '$2a$10$TUvI0e9ePIUtPKGob.JfN.HyCxca9IyIWncC.GWfhcw1Ls2/LCh0.', 'ROLE_CUSTOMER'),
('KH02', 'Trần Thị B', '0906234567', 'b.tran@gmail.com', 'Q3, TP.HCM', '$2a$10$TUvI0e9ePIUtPKGob.JfN.HyCxca9IyIWncC.GWfhcw1Ls2/LCh0.', 'ROLE_CUSTOMER'),
('KH03', 'Lê Hoàng C', '0907345678', 'c.le@gmail.com', 'Q7, TP.HCM', '$2a$10$TUvI0e9ePIUtPKGob.JfN.HyCxca9IyIWncC.GWfhcw1Ls2/LCh0.', 'ROLE_CUSTOMER')
ON CONFLICT ("maKH") DO NOTHING;

-- Nhân viên
INSERT INTO "NhanVien" ("maNV", "hoTen", "vaiTro", "sdt", "email", "matKhau", "maChiNhanh", "role")
VALUES
('NV01', 'Phạm Văn D', 'Kỹ thuật viên', '0908123123', 'admin@gara.com', '$2a$10$TUvI0e9ePIUtPKGob.JfN.HyCxca9IyIWncC.GWfhcw1Ls2/LCh0.', 'CN01', 'ROLE_ADMIN'),
('NV02', 'Võ Thị E', 'Lễ tân', '0908456789', 'e.vo@garage.vn', '$2a$10$TUvI0e9ePIUtPKGob.JfN.HyCxca9IyIWncC.GWfhcw1Ls2/LCh0.', 'CN01', 'ROLE_EMPLOYEE'),
('NV03', 'Ngô Minh F', 'Quản lý', '0909678456', 'f.ngo@garage.vn', '$2a$10$TUvI0e9ePIUtPKGob.JfN.HyCxca9IyIWncC.GWfhcw1Ls2/LCh0.', 'CN02', 'ROLE_MANAGER')
ON CONFLICT ("maNV") DO NOTHING;

-- Xe
INSERT INTO "Xe" (
    "bienSo", "maKH", "hangXe", "mauXe", "soKm", "namSX",
    "ngayBaoHanhDen", "ngayBaoDuongTiepTheo", "chuKyBaoDuongKm", "chuKyBaoDuongThang"
) VALUES
('59A-12345', 'KH01', 'Toyota', 'Camry', 35000, 2019, '2026-12-31', '2026-06-01', 10000, 12),
('51B-67890', 'KH02', 'Honda', 'Civic', 27000, 2020, '2027-03-15', '2026-09-01', 8000, 6),
('50C-11223', 'KH03', 'Mazda', 'CX-5', 15000, 2022, '2028-10-22', '2026-04-22', 10000, 12)
ON CONFLICT ("bienSo") DO UPDATE SET
    "maKH" = EXCLUDED."maKH",
    "hangXe" = EXCLUDED."hangXe",
    "mauXe" = EXCLUDED."mauXe",
    "soKm" = EXCLUDED."soKm",
    "namSX" = EXCLUDED."namSX",
    "ngayBaoHanhDen" = EXCLUDED."ngayBaoHanhDen",
    "ngayBaoDuongTiepTheo" = EXCLUDED."ngayBaoDuongTiepTheo",
    "chuKyBaoDuongKm" = EXCLUDED."chuKyBaoDuongKm",
    "chuKyBaoDuongThang" = EXCLUDED."chuKyBaoDuongThang";

-- Lịch hẹn
INSERT INTO "LichHen" ("maLich", "maKH", "ngayHen", "gioHen", "trangThai", "ghiChu")
VALUES
('LH01', 'KH01', '2025-10-20', '09:00:00', 'Chờ xác nhận', 'Xe không nổ máy'),
('LH02', 'KH02', '2025-10-21', '10:30:00', 'Đã xác nhận', 'Đề xe không nổ'),
('LH03', 'KH03', '2025-10-22', '08:00:00', 'Đã hoàn thành', 'Khói quá nhiều')
ON CONFLICT ("maLich") DO NOTHING;

-- Dịch vụ (giữ nguyên như bạn có)
INSERT INTO "DichVu" ("maDV", "tenDV", "giaTien", "moTa")
VALUES
-- BẢO DƯỠNG ĐỊNH KỲ
('BD01', 'Thay dầu động cơ', 300000, 'Thay dầu và lọc dầu giúp động cơ vận hành êm và bền'),
('BD02', 'Bảo dưỡng định kỳ 5.000km', 500000, 'Kiểm tra và bảo dưỡng các hạng mục cơ bản'),
('BD03', 'Bảo dưỡng định kỳ 10.000km', 1200000, 'Bảo dưỡng toàn diện theo khuyến cáo hãng'),
('BD04', 'Thay lọc gió động cơ', 200000, 'Giúp tăng hiệu suất đốt nhiên liệu'),
('BD05', 'Thay lọc gió điều hòa', 250000, 'Giữ không khí trong xe sạch và mát'),

-- SỬA CHỮA ĐỘNG CƠ
('DC01', 'Kiểm tra động cơ', 300000, 'Chẩn đoán lỗi động cơ bằng thiết bị'),
('DC02', 'Sửa động cơ nóng máy', 800000, 'Kiểm tra két nước, quạt và bơm nước'),
('DC03', 'Đại tu động cơ', 15000000, 'Tháo và phục hồi toàn bộ động cơ'),
('DC04', 'Thay bugi', 400000, 'Giúp xe khởi động và đốt nhiên liệu tốt'),
('DC05', 'Thay dây curoa', 600000, 'Đảm bảo truyền động ổn định'),

-- LỐP – MÂM
('LP01', 'Vá lốp', 100000, 'Vá lốp không săm chuyên dụng'),
('LP02', 'Thay lốp mới', 2500000, 'Thay lốp theo kích thước xe'),
('LP03', 'Cân bằng động bánh xe', 300000, 'Giúp xe chạy êm, không rung'),
('LP04', 'Cân chỉnh thước lái', 500000, 'Chỉnh độ chụm bánh xe'),
('LP05', 'Đảo lốp', 200000, 'Tăng tuổi thọ lốp'),

-- PHANH – AN TOÀN
('PH01', 'Kiểm tra hệ thống phanh', 300000, 'Kiểm tra bố thắng và đĩa phanh'),
('PH02', 'Thay bố thắng', 900000, 'Đảm bảo an toàn khi phanh'),
('PH03', 'Xả gió phanh', 300000, 'Tăng hiệu quả phanh'),
('PH04', 'Thay dầu phanh', 400000, 'Bảo dưỡng hệ thống phanh'),
('PH05', 'Sửa phanh ABS', 1500000, 'Chẩn đoán và sửa lỗi ABS'),

-- ĐIỆN – ĐIỆN TỬ
('DD01', 'Kiểm tra hệ thống điện', 300000, 'Kiểm tra toàn bộ điện xe'),
('DD02', 'Thay ắc quy', 1800000, 'Thay ắc quy mới chính hãng'),
('DD03', 'Sửa hệ thống đèn', 300000, 'Đèn pha, đèn hậu, đèn tín hiệu'),
('DD04', 'Sửa cảm biến', 800000, 'Cảm biến oxy, nhiệt độ, áp suất'),
('DD05', 'Cài đặt lại ECU', 700000, 'Reset và cập nhật ECU'),

-- ĐIỀU HÒA – LÀM MÁT
('DH01', 'Kiểm tra điều hòa', 300000, 'Kiểm tra hoạt động làm lạnh'),
('DH02', 'Nạp gas điều hòa', 500000, 'Nạp gas đúng chuẩn'),
('DH03', 'Vệ sinh giàn lạnh', 700000, 'Khử mùi và diệt khuẩn'),
('DH04', 'Sửa quạt làm mát', 600000, 'Đảm bảo nhiệt độ động cơ'),
('DH05', 'Thay két nước', 2000000, 'Thay két làm mát động cơ'),

-- CHĂM SÓC XE
('CS01', 'Rửa xe tiêu chuẩn', 80000, 'Rửa ngoài và vệ sinh cơ bản'),
('CS02', 'Rửa xe cao cấp', 150000, 'Rửa xe và vệ sinh nội thất'),
('CS03', 'Phủ ceramic', 8000000, 'Bảo vệ sơn xe'),
('CS04', 'Đánh bóng sơn', 3000000, 'Làm mới bề mặt sơn'),
('CS05', 'Vệ sinh nội thất', 600000, 'Làm sạch ghế, sàn và trần'),

-- PHỤ KIỆN – NÂNG CẤP
('NK01', 'Lắp camera hành trình', 1500000, 'Camera ghi hình trước và sau'),
('NK02', 'Lắp cảm biến lùi', 1200000, 'Cảnh báo khi lùi xe'),
('NK03', 'Lắp màn hình Android', 6000000, 'Giải trí và dẫn đường'),
('NK04', 'Dán phim cách nhiệt', 3500000, 'Giảm nhiệt và tia UV'),
('NK05', 'Độ đèn LED', 2000000, 'Tăng ánh sáng và thẩm mỹ'),

-- CỨU HỘ – KHÁC
('CH01', 'Cứu hộ xe 24/7', 500000, 'Hỗ trợ xe gặp sự cố'),
('CH02', 'Kéo xe', 800000, 'Kéo xe về garage'),
('DV01', 'Kiểm tra xe trước chuyến đi', 400000, 'Kiểm tra tổng quát xe'),
('DV02', 'Kiểm tra xe trước khi mua', 700000, 'Đánh giá tình trạng xe'),
('DV03', 'Tư vấn kỹ thuật', 200000, 'Tư vấn sửa chữa và bảo dưỡng')
ON CONFLICT ("maDV") DO NOTHING;

-- Phụ tùng
INSERT INTO "PhuTung" ("maPT", "tenPT", "donGia", "soLuongTon", "hinhAnh")
VALUES
('PT01', 'Dầu máy 5W30', 450000, 50, 'https://res.cloudinary.com/web-garage/image/upload/dau-tong-hop_nxrjxy.jpg'),
('PT02', 'Lọc dầu', 250000, 30, 'https://res.cloudinary.com/web-garage/image/upload/loc-dau_n2pyj2.jpg')
ON CONFLICT ("maPT") DO NOTHING;

-- PHIẾU SỬA CHỮA (ĐÃ THÊM bienSo VÀO INSERT)
INSERT INTO "PhieuSuaChua" (
    "maPhieu", "maLich", "maNV", "ngayLap", "ghiChu", "trangThai",
    "thanhToanStatus", "tongTien", "bienSo", "ngayHoanThanh"
) VALUES
('PSC01', 'LH03', 'NV01', '2025-10-22', 'Bảo dưỡng định kỳ 10.000km + kiểm tra phanh + thay dầu',
 'Hoàn thành', 'Đã thanh toán', 2350000, '50C-11223', '2025-10-22'),

('PSC02', 'LH01', 'NV02', '2025-10-20', 'Xe không nổ máy, kiểm tra hệ thống khởi động',
 'Hoàn thành', 'Đã thanh toán', 1800000, '59A-12345', '2025-10-21'),

('PSC03', 'LH02', 'NV03', '2025-10-21', 'Đề xe không nổ, kiểm tra ắc quy và bugi',
 'Hoàn thành', 'Chưa thanh toán', 1200000, '51B-67890', '2025-10-22')
ON CONFLICT ("maPhieu") DO UPDATE SET
    "maLich" = EXCLUDED."maLich",
    "maNV" = EXCLUDED."maNV",
    "ngayLap" = EXCLUDED."ngayLap",
    "ghiChu" = EXCLUDED."ghiChu",
    "trangThai" = EXCLUDED."trangThai",
    "thanhToanStatus" = EXCLUDED."thanhToanStatus",
    "tongTien" = EXCLUDED."tongTien",
    "bienSo" = EXCLUDED."bienSo",
    "ngayHoanThanh" = EXCLUDED."ngayHoanThanh";

-- CHI TIẾT SỬA CHỮA - PHỤ TÙNG
INSERT INTO "CT_SuaChua_PhuTung" ("maPhieu", "maPT", "soLuong", "thanhTien")
VALUES
('PSC01', 'PT01', 1, 450000),
('PSC01', 'PT02', 1, 250000)
ON CONFLICT ("maPhieu", "maPT") DO NOTHING;

-- Phản hồi
INSERT INTO "PhanHoi" ("maPhanHoi", "maPSC", "noiDung", "soSao", "ngayGui", "trangThai", "phanHoiQL")
VALUES
('PH01', 'PSC01', 'Dịch vụ tốt, nhân viên nhiệt tình, xe chạy êm hơn trước!', 5, '2025-10-23 10:30:00', 'Đã phản hồi', 'Cảm ơn quý khách! Rất vui được phục vụ.'),
('PH02', 'PSC01', 'Thay dầu hơi lâu, nhưng chất lượng ổn.', 4, '2025-10-23 14:15:00', 'Đã phản hồi', 'Xin lỗi vì sự bất tiện, chúng tôi sẽ cải thiện thời gian phục vụ.'),
('PH03', 'PSC01', 'Giá hơi cao so với mặt bằng.', 3, '2025-10-24 09:00:00', 'Chưa phản hồi', NULL)
ON CONFLICT ("maPhanHoi") DO NOTHING;

-- Báo cáo
INSERT INTO "BaoCao" ("maBC", "maChiNhanh", "thangNam", "doanhThu", "soXePhucVu")
VALUES
('BC01', 'CN01', '10/2025', 2500000, 12),
('BC02', 'CN02', '10/2025', 1800000, 8)
ON CONFLICT ("maBC") DO NOTHING;

-- ===============================
-- DỮ LIỆU TỐI ƯU CHO RAG CHATBOT
-- ===============================

INSERT INTO "ThongTinDichVu" ("title", "description", "content", "category") VALUES

-- ==================== CATEGORY: Giá dịch vụ ====================
('Bảng giá bảo dưỡng định kỳ', 'Chi phí các gói bảo dưỡng xe',
 'Gói 5.000km: 500.000đ - Thay dầu + lọc dầu + kiểm tra cơ bản + rửa xe
 Gói 10.000km: 1.200.000đ - Bao gồm gói 5k + thay lọc gió + kiểm tra phanh/treo/điện + hút bụi
 Gói 20.000km: 2.500.000đ - Bao gồm gói 10k + thay lọc nhiên liệu/điều hòa + vệ sinh buồng đốt + cân chỉnh lái + đánh bóng
 Thời gian: 45 phút (5k), 90 phút (10k), 3 giờ (20k)
 Khuyến mãi: Tặng voucher giảm 10% lần sau', 'Giá dịch vụ'),

('Bảng giá sửa chữa động cơ', 'Chi phí sửa chữa hệ thống động cơ',
 'Kiểm tra động cơ: 300.000đ
 Sửa nóng máy: 800.000đ - 3.000.000đ (tùy linh kiện)
 Thay bugi: 400.000đ - 1.500.000đ (4 bugi)
 Vệ sinh kim phun: 800.000đ - 1.500.000đ
 Đại tu động cơ: 15.000.000đ - 40.000.000đ
 Bảo hành: 6-12 tháng', 'Giá dịch vụ'),

('Bảng giá dịch vụ phanh', 'Chi phí kiểm tra và thay phanh',
 'Kiểm tra hệ thống phanh: 300.000đ (MIỄN PHÍ nếu sửa)
 Thay má phanh: 800.000đ - 2.000.000đ/cặp (2 bánh)
 Thay đĩa phanh: 1.500.000đ - 3.500.000đ/đôi
 Thay dầu phanh: 400.000đ
 Sửa phanh ABS: 1.500.000đ - 5.000.000đ
 Thời gian: 1-2 giờ', 'Giá dịch vụ'),

('Bảng giá dịch vụ lốp xe', 'Chi phí thay lốp và bảo dưỡng lốp',
 'Vá lốp: 50.000đ - 100.000đ/lốp
 Thay lốp 15": 1.500.000đ - 2.500.000đ/lốp
 Thay lốp 16-17": 2.000.000đ - 4.000.000đ/lốp
 Thay lốp 18"+: 3.000.000đ - 6.000.000đ/lốp
 Cân chỉnh độ chụm 3D: 400.000đ - 800.000đ
 Cân bằng động: 300.000đ (4 bánh)
 Thương hiệu: Michelin, Bridgestone, Dunlop, Yokohama', 'Giá dịch vụ'),

('Bảng giá điện lạnh ô tô', 'Chi phí sửa chữa điều hòa xe',
 'Kiểm tra điều hòa: 300.000đ (MIỄN PHÍ nếu sửa)
 Nạp gas R134a: 400.000đ - 800.000đ
 Nạp gas R1234yf (xe mới): 800.000đ - 1.500.000đ
 Vệ sinh dàn lạnh: 300.000đ - 600.000đ
 Sửa compressor: 2.000.000đ - 4.000.000đ
 Thay compressor: 4.000.000đ - 12.000.000đ
 Bảo hành: 6-12 tháng', 'Giá dịch vụ'),

('Bảng giá hộp số tự động', 'Chi phí bảo dưỡng và sửa hộp số AT',
 'Thay dầu hộp số ATF: 1.500.000đ - 3.000.000đ
 Vệ sinh van solenoid: 2.000.000đ - 3.500.000đ
 Sửa chữa hộp số: 5.000.000đ - 20.000.000đ
 Đại tu hộp số: 15.000.000đ - 40.000.000đ
 Bảo hành: 6-12 tháng
 Khuyến nghị: Thay dầu ATF mỗi 40.000km', 'Giá dịch vụ'),

-- ==================== CATEGORY: Triệu chứng xe ====================
('Triệu chứng động cơ nóng máy', 'Dấu hiệu và nguyên nhân xe quá nhiệt',
 'Biểu hiện: Kim nhiệt độ vượt ngưỡng, đèn cảnh báo sáng, có mùi khét, nước làm mát sôi, khói trắng từ nắp ca-pô
 Nguyên nhân: Thiếu nước làm mát, van hằng nhiệt kẹt, bơm nước hỏng, quạt giảm nhiệt không hoạt động, két nước rò rỉ
 Nguy hiểm: Động cơ có thể cong xy-lanh, cháy gioăng, hỏng nặng nếu tiếp tục lái
 Xử lý khẩn cấp: Dừng xe ngay, tắt máy, đợi nguội, kiểm tra nước làm mát
 Chi phí sửa: 800.000đ - 5.000.000đ tùy linh kiện hỏng', 'Triệu chứng xe'),

('Triệu chứng phanh kém hiệu quả', 'Dấu hiệu hệ thống phanh có vấn đề',
 'Biểu hiện: Đạp phanh sâu/mềm/cứng, phanh kêu cót két, xe rung lắc khi phanh, xe lệch về một bên, đèn phanh sáng
 Nguyên nhân: Má phanh mòn (<3mm), đĩa phanh rãnh sâu, thiếu dầu phanh, pít-tông kẹt, có khí trong hệ thống
 Nguy hiểm: MẤT PHANH gây tai nạn nghiêm trọng
 Khuyến nghị: Kiểm tra ngay, KHÔNG lái xe nếu phanh bất thường
 Chi phí: 300.000đ - 5.000.000đ tùy mức độ', 'Triệu chứng xe'),

('Triệu chứng xe khó khởi động', 'Dấu hiệu xe nổ khó hoặc không nổ',
 'Biểu hiện: Xe nổ lâu, phải đạp ga nhiều lần, tiếng động cơ yếu, có mùi xăng, khói đen
 Nguyên nhân: Ắc quy yếu (điện áp <12.4V), bugi ướt/hỏng, bơm xăng yếu, lọc nhiên liệu tắc, cảm biến lỗi
 Kiểm tra: Đo điện áp ắc quy, xem bugi có tia lửa không, nghe tiếng bơm xăng
 Chi phí: 400.000đ - 4.000.000đ (thay ắc quy/bugi/bơm xăng)
 Lưu ý: Nếu không nổ hoàn toàn, gọi cứu hộ', 'Triệu chứng xe'),

('Triệu chứng hộp số giật cục', 'Dấu hiệu hộp số tự động có vấn đề',
 'Biểu hiện: Giật cục khi sang số, chậm lên số, không lên số, trượt số khi lên dốc, có tiếng động lạ
 Nguyên nhân: Dầu ATF cũ/bẩn/thiếu, van solenoid kẹt, ly hợp mòn, bộ điều khiển lỗi
 Kiểm tra: Mức dầu ATF, màu dầu (nâu đen = hỏng), mùi khét
 Chi phí: 1.500.000đ - 40.000.000đ (thay dầu đến đại tu)
 Khuyến nghị: Không lái tiếp nếu giật mạnh', 'Triệu chứng xe'),

('Triệu chứng điều hòa không mát', 'Dấu hiệu hệ thống điều hòa yếu',
 'Biểu hiệu: Điều hòa thổi gió nhưng không lạnh, lúc mát lúc không, có mùi hôi, tiếng rít/lạch cạch
 Nguyên nhân: Thiếu gas lạnh (rò rỉ), compressor hỏng, dàn lạnh bẩn, quạt giảm nhiệt không hoạt động
 Kiểm tra: Đường ống có đọng sương không, compressor có quay không
 Chi phí: 400.000đ - 12.000.000đ (nạp gas đến thay compressor)
 Khuyến nghị: Kiểm tra điều hòa trước mùa hè', 'Triệu chứng xe'),

('Triệu chứng xe rung lắc bất thường', 'Dấu hiệu hệ thống treo/lốp có vấn đề',
 'Biểu hiện: Xe nhún nhảy qua gờ, rung khi tăng tốc, lắc lư khi vào cua, có tiếng kêu từ gầm xe
 Nguyên nhân: Giảm xóc hỏng, cao su chống va đập rách, rotuyn lỏng, lốp mòn không đều, bánh xe mất cân bằng
 Kiểm tra: Ấn xuống đầu xe/đuôi xe xem có nhún nhiều lần không
 Chi phí: 800.000đ - 10.000.000đ tùy linh kiện
 Nguy hiểm: Mất lái khi vào cua tốc độ cao', 'Triệu chứng xe'),

-- ==================== CATEGORY: Cảnh báo an toàn ====================
('Cảnh báo động cơ quá nhiệt', 'Nguy hiểm khi xe nóng máy',
 '⚠️ NGUY HIỂM CAO - DỪNG XE NGAY
 Hậu quả: Động cơ cong xy-lanh, cháy gioăng quy-lát, nứt nắp máy, hỏng toàn bộ động cơ (chi phí sửa 50-100 triệu)
 Xử lý khẩn cấp:
 1. Dừng xe ngay, tắt máy
 2. BẬT điều hòa và quạt gió MAX để tản nhiệt
 3. Đợi 15-30 phút cho động cơ nguội
 4. KHÔNG MỞ nắp két nước khi còn nóng (bỏng nghiêm trọng)
 5. Kiểm tra mức nước làm mát, thêm nếu thiếu
 6. Nếu không tự xử lý được, gọi cứu hộ: 1900-xxxx
 Phòng ngừa: Kiểm tra nước làm mát hàng tháng, thay mỗi 2 năm', 'Cảnh báo - An toàn'),

('Cảnh báo phanh mất hiệu quả', 'Nguy hiểm khi phanh không hoạt động',
 '⚠️ NGUY HIỂM CỰC CAO - KHÔNG LÁI XE
 Hậu quả: Tai nạn nghiêm trọng, va chạm, thương vong
 Dấu hiệu nguy hiểm:
 - Đạp phanh chạm sàn xe
 - Phanh không có cảm giác
 - Xe không giảm tốc khi đạp phanh
 - Đèn báo phanh sáng đỏ
 Xử lý khẩn cấp:
 1. Giảm tốc độ bằng thắng gầm (số thấp)
 2. Kéo phanh tay từ từ (KHÔNG giật mạnh)
 3. Tìm đường thoát an toàn
 4. GỌI CỨU HỘ NGAY
 Phòng ngừa: Kiểm tra phanh mỗi 10.000km, thay má phanh khi mòn <3mm', 'Cảnh báo - An toàn'),

('Cảnh báo lốp xe bị nổ', 'Nguy hiểm khi lốp nổ trên đường',
 '⚠️ NGUY HIỂM CAO - GIỮ THĂNG BẰNG
 Hậu quả: Mất lái, lật xe, va chạm
 Xử lý khi lốp nổ đang chạy:
 1. GIỮ CHẶT VÔ LĂNG, không đánh lái mạnh
 2. KHÔNG đạp phanh gấp
 3. Giảm tốc từ từ, bật đèn warning
 4. Tấp vào lề an toàn
 5. Đặt biển cảnh báo phía sau xe (50m)
 6. Thay lốp dự phòng hoặc gọi cứu hộ
 Phòng ngừa: Kiểm tra áp suất lốp hàng tháng (2.2-2.5 bar), thay lốp khi rãnh <1.6mm', 'Cảnh báo - An toàn'),

('Cảnh báo ắc quy yếu', 'Nguy hiểm khi ắc quy hết điện',
 '⚠️ RỦI RO: Mắc kẹt giữa đường, không khởi động xe
 Dấu hiệu ắc quy yếu:
 - Xe khó nổ buổi sáng
 - Đèn mờ khi khởi động
 - Điện áp <12V
 - Ắc quy trên 3 năm tuổi
 Xử lý khẩn cấp:
 1. Dùng dây bàu nối điện từ xe khác
 2. Nối cực dương (+) trước, âm (-) sau
 3. Chờ 5 phút rồi khởi động
 4. Chạy xe 30 phút để sạc lại
 Phòng ngừa: Kiểm tra ắc quy 6 tháng/lần, thay mỗi 2-3 năm
 Chi phí thay: 1.200.000đ - 3.500.000đ', 'Cảnh báo - An toàn'),

-- ==================== CATEGORY: So sánh - Giải thích ====================
('So sánh dầu tổng hợp vs bán tổng hợp', 'Sự khác biệt giữa các loại dầu động cơ',
 'Dầu TỔNG HỢP (Fully Synthetic):
 Ưu: Bôi trơn tốt nhất, chống oxy hóa cao, bảo vệ động cơ tối ưu, dùng được 10.000km
 Nhược: Giá cao (800.000đ - 1.200.000đ)
 Phù hợp: Xe chạy nhiều trong thành phố, xe mới, xe cao cấp
 Thương hiệu: Mobil 1, Castrol Edge, Shell Helix Ultra

 Dầu BÁN TỔNG HỢP (Semi-Synthetic):
 Ưu: Cân bằng giá/chất lượng, dùng được 5.000-7.000km
 Nhược: Kém hơn tổng hợp
 Phù hợp: Xe sử dụng thường xuyên, xe cũ hơn 5 năm
 Thương hiệu: Castrol Magnatec, Shell HX7

 Dầu KHOÁNG (Mineral):
 Ưu: Giá rẻ (400.000đ - 600.000đ)
 Nhược: Bôi trơn kém, thay sau 3.000-5.000km
 Phù hợp: Xe cũ, xe ít chạy

 Khuyến nghị: Dùng dầu tổng hợp cho xe mới, bán tổng hợp cho xe thường', 'So sánh - Giải thích'),

('So sánh lốp có săm vs không săm', 'Ưu nhược điểm 2 loại lốp',
 'Lốp KHÔNG SĂM (Tubeless):
 Ưu: An toàn hơn (xì hơi chậm khi thủng), ít nóng, trọng lượng nhẹ, dễ sửa
 Nhược: Giá cao hơn 15-20%, cần mâm chuyên dụng
 Giá: 1.800.000đ - 5.000.000đ/lốp
 Phù hợp: Xe mới (sau 2015), xe cao cấp

 Lốp CÓ SĂM (Tube):
 Ưu: Giá rẻ hơn, dễ sửa, phù hợp mọi mâm
 Nhược: Xì hơi nhanh khi thủng, nóng hơn, nặng hơn
 Giá: 1.500.000đ - 4.000.000đ/lốp
 Phù hợp: Xe cũ, đường xấu

 Khuyến nghị: Dùng không săm nếu xe hỗ trợ (an toàn hơn)', 'So sánh - Giải thích'),

('Giải thích hệ thống phanh ABS', 'Cách hoạt động của phanh chống bó cứng',
 'ABS (Anti-lock Braking System) = Hệ thống chống bó cứng phanh

 Cách hoạt động:
 - Cảm biến phát hiện bánh xe bị bó cứng
 - ECU điều khiển giảm áp lực phanh (60 lần/giây)
 - Bánh xe vẫn lăn, không trượt
 - Giữ khả năng điều khiển vô lăng

 Ưu điểm:
 - Giữ được khả năng lái khi phanh gấp
 - Rút ngắn quãng đường phanh
 - An toàn hơn trên đường trơn/ướt

 Cách sử dụng:
 1. ĐẠP PHANH MẠNH VÀ GIỮ (KHÔNG nhấc chân)
 2. Cảm thấy rung ở chân là BÌN THƯỜNG
 3. Điều khiển vô lăng để tránh

 Sửa chữa: 1.500.000đ - 5.000.000đ nếu hỏng
 Lưu ý: ABS giúp điều khiển, không rút ngắn quãng phanh nhiều', 'So sánh - Giải thích'),

('Giải thích hộp số tự động AT vs CVT', 'Sự khác biệt giữa 2 loại hộp số',
 'Hộp số TỰ ĐỘNG (AT - Automatic Transmission):
 Cấu tạo: Bánh răng hành tinh + bộ ly hợp
 Ưu: Bền, tăng tốc tốt, chịu tải nặng, dễ sửa
 Nhược: Hao xăng hơn CVT, giật nhẹ khi sang số
 Phù hợp: Xe SUV, xe chở nặng, lái thể thao
 Bảo dưỡng: Thay dầu ATF mỗi 40.000km

 Hộp số VÔ CẤP (CVT - Continuously Variable Transmission):
 Cấu tạo: Dây đai kim loại + 2 puly
 Ưu: Êm, tiết kiệm xăng hơn 10-15%, không giật
 Nhược: Kém bền hơn AT, không phù hợp chở nặng, sửa đắt
 Phù hợp: Xe sedan nhỏ, lái nhẹ nhàng trong phố
 Bảo dưỡng: Thay dầu CVT mỗi 40.000km (dùng ĐÚNG loại dầu CVT)

 Khuyến nghị: AT cho xe SUV/tải trọng, CVT cho xe nhỏ/tiết kiệm', 'So sánh - Giải thích'),

-- ==================== CATEGORY: Hướng dẫn bảo dưỡng ====================
('Lịch bảo dưỡng định kỳ theo km', 'Khung thời gian bảo dưỡng xe chuẩn',
 '5.000km (hoặc 6 tháng):
 - Thay dầu động cơ + lọc dầu
 - Kiểm tra phanh, lốp, đèn
 - Chi phí: 500.000đ - 800.000đ

 10.000km (hoặc 1 năm):
 - Gói 5k + thay lọc gió động cơ
 - Kiểm tra hệ thống treo, điện, ắc quy
 - Chi phí: 1.200.000đ - 2.000.000đ

 20.000km (hoặc 2 năm):
 - Gói 10k + thay lọc nhiên liệu, lọc điều hòa
 - Vệ sinh buồng đốt, cân chỉnh lái
 - Chi phí: 2.500.000đ - 4.000.000đ

 40.000km:
 - Thay dầu hộp số tự động
 - Kiểm tra giảm xóc, rotuyn
 - Chi phí: 3.000.000đ - 5.000.000đ

 60.000km:
 - Thay dây curoa cam, nước làm mát
 - Kiểm tra toàn bộ gầm xe
 - Chi phí: 4.000.000đ - 8.000.000đ

 Lưu ý: Thay theo KM hoặc THỜI GIAN, cái nào đến trước', 'Hướng dẫn bảo dưỡng'),

('Cách kiểm tra ắc quy tại nhà', 'Tự kiểm tra tình trạng ắc quy',
 'Công cụ cần: Đồng hồ vạn năng (multimeter) 50.000đ

 Các bước:
 1. Tắt máy xe, chờ 2 giờ
 2. Mở nắp ca-pô, tìm ắc quy (hộp đen có 2 cực +/-)
 3. Đặt đồng hồ về chế độ DC 20V
 4. Đo điện áp giữa 2 cực

 Kết quả:
 - 12.6V - 12.8V: Ắc quy TỐT
 - 12.4V - 12.6V: Ắc quy ĐỦ DÙNG (nên sạc)
 - 12.0V - 12.4V: Ắc quy YẾU (sắp hết)
 - <12.0V: Ắc quy HỎNG (thay ngay)

 Kiểm tra khi động cơ chạy:
 - 13.8V - 14.4V: Máy phát điện TỐT
 - <13.8V: Máy phát điện YẾU
 - >14.8V: Máy phát QUÁ SẠC (hỏng)

 Tuổi thọ ắc quy: 2-4 năm
 Thay ắc quy: 1.200.000đ - 3.500.000đ', 'Hướng dẫn bảo dưỡng'),

('Cách kiểm tra mức dầu động cơ', 'Tự kiểm tra dầu nhớt tại nhà',
 'Thời điểm kiểm tra: Sáng sớm, động cơ nguội

 Các bước:
 1. Đỗ xe trên mặt phẳng
 2. Tắt máy, đợi 5 phút cho dầu chảy xuống
 3. Mở nắp ca-pô, tìm que thăm dầu (tay cầm màu vàng/cam)
 4. Rút que thăm ra, lau sạch bằng giấy
 5. Cắm que thăm vào đến cùng, rút ra xem mức dầu

 Đọc kết quả:
 - Dầu giữa MIN và MAX: TỐT
 - Dầu dưới MIN: THIẾU (thêm 0.5-1 lít)
 - Dầu trên MAX: DƯ (hút bớt)

 Kiểm tra màu dầu:
 - Vàng trong: Dầu mới, TỐT
 - Nâu sẫm: Dầu cũ, CẦN THAY
 - Đen đặc: Dầu HỎNG, THAY NGAY

 Thêm dầu:
 1. Mở nắp đổ dầu (có ký hiệu thùng dầu)
 2. Thêm từ từ, chờ 1 phút
 3. Kiểm tra lại que thăm

 Lưu ý: Kiểm tra mức dầu mỗi 2 tuần hoặc trước chuyến đi xa', 'Hướng dẫn bảo dưỡng'),

-- ==================== CATEGORY: Thông tin chi nhánh ====================
('Chi nhánh Quận 1 - Trung tâm TP.HCM', 'Garage chính tại trung tâm Sài Gòn',
 'Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP.HCM
 Hotline: 0909 123 456 (24/7)
 Email: cnq1@garage.vn
 Giờ mở cửa: 7:00 - 20:00 (Thứ 2 - CN)

 Dịch vụ nổi bật:
 - Bảo dưỡng nhanh (Express 30 phút)
 - Sửa chữa chuyên sâu động cơ/hộp số
 - Rửa xe + đánh bóng cao cấp

 Tiện ích:
 - Phòng chờ điều hòa, WiFi miễn phí
 - Nước uống, cafe miễn phí
 - Khu vui chơi trẻ em
 - Camera giám sát 24/7

 Đặc biệt:
 - Dịch vụ đưa đón xe tận nhà (5km)
 - Đặt lịch online ưu tiên
 - Thanh toán: Tiền mặt, chuyển khoản, thẻ', 'Thông tin chi nhánh'),

('Chi nhánh Bình Thạnh', 'Garage chuyên điện lạnh và hộp số',
 'Địa chỉ: 45 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM
 Hotline: 0909 988 776
 Email: cnbt@garage.vn
 Giờ mở cửa: 7:30 - 19:30 (Thứ 2 - CN)

 Dịch vụ chuyên môn:
 - Chuyên sâu hộp số tự động AT/CVT
 - Điện lạnh ô tô (nạp gas, sửa compressor)
 - Sửa chữa hệ thống điện ECU

 Tiện ích:
 - Bãi đỗ rộng 20 xe
 - Phòng chờ có TV, điều hòa
 - WiFi tốc độ cao

 Khuyến mãi:
 - Thành viên: Giảm 5% mọi dịch vụ
 - Check-in Facebook: Rửa xe miễn phí
 - Giới thiệu bạn: Tặng 100.000đ', 'Thông tin chi nhánh'),

-- ==================== CATEGORY: Khuyến mãi ====================
('Chương trình khuyến mãi tháng 12/2024', 'Ưu đãi cuối năm',
 '🎄 KHUYẾN MÃI THÁNG 12

 1️⃣ Bảo dưỡng định kỳ:
 - Giảm 15% TẤT CẢ gói bảo dưỡng
 - Tặng voucher rửa xe cao cấp 150.000đ
 - Áp dụng: 01/12 - 31/12/2024

 2️⃣ Thay lốp xe:
 - Mua 3 tặng 1 (lốp Michelin)
 - Miễn phí cân chỉnh độ chụm 3D (400.000đ)
 - Tặng bảo hiểm lốp 1 năm

 3️⃣ Điều hòa ô tô:
 - Combo: Nạp gas + vệ sinh dàn lạnh = 500.000đ (giảm 40%)
 - Giảm 20% sửa chữa compressor

 4️⃣ Khách hàng thân thiết:
 - Tích điểm: 100.000đ = 1 điểm, đổi quà giá trị
 - Ưu tiên đặt lịch trong 24h
 - Hỗ trợ cứu hộ miễn phí 24/7

 Điều kiện: Đặt lịch trước, xuất trình voucher
 Hotline: 0909 123 456', 'Khuyến mãi'),

-- ==================== CATEGORY: Chính sách ====================
('Chính sách bảo hành dịch vụ', 'Cam kết chất lượng và bảo hành',
 'BẢO HÀNH DỊCH VỤ:

 Bảo dưỡng định kỳ:
 - Thời gian: 30 ngày hoặc 1.000km (cái nào đến trước)
 - Nội dung: Miễn phí sửa lại nếu có vấn đề từ dịch vụ

 Sửa chữa lớn:
 - Thời gian: 6-12 tháng tùy dịch vụ
 - Nội dung: Bảo hành công + phụ tùng
 - Ví dụ: Sửa hộp số bảo hành 12 tháng

 Phụ tùng chính hãng:
 - Theo nhà sản xuất: 12-24 tháng
 - Có tem chống hàng giả + hóa đơn VAT

 ĐIỀU KIỆN:
 ✓ Giữ hóa đơn, phiếu bảo hành
 ✓ Bảo dưỡng định kỳ đúng hẹn
 ✓ Không tự ý sửa chữa

 KHÔNG BẢO HÀNH:
 ✗ Tai nạn, va chạm
 ✗ Thiên tai, ngập nước
 ✗ Tự ý độ xe, thay đổi
 ✗ Sử dụng sai cách

 Hotline bảo hành: 0909 123 456 (8:00-17:00)', 'Chính sách'),

('Chính sách đặt lịch và hủy lịch', 'Quy định đặt lịch hẹn',
 'ĐẶT LỊCH:
 - Online: Website/App 24/7
 - Hotline: 0909 123 456 (7:00-20:00)
 - Trực tiếp: Đến chi nhánh

 Thời gian đặt trước: Tối thiểu 4 giờ
 Xác nhận: SMS/Email trong 30 phút

 HỦY LỊCH:
 - Miễn phí: Hủy trước 4 giờ
 - Phí 100.000đ: Hủy trong 4 giờ hoặc không đến
 - Hủy 3 lần: Tạm khóa tài khoản 30 ngày

 ĐỔI LỊCH:
 - Miễn phí: Đổi trước 4 giờ
 - Giới hạn: 2 lần/lịch hẹn

 KHÁCH VIP:
 - Ưu tiên đặt lịch
 - Miễn phí hủy/đổi lịch
 - Hotline riêng: 0909 111 222', 'Chính sách'),

-- ==================== CATEGORY: Câu hỏi thường gặp ====================
('FAQ: Thời gian sửa chữa mất bao lâu?', 'Thời gian dự kiến các dịch vụ',
 'Thay dầu: 30-45 phút
 Bảo dưỡng 10.000km: 90-120 phút
 Thay má phanh: 1-2 giờ
 Nạp gas điều hòa: 1 giờ
 Sửa hộp số: 1-3 ngày
 Sửa động cơ nóng máy: 2-4 giờ
 Thay lốp 4 bánh: 45-60 phút
 Cân chỉnh độ chụm: 60 phút

 Lưu ý: Thời gian có thể kéo dài nếu:
 - Cần đặt phụ tùng (1-3 ngày)
 - Sửa chữa phức tạp
 - Đông khách (cuối tuần, lễ)

 Đặt lịch trước để được ưu tiên!', 'Câu hỏi thường gặp'),

('FAQ: Thanh toán như thế nào?', 'Các hình thức thanh toán',
 'Chấp nhận:
 ✓ Tiền mặt (VNĐ)
 ✓ Chuyển khoản ngân hàng
 ✓ Thẻ ATM (nội địa)
 ✓ Thẻ tín dụng Visa/Master
 ✓ Ví điện tử: Momo, ZaloPay, VNPay

 Hóa đơn:
 - Hóa đơn VAT theo yêu cầu
 - Xuất trong ngày
 - Gửi email nếu cần

 Trả góp:
 - Qua thẻ tín dụng (0% lãi suất 3-6 tháng)
 - Áp dụng: Hóa đơn từ 3.000.000đ

 Bảo lưu xe:
 - Không thanh toán = không nhận xe
 - Phí gửi xe: 50.000đ/ngày sau 24h', 'Câu hỏi thường gặp'),

('FAQ: Có cần đặt lịch trước không?', 'Hướng dẫn đặt lịch',
 'KHUYẾN NGHỊ ĐẶT LỊCH TRƯỚC:
 ✓ Được ưu tiên phục vụ
 ✓ Không phải chờ đợi lâu
 ✓ Chọn được khung giờ phù hợp
 ✓ Chuẩn bị phụ tùng sẵn

 Không đặt lịch:
 - Vẫn được phục vụ
 - Có thể chờ 1-3 giờ (tùy đông khách)

 Thời điểm đông:
 - Cuối tuần (Thứ 7, CN)
 - Trước/sau Tết, lễ lớn
 - Buổi sáng (8:00-10:00)

 Thời điểm vắng:
 - Thứ 2-5
 - Buổi chiều (14:00-17:00)

 Đặt lịch:
 - Online: garage.vn/dat-lich
 - App: Tải "Garage App"
 - Hotline: 0909 123 456', 'Câu hỏi thường gặp');