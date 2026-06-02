-- ===============================
-- CÃ€I Äáº¶T VECTOR CHO RAG
-- ===============================
CREATE EXTENSION IF NOT EXISTS vector;

-- ===============================
-- Báº¢NG CHI NHÃNH
-- ===============================
CREATE TABLE IF NOT EXISTS "ChiNhanh" (
    "maChiNhanh" VARCHAR(10) PRIMARY KEY,
    "tenChiNhanh" VARCHAR(255),
    "diaChi" TEXT,
    "sdt" VARCHAR(20),
    "email" VARCHAR(100)
);

-- ===============================
-- Báº¢NG KHÃCH HÃ€NG
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
-- Báº¢NG NHÃ‚N VIÃŠN
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
-- Báº¢NG XE
-- ===============================
CREATE TABLE IF NOT EXISTS "Xe" (
    "bienSo" VARCHAR(10) PRIMARY KEY,
    "maKH" VARCHAR(10) NOT NULL,
    "maChiNhanh" VARCHAR(10),
    "hangXe" VARCHAR(50),
    "mauXe" VARCHAR(50),
    "soKm" INTEGER,
    "namSX" INTEGER,
    "ngayBaoHanhDen" DATE,
    "ngayBaoDuongTiepTheo" DATE,
    "chuKyBaoDuongKm" INTEGER DEFAULT 10000,
    "chuKyBaoDuongThang" INTEGER DEFAULT 12,
    CONSTRAINT fk_xe_kh FOREIGN KEY ("maKH") REFERENCES "KhachHang"("maKH"),
    CONSTRAINT fk_xe_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh")
);

-- ===============================
-- Báº¢NG Lá»ŠCH Háº¸N
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
-- Báº¢NG Dá»ŠCH Vá»¤
-- ===============================
CREATE TABLE IF NOT EXISTS "DichVu" (
    "maDV" VARCHAR(10) PRIMARY KEY,
    "tenDV" VARCHAR(100),
    "giaTien" NUMERIC(12,2),
    "moTa" TEXT,
    "maChiNhanh" VARCHAR(10),
    CONSTRAINT fk_dv_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh")
);

-- ===============================
-- Báº¢NG PHá»¤ TÃ™NG
-- ===============================
CREATE TABLE IF NOT EXISTS "PhuTung" (
    "maPT" VARCHAR(10) PRIMARY KEY,
    "tenPT" VARCHAR(100) NOT NULL,
    "donGia" NUMERIC(14,2) NOT NULL,
    "soLuongTon" INTEGER NOT NULL DEFAULT 0,
    "moTa" TEXT,
    "hinhAnh" VARCHAR(255),
    "maChiNhanh" VARCHAR(10),
    CONSTRAINT fk_pt_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh")
);

-- ===============================
-- Báº¢NG PHIáº¾U Sá»¬A CHá»®A (ÄÃƒ THÃŠM bienSo + FK Äáº¾N XE)
-- ===============================
CREATE TABLE IF NOT EXISTS "PhieuSuaChua" (
    "maPhieu" VARCHAR(20) PRIMARY KEY,
    "maLich" VARCHAR(10),
    "maNV" VARCHAR(10),
    "ngayLap" DATE,
    "ghiChu" TEXT,
    "trangThai" VARCHAR(50) DEFAULT 'Chá» tiáº¿p nháº­n',
    "thanhToanStatus" VARCHAR(50) DEFAULT 'ChÆ°a thanh toÃ¡n',
    "tongTien" NUMERIC(14,2) DEFAULT 0.0,
    "bienSo" VARCHAR(10),
    "maChiNhanh" VARCHAR(10),
    "ngayHoanThanh" DATE,
    CONSTRAINT fk_phieu_lich FOREIGN KEY ("maLich") REFERENCES "LichHen"("maLich"),
    CONSTRAINT fk_phieu_nv FOREIGN KEY ("maNV") REFERENCES "NhanVien"("maNV"),
    CONSTRAINT fk_phieu_xe FOREIGN KEY ("bienSo") REFERENCES "Xe"("bienSo"),
    CONSTRAINT fk_phieu_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh")
);

