import { useEffect, useMemo, useState } from "react";

const API_URL = "https://provinces.open-api.vn/api/?depth=3";
const STORAGE_KEY = "vietnam_address_locations_v1";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

const baseSelectClass =
  "w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200";

export default function VietnamAddressSelects({
  value,
  onChange,
  label = "Địa chỉ",
  showStreet = true,
}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.expiresAt > Date.now() && Array.isArray(parsed?.data)) {
            if (active) setLocations(parsed.data);
            return;
          }
        }

        const response = await fetch(API_URL);
        const data = await response.json();
        if (Array.isArray(data) && active) {
          setLocations(data);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              expiresAt: Date.now() + CACHE_TTL,
              data,
            }),
          );
        }
      } catch (err) {
        console.error("Không tải được dữ liệu địa chỉ Việt Nam:", err);
        if (active) {
          try {
            const cached = localStorage.getItem(STORAGE_KEY);
            const parsed = cached ? JSON.parse(cached) : null;
            setLocations(Array.isArray(parsed?.data) ? parsed.data : []);
          } catch {
            setLocations([]);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const selectedProvince = useMemo(
    () => locations.find((item) => item.name === value.province),
    [locations, value.province],
  );

  const districts = selectedProvince?.districts || [];

  const selectedDistrict = useMemo(
    () => districts.find((item) => item.name === value.district),
    [districts, value.district],
  );

  const wards = selectedDistrict?.wards || [];

  const handleChange = (field, fieldValue) => {
    if (field === "province") {
      onChange({ province: fieldValue, district: "", ward: "" });
      return;
    }

    if (field === "district") {
      onChange({
        province: value.province,
        district: fieldValue,
        ward: "",
      });
      return;
    }

    onChange({
      province: value.province,
      district: value.district,
      ward: fieldValue,
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <select
          value={value.province}
          onChange={(e) => handleChange("province", e.target.value)}
          className={baseSelectClass}
          disabled={loading}
        >
          <option value="">{loading ? "Đang tải tỉnh / thành..." : "Chọn tỉnh / thành"}</option>
          {locations.map((item) => (
            <option key={item.code} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={value.district}
          onChange={(e) => handleChange("district", e.target.value)}
          className={baseSelectClass}
          disabled={!selectedProvince || loading}
        >
          <option value="">
            {!selectedProvince ? "Chọn tỉnh / thành trước" : "Chọn quận / huyện"}
          </option>
          {districts.map((item) => (
            <option key={item.code} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={value.ward}
          onChange={(e) => handleChange("ward", e.target.value)}
          className={baseSelectClass}
          disabled={!selectedDistrict || loading}
        >
          <option value="">
            {!selectedDistrict ? "Chọn quận / huyện trước" : "Chọn xã / phường"}
          </option>
          {wards.map((item) => (
            <option key={item.code} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        {showStreet && (
          <input
            type="text"
            value={value.street || ""}
            onChange={(e) => onChange({ ...value, street: e.target.value })}
            className="md:col-span-3 w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
            placeholder="Số nhà, đường, tòa nhà..."
          />
        )}
      </div>
    </div>
  );
}
