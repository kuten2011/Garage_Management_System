import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Plus,
  Search,
  Car,
  User,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Calendar,
  Shield,
} from "lucide-react";

const API = "/admin/vehicles";
const CUSTOMER_API = "/admin/customers";
const PAGE_SIZE = 10;

// Danh sách hãng xe phổ biến
const COMMON_BRANDS = [
  "Toyota",
  "Honda",
  "Mazda",
  "Hyundai",
  "Kia",
  "Ford",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "VinFast",
  "Mitsubishi",
  "Suzuki",
  "Nissan",
  "Lexus",
  "Volkswagen",
];

export default function VehicleManager() {
  const [data, setData] = useState({ content: [], totalPages: 1, number: 0 });
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // Dữ liệu cho dropdown
  const [customers, setCustomers] = useState([]); // Danh sách khách hàng
  const [selectedBrand, setSelectedBrand] = useState(""); // Hãng xe chọn
  const [customBrand, setCustomBrand] = useState(""); // Hãng xe nhập tay

  const [formData, setFormData] = useState({
    bienSo: "",
    maKH: "",
    hangXe: "",
    mauXe: "",
    soKm: "",
    namSX: "",
    ngayBaoHanhDen: "",
    ngayBaoDuongTiepTheo: "",
    chuKyBaoDuongKm: 10000,
    chuKyBaoDuongThang: 12,
  });

  // Lấy danh sách khách hàng khi mở form
  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get(CUSTOMER_API);
      setCustomers(res.data.content || res.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách khách hàng:", err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, filter]);

  useEffect(() => {
    if (showForm) {
      fetchCustomers();
    }
  }, [showForm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        size: PAGE_SIZE.toString(),
        search: search.trim(),
        filter: filter,
      });
      const res = await axiosInstance.get(`${API}?${params}`);
      setData(res.data);
    } catch (err) {
      alert("Lỗi tải dữ liệu xe!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bienSo) => {
    if (!window.confirm("Xóa xe này?")) return;
    try {
      await axiosInstance.delete(`${API}/${bienSo}`);
      fetchData();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const handleEdit = (v) => {
    setEditing(v);
    setSelectedBrand(v.hangXe || "");
    setCustomBrand(
      v.hangXe && !COMMON_BRANDS.includes(v.hangXe) ? v.hangXe : ""
    );
    setFormData({
      bienSo: v.bienSo,
      maKH: v.maKH,
      hangXe: v.hangXe || "",
      mauXe: v.mauXe || "",
      soKm: v.soKm || "",
      namSX: v.namSX || "",
      ngayBaoHanhDen: v.ngayBaoHanhDen || "",
      ngayBaoDuongTiepTheo: v.ngayBaoDuongTiepTheo || "",
      chuKyBaoDuongKm: v.chuKyBaoDuongKm || 10000,
      chuKyBaoDuongThang: v.chuKyBaoDuongThang || 12,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.maKH || formData.maKH.trim() === "") {
        alert("Vui lòng chọn khách hàng! Không thể để trống mã khách hàng.");
        return;
      }
      if (!formData.bienSo || formData.bienSo.trim() === "") {
        alert("Vui lòng nhập biển số xe!");
        return;
      }
      // Xử lý hãng xe
      const finalHangXe =
        selectedBrand === "OTHER" ? customBrand.trim() : selectedBrand;
      if (selectedBrand === "OTHER" && !finalHangXe) {
        alert("Vui lòng nhập hãng xe nếu chọn 'Khác'!");
        return;
      }

      const dataToSend = {
        ...formData,
        hangXe: finalHangXe,
      };

      if (editing) {
        const patchData = {
          maKH: dataToSend.maKH,
          hangXe: dataToSend.hangXe,
          mauXe: dataToSend.mauXe,
          soKm: dataToSend.soKm,
          namSX: dataToSend.namSX,
          ngayBaoHanhDen: dataToSend.ngayBaoHanhDen || null,
          ngayBaoDuongTiepTheo: dataToSend.ngayBaoDuongTiepTheo || null,
          chuKyBaoDuongKm: dataToSend.chuKyBaoDuongKm,
          chuKyBaoDuongThang: dataToSend.chuKyBaoDuongThang,
        };
        await axiosInstance.patch(`${API}/${formData.bienSo}`, patchData);
      } else {
        await axiosInstance.post(API, dataToSend);
      }

      setShowForm(false);
      setEditing(null);
      setSelectedBrand("");
      setCustomBrand("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại!");
    }
  };

  // Toàn bộ phần render ngoài popup giữ nguyên 100% như code bạn gửi
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-bold text-gray-800">
            Quản Lý Xe Khách Hàng
          </h1>
          <button
            onClick={() => {
              setEditing(null);
              setSelectedBrand("");
              setCustomBrand("");
              setFormData({
                bienSo: "",
                maKH: "",
                hangXe: "",
                mauXe: "",
                soKm: "",
                namSX: "",
                ngayBaoHanhDen: "",
                ngayBaoDuongTiepTheo: "",
                chuKyBaoDuongKm: 10000,
                chuKyBaoDuongThang: 12,
              });
              setShowForm(true);
            }}
            className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition"
          >
            <Plus size={32} />
            THÊM XE MỚI
          </button>
        </div>

        {/* Tìm kiếm */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search size={32} className="absolute left-8 top-6 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm biển số, mã khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-20 pr-8 py-6 text-2xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/*Filter*/}
        <div className="flex justify-center gap-6 mt-8 mb-12">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-6 py-3 rounded-xl font-bold ${
              filter === "ALL" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Tất cả
          </button>

          <button
            onClick={() => setFilter("OVERDUE")}
            className={`px-6 py-3 rounded-xl font-bold ${
              filter === "OVERDUE" ? "bg-red-600 text-white" : "bg-gray-200"
            }`}
          >
            Quá hạn
          </button>

          <button
            onClick={() => setFilter("DUE_SOON")}
            className={`px-6 py-3 rounded-xl font-bold ${
              filter === "DUE_SOON" ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
          >
            Sắp tới hạn
          </button>

          <button
            onClick={() => setFilter("OK")}
            className={`px-6 py-3 rounded-xl font-bold ${
              filter === "OK" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Còn hạn
          </button>
        </div>

        {/* Danh sách xe – GIỮ NGUYÊN 100% NHƯ CODE CŨ */}
        {loading ? (
          <p className="text-center text-3xl text-gray-500 py-32">
            Đang tải...
          </p>
        ) : data.content.length === 0 ? (
          <p className="text-center text-3xl text-gray-500 py-32">
            Không có xe nào
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.content.map((v) => (
              <div
                key={v.bienSo}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
                  <Car size={64} className="mx-auto mb-4" />
                  <h3 className="text-4xl font-bold font-mono">{v.bienSo}</h3>
                  <p className="text-2xl mt-2">
                    {v.hangXe} {v.mauXe}
                  </p>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <User size={28} className="text-blue-600" />
                      <div>
                        <p className="font-bold text-xl">{v.maKH}</p>
                        <p className="text-gray-600 text-lg">
                          {v.tenKH || "Chưa có tên"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Gauge size={28} className="text-gray-600" />
                      <span className="text-xl font-medium">
                        {v.soKm?.toLocaleString() || 0} km • Năm {v.namSX}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Shield size={28} className="text-green-600" />
                      <span className="text-xl font-medium text-green-700">
                        Bảo hành đến: {v.ngayBaoHanhDen || "Không có"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-2xl border-2 border-orange-300">
                      <Calendar size={28} className="text-orange-600" />
                      <div>
                        <p
                          className={`font-bold text-xl ${
                            !v.ngayBaoDuongTiepTheo
                              ? "text-gray-500"
                              : new Date(v.ngayBaoDuongTiepTheo) < new Date()
                              ? "text-red-600"
                              : new Date(v.ngayBaoDuongTiepTheo) <
                                new Date(Date.now() + 7 * 86400000)
                              ? "text-yellow-600"
                              : "text-green-700"
                          }`}
                        >
                          Bảo dưỡng tiếp theo:{" "}
                          {v.ngayBaoDuongTiepTheo || "Chưa xác định"}
                        </p>

                        <p className="text-orange-700">
                          Chu kỳ: {v.chuKyBaoDuongKm || 10000}km /{" "}
                          {v.chuKyBaoDuongThang || 12} tháng
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => handleEdit(v)}
                      className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                      <Edit3 size={24} />
                      SỬA
                    </button>
                    <button
                      onClick={() => handleDelete(v.bienSo)}
                      className="flex-1 flex items-center justify-center gap-3 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                    >
                      <Trash2 size={24} />
                      XÓA
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phân trang – GIỮ NGUYÊN */}
        {data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 mt-16">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-4 rounded-xl bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
            >
              <ChevronLeft size={32} />
            </button>
            <span className="text-2xl font-bold">
              Trang {page + 1} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(data.totalPages - 1, page + 1))}
              disabled={page === data.totalPages - 1}
              className="p-4 rounded-xl bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}

        {/* Form thêm/sửa xe – CHỈ SỬA PHẦN NÀY */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-8">
            <div className="bg-white rounded-3xl shadow-3xl p-12 w-full max-w-4xl max-h-screen overflow-y-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-indigo-700">
                {editing ? "CẬP NHẬT THÔNG TIN XE" : "THÊM XE MỚI"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Biển số
                  </label>
                  <input
                    type="text"
                    value={formData.bienSo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bienSo: e.target.value.toUpperCase(),
                      })
                    }
                    disabled={editing}
                    className="w-full px-8 py-6 text-2xl font-mono border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none disabled:bg-gray-100"
                  />
                </div>

                {/* Dropdown khách hàng */}
                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Khách hàng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.maKH}
                    onChange={(e) =>
                      setFormData({ ...formData, maKH: e.target.value })
                    }
                    className="w-full px-8 py-6 text-xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
                    required
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map((kh) => (
                      <option key={kh.maKH} value={kh.maKH}>
                        {kh.maKH} - {kh.hoTen} ({kh.sdt})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown hãng xe + input tùy chỉnh */}
                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Hãng xe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      if (e.target.value !== "OTHER") {
                        setCustomBrand("");
                      }
                    }}
                    className="w-full px-8 py-6 text-xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
                  >
                    <option value="">-- Chọn hãng xe --</option>
                    {COMMON_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                    <option value="OTHER">Khác (nhập tay)</option>
                  </select>

                  {selectedBrand === "OTHER" && (
                    <input
                      type="text"
                      placeholder="Nhập hãng xe..."
                      value={customBrand}
                      onChange={(e) => setCustomBrand(e.target.value)}
                      className="w-full mt-4 px-8 py-6 text-xl border-2 border-indigo-500 rounded-2xl focus:ring-4 focus:ring-indigo-300 outline-none"
                      required
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Mẫu xe / Màu
                  </label>
                  <input
                    type="text"
                    value={formData.mauXe}
                    onChange={(e) =>
                      setFormData({ ...formData, mauXe: e.target.value })
                    }
                    className="w-full px-8 py-6 text-2xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Số km hiện tại
                  </label>
                  <input
                    type="number"
                    value={formData.soKm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        soKm: parseInt(e.target.value) || "",
                      })
                    }
                    className="w-full px-8 py-6 text-2xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Năm sản xuất
                  </label>
                  <input
                    type="number"
                    value={formData.namSX}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        namSX: parseInt(e.target.value) || "",
                      })
                    }
                    className="w-full px-8 py-6 text-2xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Bảo hành đến ngày
                  </label>
                  <input
                    type="date"
                    value={formData.ngayBaoHanhDen || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ngayBaoHanhDen: e.target.value,
                      })
                    }
                    className="w-full px-8 py-6 text-2xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Bảo dưỡng tiếp theo
                  </label>
                  <input
                    type="date"
                    value={formData.ngayBaoDuongTiepTheo || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ngayBaoDuongTiepTheo: e.target.value,
                      })
                    }
                    className="w-full px-8 py-6 text-2xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Chu kỳ bảo dưỡng (km)
                  </label>
                  <input
                    type="number"
                    value={formData.chuKyBaoDuongKm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chuKyBaoDuongKm: parseInt(e.target.value) || 10000,
                      })
                    }
                    className="w-full px-8 py-6 text-2xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xl font-medium text-gray-700">
                    Chu kỳ bảo dưỡng (tháng)
                  </label>
                  <input
                    type="number"
                    value={formData.chuKyBaoDuongThang}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chuKyBaoDuongThang: parseInt(e.target.value) || 12,
                      })
                    }
                    className="w-full px-8 py-6 text-2xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-12 mt-16">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedBrand("");
                    setCustomBrand("");
                  }}
                  className="px-20 py-6 border-4 border-gray-400 rounded-2xl font-bold text-2xl hover:bg-gray-100 transition"
                >
                  HỦY BỎ
                </button>
                <button
                  onClick={handleSave}
                  className="px-24 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition"
                >
                  {editing ? "CẬP NHẬT" : "THÊM MỚI"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
