-- =========================================================
-- MIGRATION: Cập nhật DB đang chạy từ bản schema(2) lên schema(4)
-- PostgreSQL
--
-- File này an toàn để chạy nhiều lần:
-- - ADD COLUMN IF NOT EXISTS
-- - CREATE TABLE IF NOT EXISTS
-- - Kiểm tra constraint trước khi thêm
-- - Không DROP database, không xóa dữ liệu cũ
-- =========================================================

BEGIN;

-- 0) Extension vector cho bảng RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- 1) Đảm bảo các bảng nền quan trọng tồn tại
CREATE TABLE IF NOT EXISTS "ChiNhanh" (
    "maChiNhanh" VARCHAR(10) PRIMARY KEY,
    "tenChiNhanh" VARCHAR(255),
    "diaChi" TEXT,
    "sdt" VARCHAR(20),
    "email" VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS "KhachHang" (
    "maKH" VARCHAR(10) PRIMARY KEY,
    "hoTen" VARCHAR(100),
    "sdt" VARCHAR(20),
    "email" VARCHAR(100),
    "diaChi" TEXT,
    "matKhau" VARCHAR(255),
    "role" VARCHAR(50) DEFAULT 'ROLE_CUSTOMER'
);

-- 2) Bản schema(4) thêm mô tả cho phụ tùng
ALTER TABLE "PhuTung"
ADD COLUMN IF NOT EXISTS "moTa" TEXT;

-- 3) Bản schema(4) thêm chi nhánh cho phản hồi
ALTER TABLE "PhanHoi"
ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);

-- Tự gán chi nhánh cho phản hồi dựa theo phiếu sửa chữa nếu dữ liệu đang NULL
UPDATE "PhanHoi" ph
SET "maChiNhanh" = psc."maChiNhanh"
FROM "PhieuSuaChua" psc
WHERE ph."maPSC" = psc."maPhieu"
  AND ph."maChiNhanh" IS NULL
  AND psc."maChiNhanh" IS NOT NULL;

-- 4) Đảm bảo bảng đơn đặt phụ tùng đúng bản mới nhất
CREATE TABLE IF NOT EXISTS "DonDatPhuTung" (
    "maDon" VARCHAR(20) PRIMARY KEY,
    "maKH" VARCHAR(10),
    "hoTen" VARCHAR(100) NOT NULL,
    "sdt" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100),
    "maChiNhanh" VARCHAR(10) NOT NULL,
    "ngayDat" TIMESTAMP,
    "trangThai" VARCHAR(50) DEFAULT 'Chờ xác nhận',
    "tongTien" NUMERIC(14,2) DEFAULT 0,
    "ghiChu" TEXT,
    "daTraKho" BOOLEAN DEFAULT FALSE
);

ALTER TABLE "DonDatPhuTung"
ADD COLUMN IF NOT EXISTS "maKH" VARCHAR(10);

ALTER TABLE "DonDatPhuTung"
ADD COLUMN IF NOT EXISTS "daTraKho" BOOLEAN DEFAULT FALSE;

-- Gán giá trị mặc định cho dữ liệu cũ
UPDATE "DonDatPhuTung"
SET "daTraKho" = FALSE
WHERE "daTraKho" IS NULL;

ALTER TABLE "DonDatPhuTung"
ALTER COLUMN "daTraKho" SET DEFAULT FALSE;

-- 5) Đảm bảo bảng chi tiết đơn đặt phụ tùng tồn tại
CREATE TABLE IF NOT EXISTS "CT_DonDatPhuTung" (
    "id" BIGSERIAL PRIMARY KEY,
    "maDon" VARCHAR(20) NOT NULL,
    "maPT" VARCHAR(10) NOT NULL,
    "soLuong" INTEGER NOT NULL,
    "donGia" NUMERIC(14,2) NOT NULL,
    "thanhTien" NUMERIC(14,2) NOT NULL
);

-- 6) Sửa default tiếng Việt cho đúng encoding, tránh lấy default bị lỗi font từ schema(4)
ALTER TABLE "PhieuSuaChua"
ALTER COLUMN "trangThai" SET DEFAULT 'Chờ tiếp nhận';

ALTER TABLE "PhieuSuaChua"
ALTER COLUMN "thanhToanStatus" SET DEFAULT 'Chưa thanh toán';

ALTER TABLE "PhanHoi"
ALTER COLUMN "trangThai" SET DEFAULT 'Chưa phản hồi';

ALTER TABLE "DonDatPhuTung"
ALTER COLUMN "trangThai" SET DEFAULT 'Chờ xác nhận';

-- 7) Thêm khóa ngoại mới, kiểm tra trước để chạy nhiều lần không lỗi
DO $$
BEGIN
    -- PhanHoi -> ChiNhanh
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_phanhoi_cn') THEN
        ALTER TABLE "PhanHoi"
        ADD CONSTRAINT fk_phanhoi_cn
        FOREIGN KEY ("maChiNhanh")
        REFERENCES "ChiNhanh"("maChiNhanh")
        ON DELETE SET NULL;
    END IF;

    -- PhanHoi -> PhieuSuaChua, nếu DB cũ chưa có
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_phanhoi_phieusuachua') THEN
        ALTER TABLE "PhanHoi"
        ADD CONSTRAINT fk_phanhoi_phieusuachua
        FOREIGN KEY ("maPSC")
        REFERENCES "PhieuSuaChua"("maPhieu")
        ON DELETE CASCADE;
    END IF;

    -- DonDatPhuTung -> KhachHang
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ddpt_kh') THEN
        ALTER TABLE "DonDatPhuTung"
        ADD CONSTRAINT fk_ddpt_kh
        FOREIGN KEY ("maKH")
        REFERENCES "KhachHang"("maKH")
        ON DELETE SET NULL;
    END IF;

    -- DonDatPhuTung -> ChiNhanh
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ddpt_cn') THEN
        ALTER TABLE "DonDatPhuTung"
        ADD CONSTRAINT fk_ddpt_cn
        FOREIGN KEY ("maChiNhanh")
        REFERENCES "ChiNhanh"("maChiNhanh")
        ON DELETE RESTRICT;
    END IF;

    -- CT_DonDatPhuTung -> DonDatPhuTung
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ct_ddpt_don') THEN
        ALTER TABLE "CT_DonDatPhuTung"
        ADD CONSTRAINT fk_ct_ddpt_don
        FOREIGN KEY ("maDon")
        REFERENCES "DonDatPhuTung"("maDon")
        ON DELETE CASCADE;
    END IF;

    -- CT_DonDatPhuTung -> PhuTung
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ct_ddpt_pt') THEN
        ALTER TABLE "CT_DonDatPhuTung"
        ADD CONSTRAINT fk_ct_ddpt_pt
        FOREIGN KEY ("maPT")
        REFERENCES "PhuTung"("maPT")
        ON DELETE RESTRICT;
    END IF;
END $$;

-- 8) Đảm bảo bảng RAG đúng bản mới nhất
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

COMMIT;

-- =========================================================
-- XONG: DB đã được cập nhật lên các thay đổi mới của schema(4).
-- data(4).sql không khác data(2).sql, nên migration này chủ yếu cập nhật schema.
-- =========================================================
