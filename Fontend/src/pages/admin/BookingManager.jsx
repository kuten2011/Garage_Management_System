import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axiosInstance from "../../api/axiosInstance";
import {
  Plus,
  Search,
  CalendarDays,
  Clock3,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";

const API_BASE = "/admin";
const PAGE_SIZE = 10;

const addSchema = z.object({
  maKH: z.string().min(1, "Vui lòng nhập mã khách hàng"),
  ngayHen: z.string().min(1, "Chọn ngày hẹn"),
  gioHen: z.string().min(1, "Chọn giờ hẹn"),
  trangThai: z.enum(["Chờ xác nhận", "Đã xác nhận", "Hoàn thành"]),
  ghiChu: z.string().nullable().optional(),
});

const editSchema = addSchema.extend({ maLich: z.string().min(1) });

export default function BookingManager() {
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isEditing ? editSchema : addSchema),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        size: PAGE_SIZE.toString(),
        sort: "ngayHen,desc",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "Tất cả") params.append("trangThai", filterStatus);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const res = await axiosInstance.get(
        `${API_BASE}/bookings?${params.toString()}`
      );
      setData(res.data);
    } catch (err) {
      alert("Lỗi tải dữ liệu: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchTerm, filterStatus, dateFrom, dateTo]);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("Tất cả");
    setDateFrom("");
    setDateTo("");
  };

  const updateStatus = async (maLich, newStatus) => {
    try {
      await axiosInstance.patch(`${API_BASE}/bookings/${maLich}/status`, {
        trangThai: newStatus,
      });
      fetchData();
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (maLich) => {
    if (!window.confirm("Xóa lịch hẹn này?")) return;
    try {
      await axiosInstance.delete(`${API_BASE}/bookings/${maLich}`);
      fetchData();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const openForm = (item = null) => {
    if (item) {
      setValue("maLich", item.maLich);
      setValue("maKH", item.maKH || "");
      setValue("ngayHen", item.ngayHen);
      setValue("gioHen", item.gioHen);
      setValue("trangThai", item.trangThai);
      setValue("ghiChu", item.ghiChu || "");
      setIsEditing(true);
    } else {
      reset();
      setIsEditing(false);
    }
    setShowForm(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (isEditing) {
        await axiosInstance.put(
          `${API_BASE}/bookings/${formData.maLich}`,
          formData
        );
        alert("Cập nhật thành công!");
      } else {
        const { maLich, ...payload } = formData;
        await axiosInstance.post(`${API_BASE}/bookings`, payload);
        alert("Thêm lịch hẹn thành công!");
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">Quản Lý Lịch Hẹn</h1>
          <button
            onClick={() => openForm()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            <Plus size={22} /> Thêm lịch hẹn
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <Filter size={24} className="text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-800">Bộ lọc tìm kiếm</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Mã lịch, khách hàng, biển số..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 border border-gray-200 rounded-xl bg-white font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CalendarDays size={16} className="text-green-700" />
                </div>
                <span className="text-xs font-bold text-green-700">Từ</span>
              </div>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-20 pr-4 py-4 border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none font-medium"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <CalendarDays size={16} className="text-orange-700" />
                </div>
                <span className="text-xs font-bold text-orange-700">Đến</span>
              </div>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-20 pr-4 py-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none font-medium"
              />
            </div>
          </div>

          {(searchTerm || filterStatus !== "Tất cả" || dateFrom || dateTo) && (
            <div className="mt-6 text-center">
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition"
              >
                <X size={20} /> Xóa toàn bộ bộ lọc
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-5 text-left font-semibold">Mã Lịch</th>
                  <th className="px-6 py-5 text-left font-semibold">
                    Khách Hàng
                  </th>
                  <th className="px-6 py-5 text-center font-semibold">
                    Ngày Hẹn
                  </th>
                  <th className="px-6 py-5 text-center font-semibold">Giờ</th>
                  <th className="px-6 py-5 text-center font-semibold">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-5 text-center font-semibold">
                    Ghi Chú
                  </th>
                  <th className="px-6 py-5 text-center font-semibold">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-16 text-gray-500 text-lg"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : data.content.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-16 text-gray-400 text-xl font-medium"
                    >
                      Không có lịch hẹn nào
                    </td>
                  </tr>
                ) : (
                  data.content.map((item) => (
                    <tr
                      key={item.maLich}
                      className="hover:bg-indigo-50 transition"
                    >
                      <td className="px-6 py-5 font-bold text-indigo-700">
                        {item.maLich}
                      </td>

                      <td className="px-6 py-5">
                        {item.maKH ? (
                          <div>
                            <div className="font-semibold text-gray-800">
                              {item.maKH}
                            </div>
                            {item.hoTenKH && (
                              <div className="text-sm text-gray-600">
                                {item.hoTenKH}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">
                            Chưa có khách
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <CalendarDays size={20} className="text-indigo-600" />
                          <span className="font-medium">{item.ngayHen}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Clock3 size={20} className="text-purple-600" />
                          <span className="font-semibold">{item.gioHen}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <select
                          value={item.trangThai}
                          onChange={(e) =>
                            updateStatus(item.maLich, e.target.value)
                          }
                          className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition ${
                            item.trangThai === "Chờ xác nhận"
                              ? "bg-orange-100 text-orange-800"
                              : item.trangThai === "Đã xác nhận"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đã xác nhận">Đã xác nhận</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                        </select>
                      </td>

                      <td className="px-6 py-5 text-center">
                        {item.ghiChu ? (
                          <button
                            onClick={() => {
                              setSelectedNote(item.ghiChu);
                              setShowNote(true);
                            }}
                            className="max-w-[200px] truncate text-indigo-600 underline hover:text-indigo-800 cursor-pointer"
                            title="Xem ghi chú"
                          >
                            {item.ghiChu}
                          </button>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => openForm(item)}
                            className="text-indigo-600 hover:text-indigo-800 transition"
                          >
                            <Edit3 size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.maLich)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-6 bg-gray-50">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-3 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {[...Array(data.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-10 h-10 rounded-lg font-semibold transition ${
                      page === i
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                        : "bg-white hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages - 1, p + 1))
                }
                disabled={page === data.totalPages - 1}
                className="p-3 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {isEditing ? "SỬA LỊCH HẸN" : "THÊM LỊCH HẸN MỚI"}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {isEditing && (
                  <div className="text-center">
                    <input
                      {...register("maLich")}
                      disabled
                      className="w-full max-w-xs mx-auto px-6 py-3 bg-gray-100 rounded-xl font-bold text-indigo-700 text-center"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      {...register("maKH")}
                      placeholder="Mã khách hàng (VD: KH001)"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 outline-none"
                    />
                    {errors.maKH && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.maKH.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="date"
                    {...register("ngayHen")}
                    className="px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300"
                  />
                  <input
                    type="time"
                    {...register("gioHen")}
                    className="px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-300"
                  />
                </div>

                <select
                  {...register("trangThai")}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 font-medium"
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>

                <textarea
                  {...register("ghiChu")}
                  placeholder="Ghi chú cho lịch hẹn (VD: Khách yêu cầu gọi trước khi đến, kiểm tra phanh...)"
                  rows={3}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 resize-none"
                />
                {errors.ghiChu && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ghiChu.message}
                  </p>
                )}

                <div className="flex justify-center gap-6 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-10 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-70"
                  >
                    {isSubmitting
                      ? "Đang xử lý..."
                      : isEditing
                      ? "CẬP NHẬT"
                      : "THÊM MỚI"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {showNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">
              Ghi chú lịch hẹn
            </h3>

            <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap text-gray-700 leading-relaxed border border-gray-200 p-4 rounded-lg bg-gray-50">
              {selectedNote}
            </div>

            <div className="text-right mt-6">
              <button
                onClick={() => setShowNote(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}