-- =========================================================
-- MIGRATION: Cập nhật database đang chạy sang bản schema(2).sql mới nhất
-- Dùng cho PostgreSQL
--
-- File này an toàn để chạy nhiều lần:
-- - Có IF NOT EXISTS cho cột / bảng
-- - Có kiểm tra constraint trước khi thêm
-- - Có UPDATE dữ liệu NULL trước khi SET NOT NULL
--
-- Chạy file này SAU KHI database đã có dữ liệu cũ hoặc đã chạy file update lần trước.
-- =========================================================

BEGIN;

-- 0) Đảm bảo extension vector tồn tại
CREATE EXTENSION IF NOT EXISTS vector;

-- 1) Đảm bảo bảng ChiNhanh tồn tại
CREATE TABLE IF NOT EXISTS "ChiNhanh" (
    "maChiNhanh" VARCHAR(10) PRIMARY KEY,
    "tenChiNhanh" VARCHAR(255),
    "diaChi" TEXT,
    "sdt" VARCHAR(20),
    "email" VARCHAR(100)
);

-- 2) Đảm bảo có dữ liệu chi nhánh nền
INSERT INTO "ChiNhanh" ("maChiNhanh", "tenChiNhanh", "diaChi", "sdt", "email")
VALUES
('CN01', 'Chi nhánh Quận 1', '123 Nguyễn Huệ, Q1, TP.HCM', '0909123456', 'cnq1@garage.vn'),
('CN02', 'Chi nhánh Bình Thạnh', '45 Điện Biên Phủ, Q.BT, TP.HCM', '0909988776', 'cnbt@garage.vn')
ON CONFLICT ("maChiNhanh") DO UPDATE SET
    "tenChiNhanh" = EXCLUDED."tenChiNhanh",
    "diaChi" = EXCLUDED."diaChi",
    "sdt" = EXCLUDED."sdt",
    "email" = EXCLUDED."email";

-- 3) Thêm các cột maChiNhanh nếu database cũ còn thiếu
ALTER TABLE "NhanVien" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "Xe" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "DichVu" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "PhuTung" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "BaoCao" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);

-- THAY ĐỔI MỚI TRONG schema(2).sql:
-- PhieuSuaChua được thêm maChiNhanh
ALTER TABLE "PhieuSuaChua" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);

-- 4) Nới độ dài mã báo cáo
ALTER TABLE "BaoCao" ALTER COLUMN "maBC" TYPE VARCHAR(20);

-- 5) Cập nhật dữ liệu chi nhánh cho dữ liệu cũ
UPDATE "NhanVien" SET "maChiNhanh" = 'CN01' WHERE "maNV" IN ('NV01', 'NV02') AND "maChiNhanh" IS NULL;
UPDATE "NhanVien" SET "maChiNhanh" = 'CN02' WHERE "maNV" = 'NV03' AND "maChiNhanh" IS NULL;
UPDATE "NhanVien" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;

UPDATE "Xe" SET "maChiNhanh" = 'CN01' WHERE "bienSo" IN ('59A-12345', '50C-11223') AND "maChiNhanh" IS NULL;
UPDATE "Xe" SET "maChiNhanh" = 'CN02' WHERE "bienSo" = '51B-67890' AND "maChiNhanh" IS NULL;
UPDATE "Xe" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;

UPDATE "DichVu" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;
UPDATE "PhuTung" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;

UPDATE "BaoCao" SET "thangNam" = '2025-10' WHERE "thangNam" = '10/2025';
UPDATE "BaoCao" SET "maChiNhanh" = 'CN01' WHERE "maBC" = 'BC01' AND "maChiNhanh" IS NULL;
UPDATE "BaoCao" SET "maChiNhanh" = 'CN02' WHERE "maBC" = 'BC02' AND "maChiNhanh" IS NULL;
UPDATE "BaoCao" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;

-- Cập nhật maChiNhanh cho PhieuSuaChua theo nhân viên hoặc xe
UPDATE "PhieuSuaChua" p
SET "maChiNhanh" = COALESCE(nv."maChiNhanh", x."maChiNhanh", 'CN01')
FROM "NhanVien" nv, "Xe" x
WHERE p."maChiNhanh" IS NULL
  AND p."maNV" = nv."maNV"
  AND p."bienSo" = x."bienSo";

-- Nếu phiếu nào không map được thì cho về CN01
UPDATE "PhieuSuaChua" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;

-- 6) Upsert lại dữ liệu PhieuSuaChua theo bản data(2).sql mới nhất
INSERT INTO "PhieuSuaChua" (
    "maPhieu", "maLich", "maNV", "ngayLap", "ghiChu", "trangThai",
    "thanhToanStatus", "tongTien", "bienSo", "maChiNhanh", "ngayHoanThanh"
) VALUES
('PSC01', 'LH03', 'NV01', '2025-10-22', 'Bảo dưỡng định kỳ 10.000km + kiểm tra phanh + thay dầu',
 'Hoàn thành', 'Đã thanh toán', 2350000, '50C-11223', 'CN01', '2025-10-22'),

