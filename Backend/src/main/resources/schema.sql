-- ===============================
-- CÀI ĐẶT VECTOR CHO RAG
-- ===============================
CREATE EXTENSION IF NOT EXISTS vector;

-- ===============================
-- BẢNG CHI NHÁNH
-- ===============================
CREATE TABLE IF NOT EXISTS "ChiNhanh" (
    "maChiNhanh" VARCHAR(10) PRIMARY KEY,
    "tenChiNhanh" VARCHAR(255),
    "diaChi" TEXT,
    "sdt" VARCHAR(20),
    "email" VARCHAR(100)
);

-- ===============================
-- BẢNG KHÁCH HÀNG
-- ===============================
CREATE TABLE IF NOT EXISTS "KhachHang" (
    "maKH" VARCHAR(10) PRIMARY KEY,
    "hoTen" VARCHAR(100),
    "sdt" VARCHAR(20),
    "email" VARCHAR(100),
    "diaChi" TEXT,
    "matKhau" VARCHAR(255),
    "role" VARCHAR(50) DEFAULT 'ROLE_CUSTOMER'
);

-- ===============================
-- BẢNG NHÂN VIÊN
-- ===============================
CREATE TABLE IF NOT EXISTS "NhanVien" (
    "maNV" VARCHAR(10) PRIMARY KEY,
    "hoTen" VARCHAR(100),
    "vaiTro" VARCHAR(50),
    "sdt" VARCHAR(20),
    "email" VARCHAR(100),
    "matKhau" VARCHAR(255),
    "maChiNhanh" VARCHAR(10),
    "role" VARCHAR(50) DEFAULT 'ROLE_EMPLOYEE',
    CONSTRAINT fk_nv_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh")
);

-- ===============================
-- BẢNG XE
-- ===============================
CREATE TABLE IF NOT EXISTS "Xe" (
    "bienSo" VARCHAR(10) PRIMARY KEY,
    "maKH" VARCHAR(10) NOT NULL,
    "hangXe" VARCHAR(50),
    "mauXe" VARCHAR(50),
    "soKm" INTEGER,
    "namSX" INTEGER,
    "ngayBaoHanhDen" DATE,
    "ngayBaoDuongTiepTheo" DATE,
    "chuKyBaoDuongKm" INTEGER DEFAULT 10000,
    "chuKyBaoDuongThang" INTEGER DEFAULT 12,
    CONSTRAINT fk_xe_kh FOREIGN KEY ("maKH") REFERENCES "KhachHang"("maKH")
);

-- ===============================
-- BẢNG LỊCH HẸN
-- ===============================
CREATE TABLE IF NOT EXISTS "LichHen" (
    "maLich" VARCHAR(10) PRIMARY KEY,
    "maKH" VARCHAR(10),
    "ngayHen" DATE,
    "gioHen" TIME,
    "trangThai" VARCHAR(50),
    "ghiChu" TEXT,
    CONSTRAINT fk_lich_kh FOREIGN KEY ("maKH") REFERENCES "KhachHang"("maKH")
);

-- ===============================
-- BẢNG DỊCH VỤ
-- ===============================
CREATE TABLE IF NOT EXISTS "DichVu" (
    "maDV" VARCHAR(10) PRIMARY KEY,
    "tenDV" VARCHAR(100),
    "giaTien" NUMERIC(12,2),
    "moTa" TEXT
);

-- ===============================
-- BẢNG PHỤ TÙNG
-- ===============================
CREATE TABLE IF NOT EXISTS "PhuTung" (
    "maPT" VARCHAR(10) PRIMARY KEY,
    "tenPT" VARCHAR(100) NOT NULL,
    "donGia" NUMERIC(14,2) NOT NULL,
    "soLuongTon" INTEGER NOT NULL DEFAULT 0,
    "hinhAnh" VARCHAR(255)
);

