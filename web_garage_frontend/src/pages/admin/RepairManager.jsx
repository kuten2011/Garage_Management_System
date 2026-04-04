import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Plus,
  Search,
  Wrench,
  CalendarDays,
  User,
  Car,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE = "/admin";
const API = `${API_BASE}/repairs`;
const BOOKING_API = `${API_BASE}/bookings`;
const EMPLOYEE_API = `${API_BASE}/employees`;
const VEHICLE_API = `${API_BASE}/vehicles`; // API lấy tất cả xe từ database
const PAGE_SIZE = 10;

export default function RepairManager() {
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Dữ liệu dropdown
  const [bookings, setBookings] = useState([]); // Lịch hẹn
  const [employees, setEmployees] = useState({}); // maNV → hoTen
  const [vehicles, setVehicles] = useState([]); // Danh sách xe từ DB (bienSo)

  const [formData, setFormData] = useState({
    maLich: "",
    maNV: "",
    ngayLap: "",
    ghiChu: "",
    trangThai: "Chờ tiếp nhận",
    bienSo: "",
  });

  // Load nhân viên, lịch hẹn và xe từ database ngay khi component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [bookingRes, employeeRes, vehicleRes] = await Promise.all([
          axiosInstance.get(BOOKING_API),
          axiosInstance.get(EMPLOYEE_API),
          axiosInstance.get(VEHICLE_API), // Lấy tất cả xe
        ]);

        const bookingList = bookingRes.data.content || bookingRes.data || [];
        setBookings(bookingList);

        const empMap = {};
        (employeeRes.data.content || employeeRes.data || []).forEach((emp) => {
          empMap[emp.maNV] = emp.hoTen || "Không tên";
        });
        setEmployees(empMap);

        // Xe từ DB
        const vehicleList = vehicleRes.data.content || vehicleRes.data || [];
        setVehicles(vehicleList);
      } catch (err) {
        console.error("Lỗi tải dữ liệu dropdown:", err);
      }
    };

    loadInitialData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`${API}`, {
        params: { page, size: PAGE_SIZE, sort: "ngayLap,desc" },
      });
      setData(res.data);
    } catch (err) {
      alert("Lỗi tải dữ liệu phiếu sửa chữa!");
      setData({ content: [], totalPages: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  // Lọc dữ liệu
  const filteredData = useMemo(() => {
    let items = data.content || [];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.maPhieu?.toLowerCase().includes(term) ||
          item.maLich?.toLowerCase().includes(term) ||
          item.maNV?.toLowerCase().includes(term) ||
          item.khachHang?.hoTen?.toLowerCase().includes(term) ||
          item.xe?.bienSo?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== "Tất cả") {
      items = items.filter((item) => item.trangThai === filterStatus);
    }

    return items;
  }, [data.content, searchTerm, filterStatus]);

  const updateStatus = async (maPhieu, newStatus) => {
    try {
      await axiosInstance.patch(`${API}/${maPhieu}/status`, { trangThai: newStatus });
      fetchData();
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleDelete = async (maPhieu) => {
    if (!window.confirm("Bạn có chắc muốn xóa phiếu sửa chữa này?")) return;
    try {
      await axiosInstance.delete(`${API}/${maPhieu}`);
      fetchData();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const openForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        maLich: item.maLich || "",
        maNV: item.maNV || "",
        ngayLap: item.ngayLap || "",
        ghiChu: item.ghiChu || "",
        trangThai: item.trangThai || "Chờ tiếp nhận",
        bienSo: item.xe?.bienSo || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        maLich: "",
        maNV: "",
        ngayLap: "",
        ghiChu: "",
        trangThai: "Chờ tiếp nhận",
        bienSo: "",
      });
    }
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.maLich.trim()) return alert("Vui lòng chọn mã lịch hẹn!");
    if (!formData.bienSo.trim()) return alert("Vui lòng chọn biển số xe!");

    try {
      if (editingItem) {
        await axiosInstance.put(`${API}/${editingItem.maPhieu}`, formData);
        alert("Cập nhật phiếu thành công!");
      } else {
        await axiosInstance.post(`${API}`, formData);
        alert("Thêm phiếu mới thành công!");
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.ghiChu || err.response?.data?.message || err.message));
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
        return "bg-green-100 text-green-800";
      case "Chờ chuyển khoản":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Wrench size={32} className="text-indigo-600" />
            Quản Lý Phiếu Sửa Chữa
          </h1>
          <button
            onClick={() => openForm()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition text-sm"
          >
            <Plus size={18} />
            Thêm phiếu mới
          </button>
        </div>

        {/* Tìm kiếm & lọc */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm mã phiếu, lịch, nhân viên, khách, biển số..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-5 py-3 border border-gray-200 rounded-xl bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Chờ tiếp nhận">Chờ tiếp nhận</option>
              <option value="Đang sửa">Đang sửa</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>
          </div>
        </div>

        {/* Bảng danh sách */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">Mã Phiếu</th>
                  <th className="px-4 py-4 text-left font-semibold">Mã Lịch</th>
                  <th className="px-4 py-4 text-left font-semibold">Nhân Viên</th>
                  <th className="px-4 py-4 text-left font-semibold">Khách Hàng</th>
                  <th className="px-4 py-4 text-left font-semibold">Biển Số</th>
                  <th className="px-4 py-4 text-center font-semibold">Ngày Lập</th>
                  <th className="px-4 py-4 text-center font-semibold">Trạng Thái</th>
                  <th className="px-4 py-4 text-center font-semibold">Thanh Toán</th>
                  <th className="px-4 py-4 text-center font-semibold">Chi Tiết</th>
                  <th className="px-4 py-4 text-center font-semibold">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="10" className="text-center py-12 text-gray-500">Đang tải...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan="10" className="text-center py-12 text-gray-400">Không có phiếu nào</td></tr>
                ) : (
                  filteredData.map((r) => (
                    <tr key={r.maPhieu} className="hover:bg-indigo-50/50 transition">
                      <td className="px-4 py-4 font-medium text-indigo-700">{r.maPhieu}</td>
                      <td className="px-4 py-4 text-gray-700">{r.maLich || "Chưa có"}</td>
                      <td className="px-4 py-4 text-gray-700">
                        {r.maNV && employees[r.maNV] ? (
                          <div>
                            <div className="font-medium">{employees[r.maNV]}</div>
                            <div className="text-xs text-gray-500">{r.maNV}</div>
                          </div>
                        ) : r.maNV ? (
                          <span className="text-gray-500 italic">Không tìm thấy</span>
                        ) : (
                          <span className="text-orange-600 font-medium">Chưa phân công</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-800 font-medium">{r.khachHang?.hoTen || "N/A"}</td>
                      <td className="px-4 py-4 font-mono font-bold text-purple-700">{r.xe?.bienSo || "Chưa có"}</td>
                      <td className="px-4 py-4 text-center text-gray-700">{r.ngayLap || "-"}</td>
                      <td className="px-4 py-4 text-center">
                        <select
                          value={r.trangThai}
                          onChange={(e) => updateStatus(r.maPhieu, e.target.value)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition ${
                            r.trangThai === "Hoàn thành" ? "bg-green-100 text-green-800" :
                            r.trangThai === "Đang sửa" ? "bg-yellow-100 text-yellow-800" :
                            "bg-orange-100 text-orange-800"
                          }`}
                        >
                          <option value="Chờ tiếp nhận">Chờ tiếp nhận</option>
                          <option value="Đang sửa">Đang sửa</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${getPaymentStatusColor(r.thanhToanStatus)}`}>
                          {r.thanhToanStatus || "Chưa thanh toán"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link
                          to={`/customer/repairParts/${r.maPhieu}`}
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs underline"
                        >
                          <ClipboardList size={16} />
                          Chi tiết
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => openForm(r)} className="text-indigo-600 hover:text-indigo-800 transition" title="Sửa">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(r.maPhieu)} className="text-red-600 hover:text-red-800 transition" title="Xóa">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-5 bg-gray-50">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-md bg-white shadow hover:bg-gray-100 disabled:opacity-50">
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(data.totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded-md font-medium transition text-sm ${page === i ? "bg-indigo-600 text-white" : "bg-white hover:bg-gray-100 text-gray-700"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))} disabled={page === data.totalPages - 1} className="p-2 rounded-md bg-white shadow hover:bg-gray-100 disabled:opacity-50">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* POPUP THÊM/SỬA – BIỂN SỐ XE LẤY TỪ DATABASE */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">
                {editingItem ? "SỬA PHIẾU SỬA CHỮA" : "THÊM PHIẾU MỚI"}
              </h2>

              {editingItem && (
                <div className="text-center mb-6">
                  <span className="inline-block px-6 py-2 bg-indigo-100 text-indigo-800 rounded-full font-bold">
                    Mã phiếu: {editingItem.maPhieu}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Dropdown lịch hẹn */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mã lịch hẹn *</label>
                  <select
                    value={formData.maLich}
                    onChange={(e) => setFormData({ ...formData, maLich: e.target.value })}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
                    required
                  >
                    <option value="">-- Chọn lịch hẹn --</option>
                    {bookings.map((bk) => (
                      <option key={bk.maLich} value={bk.maLich}>
                        {bk.maLich} - {bk.khachHang?.hoTen || bk.hoTenKH || "Khách lẻ"} - {bk.ngayHen ? new Date(bk.ngayHen).toLocaleDateString("vi-VN") : "N/A"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown nhân viên */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nhân viên phụ trách</label>
                  <select
                    value={formData.maNV}
                    onChange={(e) => setFormData({ ...formData, maNV: e.target.value })}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
                  >
                    <option value="">-- Không phân công --</option>
                    {Object.keys(employees).map((maNV) => (
                      <option key={maNV} value={maNV}>
                        {maNV} - {employees[maNV]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown biển số xe – LẤY TỪ DATABASE */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Biển số xe *</label>
                  <select
                    value={formData.bienSo}
                    onChange={(e) => setFormData({ ...formData, bienSo: e.target.value })}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm font-mono"
                    required
                  >
                    <option value="">-- Chọn biển số xe --</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.bienSo} value={vehicle.bienSo}>
                        {vehicle.bienSo} - {vehicle.mauXe || "Xe không xác định"}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="date"
                  value={formData.ngayLap}
                  onChange={(e) => setFormData({ ...formData, ngayLap: e.target.value })}
                  className="px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
                />
              </div>

              <div className="mt-5">
                <select
                  value={formData.trangThai}
                  onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm font-medium"
                >
                  <option value="Chờ tiếp nhận">Chờ tiếp nhận</option>
                  <option value="Đang sửa">Đang sửa</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              </div>

              <textarea
                placeholder="Ghi chú (tùy chọn)"
                value={formData.ghiChu}
                onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                rows="2"
                className="w-full mt-5 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-sm resize-none"
              />

              <div className="flex justify-center gap-5 mt-8">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-10 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  className="px-12 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition text-sm"
                >
                  {editingItem ? "CẬP NHẬT" : "THÊM MỚI"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}