-- ===============================
-- Báº¢NG CHI TIáº¾T Sá»¬A CHá»®A - Dá»ŠCH Vá»¤
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
-- Báº¢NG CHI TIáº¾T Sá»¬A CHá»®A - PHá»¤ TÃ™NG
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
-- Báº¢NG PHáº¢N Há»’I
-- ===============================
CREATE TABLE IF NOT EXISTS "PhanHoi" (
    "maPhanHoi" VARCHAR(10) PRIMARY KEY,
    "maPSC" VARCHAR(20) NOT NULL,
    "maChiNhanh" VARCHAR(10),
    "noiDung" TEXT,
    "soSao" INTEGER CHECK ("soSao" >= 1 AND "soSao" <= 5),
    "ngayGui" TIMESTAMP,
    "trangThai" VARCHAR(50) DEFAULT 'ChÆ°a pháº£n há»“i',
    "phanHoiQL" TEXT,

    CONSTRAINT fk_phanhoi_phieusuachua
        FOREIGN KEY ("maPSC") REFERENCES "PhieuSuaChua"("maPhieu") ON DELETE CASCADE,
    CONSTRAINT fk_phanhoi_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE SET NULL
);
-- ===============================
-- Báº¢NG BÃO CÃO
-- ===============================
CREATE TABLE IF NOT EXISTS "BaoCao" (
    "maBC" VARCHAR(20) PRIMARY KEY,
    "maChiNhanh" VARCHAR(10) NOT NULL,
    "thangNam" VARCHAR(10),
    "doanhThu" NUMERIC(14,2),
    "soXePhucVu" INTEGER,
    CONSTRAINT fk_bc_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE RESTRICT
);

-- ===============================
-- BANG DON DAT PHU TUNG
-- ===============================
CREATE TABLE IF NOT EXISTS "DonDatPhuTung" (
    "maDon" VARCHAR(20) PRIMARY KEY,
    "maKH" VARCHAR(10),
    "hoTen" VARCHAR(100) NOT NULL,
    "sdt" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100),
    "maChiNhanh" VARCHAR(10) NOT NULL,
    "ngayDat" TIMESTAMP,
    "trangThai" VARCHAR(50) DEFAULT 'Chá» xÃ¡c nháº­n',
    "tongTien" NUMERIC(14,2) DEFAULT 0,
    "ghiChu" TEXT,
    "daTraKho" BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_ddpt_kh FOREIGN KEY ("maKH") REFERENCES "KhachHang"("maKH") ON DELETE SET NULL,
    CONSTRAINT fk_ddpt_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "CT_DonDatPhuTung" (
    "id" BIGSERIAL PRIMARY KEY,
    "maDon" VARCHAR(20) NOT NULL,
    "maPT" VARCHAR(10) NOT NULL,
    "soLuong" INTEGER NOT NULL,
    "donGia" NUMERIC(14,2) NOT NULL,
    "thanhTien" NUMERIC(14,2) NOT NULL,
    CONSTRAINT fk_ct_ddpt_don FOREIGN KEY ("maDon") REFERENCES "DonDatPhuTung"("maDon") ON DELETE CASCADE,
    CONSTRAINT fk_ct_ddpt_pt FOREIGN KEY ("maPT") REFERENCES "PhuTung"("maPT") ON DELETE RESTRICT
);

ALTER TABLE "NhanVien" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "Xe" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "DichVu" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "PhuTung" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "PhuTung" ADD COLUMN IF NOT EXISTS "moTa" TEXT;
ALTER TABLE "PhieuSuaChua" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "BaoCao" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "BaoCao" ALTER COLUMN "maBC" TYPE VARCHAR(20);
ALTER TABLE "PhanHoi" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "DonDatPhuTung" ADD COLUMN IF NOT EXISTS "maKH" VARCHAR(10);
ALTER TABLE "DonDatPhuTung" ADD COLUMN IF NOT EXISTS "daTraKho" BOOLEAN DEFAULT FALSE;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_nv_cn') THEN
        ALTER TABLE "NhanVien" ADD CONSTRAINT fk_nv_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_xe_cn') THEN
        ALTER TABLE "Xe" ADD CONSTRAINT fk_xe_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_dv_cn') THEN
        ALTER TABLE "DichVu" ADD CONSTRAINT fk_dv_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_pt_cn') THEN
        ALTER TABLE "PhuTung" ADD CONSTRAINT fk_pt_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ddpt_kh') THEN
        ALTER TABLE "DonDatPhuTung" ADD CONSTRAINT fk_ddpt_kh FOREIGN KEY ("maKH") REFERENCES "KhachHang"("maKH") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ddpt_cn') THEN
        ALTER TABLE "DonDatPhuTung" ADD CONSTRAINT fk_ddpt_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE RESTRICT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_phanhoi_cn') THEN
        ALTER TABLE "PhanHoi" ADD CONSTRAINT fk_phanhoi_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE SET NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bc_cn' AND confdeltype = 'n') THEN
        ALTER TABLE "BaoCao" DROP CONSTRAINT fk_bc_cn;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bc_cn') THEN
        ALTER TABLE "BaoCao" ADD CONSTRAINT fk_bc_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE RESTRICT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_phieu_cn') THEN
        ALTER TABLE "PhieuSuaChua" ADD CONSTRAINT fk_phieu_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_phanhoi_phieusuachua') THEN
        ALTER TABLE "PhanHoi" ADD CONSTRAINT fk_phanhoi_phieusuachua FOREIGN KEY ("maPSC") REFERENCES "PhieuSuaChua"("maPhieu") ON DELETE CASCADE;
    END IF;
END $$;

-- ===============================
-- Báº¢NG THÃ”NG TIN Dá»ŠCH Vá»¤ (RAG)
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