-- ===============================
-- BẢNG PHIẾU SỬA CHỮA (ĐÃ THÊM bienSo + FK ĐẾN XE)
-- ===============================
CREATE TABLE IF NOT EXISTS "PhieuSuaChua" (
    "maPhieu" VARCHAR(20) PRIMARY KEY,
    "maLich" VARCHAR(10),
    "maNV" VARCHAR(10),
    "ngayLap" DATE,
    "ghiChu" TEXT,
    "trangThai" VARCHAR(50) DEFAULT 'Chờ tiếp nhận',
    "thanhToanStatus" VARCHAR(50) DEFAULT 'Chưa thanh toán',
    "tongTien" NUMERIC(14,2) DEFAULT 0.0,
    "bienSo" VARCHAR(10),
    "ngayHoanThanh" DATE,
    CONSTRAINT fk_phieu_lich FOREIGN KEY ("maLich") REFERENCES "LichHen"("maLich"),
    CONSTRAINT fk_phieu_nv FOREIGN KEY ("maNV") REFERENCES "NhanVien"("maNV"),
    CONSTRAINT fk_phieu_xe FOREIGN KEY ("bienSo") REFERENCES "Xe"("bienSo")  -- THÊM FK ĐẾN BẢNG XE
);

-- ===============================
-- BẢNG CHI TIẾT SỬA CHỮA - DỊCH VỤ
-- ===============================
CREATE TABLE IF NOT EXISTS "CT_SuaChua_DichVu" (
    "maPhieu" VARCHAR(20) NOT NULL,
    "maDV" VARCHAR(10) NOT NULL,
    "soLuong" INTEGER,
    "ghiChu" TEXT,
    "thanhTien" NUMERIC(12,2),
    PRIMARY KEY ("maPhieu", "maDV"),
    CONSTRAINT fk_ct_suachua_phieu FOREIGN KEY ("maPhieu") REFERENCES "PhieuSuaChua"("maPhieu") ON DELETE CASCADE,
    CONSTRAINT fk_ct_suachua_dv FOREIGN KEY ("maDV") REFERENCES "DichVu"("maDV") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_ct_suachua_phieu ON "CT_SuaChua_DichVu"("maPhieu");
CREATE INDEX IF NOT EXISTS idx_ct_suachua_dv ON "CT_SuaChua_DichVu"("maDV");

-- ===============================
-- BẢNG CHI TIẾT SỬA CHỮA - PHỤ TÙNG
-- ===============================
CREATE TABLE IF NOT EXISTS "CT_SuaChua_PhuTung" (
    "maPhieu" VARCHAR(20) NOT NULL,
    "maPT" VARCHAR(10) NOT NULL,
    "soLuong" INTEGER,
    "thanhTien" NUMERIC(12,2),
    PRIMARY KEY ("maPhieu", "maPT"),
    CONSTRAINT fk_ct_phutung_phieu FOREIGN KEY ("maPhieu") REFERENCES "PhieuSuaChua"("maPhieu") ON DELETE CASCADE,
    CONSTRAINT fk_ct_phutung_pt FOREIGN KEY ("maPT") REFERENCES "PhuTung"("maPT") ON DELETE RESTRICT
);

-- ===============================
-- BẢNG PHẢN HỒI
-- ===============================
CREATE TABLE IF NOT EXISTS "PhanHoi" (
    "maPhanHoi" VARCHAR(10) PRIMARY KEY,
    "maPSC" VARCHAR(20) NOT NULL,
    "noiDung" TEXT,
    "soSao" INTEGER CHECK ("soSao" >= 1 AND "soSao" <= 5),
    "ngayGui" TIMESTAMP,
    "trangThai" VARCHAR(50) DEFAULT 'Chưa phản hồi',
    "phanHoiQL" TEXT,

    CONSTRAINT fk_phanhoi_phieusuachua
        FOREIGN KEY ("maPSC") REFERENCES "PhieuSuaChua"("maPhieu") ON DELETE CASCADE
);
-- ===============================
-- BẢNG BÁO CÁO
-- ===============================
CREATE TABLE IF NOT EXISTS "BaoCao" (
    "maBC" VARCHAR(10) PRIMARY KEY,
    "maChiNhanh" VARCHAR(10),
    "thangNam" VARCHAR(10),
    "doanhThu" NUMERIC(14,2),
    "soXePhucVu" INTEGER,
    CONSTRAINT fk_bc_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE SET NULL
);

-- ===============================
-- BẢNG THÔNG TIN DỊCH VỤ (RAG)
-- ===============================
CREATE TABLE IF NOT EXISTS "ThongTinDichVu" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "category" VARCHAR(100),
    "embedding" vector(768),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS embedding_idx ON "ThongTinDichVu"
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS title_content_idx ON "ThongTinDichVu"
    USING gin(to_tsvector('english', title || ' ' || content));