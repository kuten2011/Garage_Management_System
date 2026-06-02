-- =========================================================
-- MIGRATION: Cập nhật database đang chạy schema cũ sang bản mới
-- Dùng cho PostgreSQL
-- Chạy file này SAU KHI database đã có dữ liệu cũ.
-- =========================================================

BEGIN;

-- 1) Đảm bảo bảng ChiNhanh có dữ liệu nền để các khóa ngoại không lỗi
INSERT INTO "ChiNhanh" ("maChiNhanh", "tenChiNhanh", "diaChi", "sdt", "email")
VALUES
('CN01', 'Chi nhánh Quận 1', '123 Nguyễn Huệ, Q1, TP.HCM', '0909123456', 'cnq1@garage.vn'),
('CN02', 'Chi nhánh Bình Thạnh', '45 Điện Biên Phủ, Q.BT, TP.HCM', '0909988776', 'cnbt@garage.vn')
ON CONFLICT ("maChiNhanh") DO NOTHING;

-- 2) Thêm cột chi nhánh cho các bảng còn thiếu
ALTER TABLE "NhanVien" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "Xe" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "DichVu" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "PhuTung" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);
ALTER TABLE "BaoCao" ADD COLUMN IF NOT EXISTS "maChiNhanh" VARCHAR(10);

-- 3) Nới độ dài mã báo cáo từ VARCHAR(10) lên VARCHAR(20)
ALTER TABLE "BaoCao" ALTER COLUMN "maBC" TYPE VARCHAR(20);

-- 4) Cập nhật dữ liệu chi nhánh cho dữ liệu cũ
-- Nhân viên
UPDATE "NhanVien" SET "maChiNhanh" = 'CN01' WHERE "maNV" IN ('NV01', 'NV02') AND "maChiNhanh" IS NULL;
UPDATE "NhanVien" SET "maChiNhanh" = 'CN02' WHERE "maNV" = 'NV03' AND "maChiNhanh" IS NULL;
UPDATE "NhanVien" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;

-- Xe
UPDATE "Xe" SET "maChiNhanh" = 'CN01' WHERE "bienSo" IN ('59A-12345', '50C-11223') AND "maChiNhanh" IS NULL;
UPDATE "Xe" SET "maChiNhanh" = 'CN02' WHERE "bienSo" = '51B-67890' AND "maChiNhanh" IS NULL;
UPDATE "Xe" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;

-- Dịch vụ và phụ tùng mặc định về CN01
UPDATE "DichVu" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;
UPDATE "PhuTung" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;

-- Báo cáo
UPDATE "BaoCao" SET "thangNam" = '2025-10' WHERE "thangNam" = '10/2025';
UPDATE "BaoCao" SET "maChiNhanh" = 'CN01' WHERE "maBC" = 'BC01' AND "maChiNhanh" IS NULL;
UPDATE "BaoCao" SET "maChiNhanh" = 'CN02' WHERE "maBC" = 'BC02' AND "maChiNhanh" IS NULL;
UPDATE "BaoCao" SET "maChiNhanh" = 'CN01' WHERE "maChiNhanh" IS NULL;

-- 5) Upsert lại dữ liệu Xe để đồng bộ bản mới
INSERT INTO "Xe" (
    "bienSo", "maKH", "maChiNhanh", "hangXe", "mauXe", "soKm", "namSX",
    "ngayBaoHanhDen", "ngayBaoDuongTiepTheo", "chuKyBaoDuongKm", "chuKyBaoDuongThang"
) VALUES
('59A-12345', 'KH01', 'CN01', 'Toyota', 'Camry', 35000, 2019, '2026-12-31', '2026-06-01', 10000, 12),
('51B-67890', 'KH02', 'CN02', 'Honda', 'Civic', 27000, 2020, '2027-03-15', '2026-09-01', 8000, 6),
('50C-11223', 'KH03', 'CN01', 'Mazda', 'CX-5', 15000, 2022, '2028-10-22', '2026-04-22', 10000, 12)
ON CONFLICT ("bienSo") DO UPDATE SET
    "maKH" = EXCLUDED."maKH",
    "maChiNhanh" = EXCLUDED."maChiNhanh",
    "hangXe" = EXCLUDED."hangXe",
    "mauXe" = EXCLUDED."mauXe",
    "soKm" = EXCLUDED."soKm",
    "namSX" = EXCLUDED."namSX",
    "ngayBaoHanhDen" = EXCLUDED."ngayBaoHanhDen",
    "ngayBaoDuongTiepTheo" = EXCLUDED."ngayBaoDuongTiepTheo",
    "chuKyBaoDuongKm" = EXCLUDED."chuKyBaoDuongKm",
    "chuKyBaoDuongThang" = EXCLUDED."chuKyBaoDuongThang";

-- 6) Upsert lại dữ liệu BaoCao theo format mới
INSERT INTO "BaoCao" ("maBC", "maChiNhanh", "thangNam", "doanhThu", "soXePhucVu")
VALUES
('BC01', 'CN01', '2025-10', 2500000, 12),
('BC02', 'CN02', '2025-10', 1800000, 8)
ON CONFLICT ("maBC") DO UPDATE SET
    "maChiNhanh" = EXCLUDED."maChiNhanh",
    "thangNam" = EXCLUDED."thangNam",
    "doanhThu" = EXCLUDED."doanhThu",
    "soXePhucVu" = EXCLUDED."soXePhucVu";

-- 7) Tạo / sửa khóa ngoại
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

    -- Nếu constraint cũ của BaoCao đang ON DELETE SET NULL thì đổi sang RESTRICT
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bc_cn') THEN
        ALTER TABLE "BaoCao" DROP CONSTRAINT fk_bc_cn;
    END IF;

    ALTER TABLE "BaoCao"
    ADD CONSTRAINT fk_bc_cn FOREIGN KEY ("maChiNhanh") REFERENCES "ChiNhanh"("maChiNhanh") ON DELETE RESTRICT;
END $$;

-- 8) Sau khi đã fill dữ liệu, set NOT NULL cho các cột chi nhánh quan trọng
ALTER TABLE "NhanVien" ALTER COLUMN "maChiNhanh" SET NOT NULL;
ALTER TABLE "Xe" ALTER COLUMN "maChiNhanh" SET NOT NULL;
ALTER TABLE "DichVu" ALTER COLUMN "maChiNhanh" SET NOT NULL;
ALTER TABLE "PhuTung" ALTER COLUMN "maChiNhanh" SET NOT NULL;
ALTER TABLE "BaoCao" ALTER COLUMN "maChiNhanh" SET NOT NULL;

COMMIT;