('PSC02', 'LH01', 'NV02', '2025-10-20', 'Xe không nổ máy, kiểm tra hệ thống khởi động',
 'Hoàn thành', 'Đã thanh toán', 1800000, '59A-12345', 'CN01', '2025-10-21'),

('PSC03', 'LH02', 'NV03', '2025-10-21', 'Đề xe không nổ, kiểm tra ắc quy và bugi',
 'Hoàn thành', 'Chưa thanh toán', 1200000, '51B-67890', 'CN02', '2025-10-22')
ON CONFLICT ("maPhieu") DO UPDATE SET
    "maLich" = EXCLUDED."maLich",
    "maNV" = EXCLUDED."maNV",
    "ngayLap" = EXCLUDED."ngayLap",
    "ghiChu" = EXCLUDED."ghiChu",
    "trangThai" = EXCLUDED."trangThai",
    "thanhToanStatus" = EXCLUDED."thanhToanStatus",
    "tongTien" = EXCLUDED."tongTien",
    "bienSo" = EXCLUDED."bienSo",
    "maChiNhanh" = EXCLUDED."maChiNhanh",
    "ngayHoanThanh" = EXCLUDED."ngayHoanThanh";

-- 7) Tạo bảng mới trong schema(2).sql: DonDatPhuTung
CREATE TABLE IF NOT EXISTS "DonDatPhuTung" (
    "maDon" VARCHAR(20) PRIMARY KEY,
    "hoTen" VARCHAR(100) NOT NULL,
    "sdt" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100),
    "maChiNhanh" VARCHAR(10) NOT NULL,
    "ngayDat" TIMESTAMP,
    "trangThai" VARCHAR(50) DEFAULT 'Chờ xác nhận',
    "tongTien" NUMERIC(14,2) DEFAULT 0,
    "ghiChu" TEXT
);

-- 8) Tạo bảng mới trong schema(2).sql: CT_DonDatPhuTung
CREATE TABLE IF NOT EXISTS "CT_DonDatPhuTung" (
    "id" BIGSERIAL PRIMARY KEY,
    "maDon" VARCHAR(20) NOT NULL,
    "maPT" VARCHAR(10) NOT NULL,
    "soLuong" INTEGER NOT NULL,
    "donGia" NUMERIC(14,2) NOT NULL,
    "thanhTien" NUMERIC(14,2) NOT NULL
);

-- 9) Tạo / sửa khóa ngoại
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_nv_cn') THEN
        ALTER TABLE "NhanVien"
        ADD CONSTRAINT fk_nv_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_xe_cn') THEN
        ALTER TABLE "Xe"
        ADD CONSTRAINT fk_xe_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_dv_cn') THEN
        ALTER TABLE "DichVu"
        ADD CONSTRAINT fk_dv_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_pt_cn') THEN
        ALTER TABLE "PhuTung"
        ADD CONSTRAINT fk_pt_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;

    -- BaoCao phải dùng ON DELETE RESTRICT theo schema mới
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bc_cn') THEN
        ALTER TABLE "BaoCao" DROP CONSTRAINT fk_bc_cn;
    END IF;

    ALTER TABLE "BaoCao"
    ADD CONSTRAINT fk_bc_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE RESTRICT;

    -- THAY ĐỔI MỚI: PhieuSuaChua liên kết ChiNhanh
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_phieu_cn') THEN
        ALTER TABLE "PhieuSuaChua"
        ADD CONSTRAINT fk_phieu_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh");
    END IF;

    -- DonDatPhuTung liên kết ChiNhanh
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ddpt_cn') THEN
        ALTER TABLE "DonDatPhuTung"
        ADD CONSTRAINT fk_ddpt_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE RESTRICT;
    END IF;

    -- CT_DonDatPhuTung liên kết DonDatPhuTung
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ct_ddpt_don') THEN
        ALTER TABLE "CT_DonDatPhuTung"
        ADD CONSTRAINT fk_ct_ddpt_don FOREIGN KEY ("maDon") REFERENCES "DonDatPhuTung"("maDon") ON DELETE CASCADE;
    END IF;

    -- CT_DonDatPhuTung liên kết PhuTung
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ct_ddpt_pt') THEN
        ALTER TABLE "CT_DonDatPhuTung"
        ADD CONSTRAINT fk_ct_ddpt_pt FOREIGN KEY ("maPT") REFERENCES "PhuTung"("maPT") ON DELETE RESTRICT;
    END IF;
END $$;

-- 10) SET NOT NULL sau khi đã fill dữ liệu
ALTER TABLE "NhanVien" ALTER COLUMN "maChiNhanh" SET NOT NULL;
ALTER TABLE "Xe" ALTER COLUMN "maChiNhanh" SET NOT NULL;
ALTER TABLE "DichVu" ALTER COLUMN "maChiNhanh" SET NOT NULL;
ALTER TABLE "PhuTung" ALTER COLUMN "maChiNhanh" SET NOT NULL;
ALTER TABLE "BaoCao" ALTER COLUMN "maChiNhanh" SET NOT NULL;
ALTER TABLE "PhieuSuaChua" ALTER COLUMN "maChiNhanh" SET NOT NULL;

COMMIT;
