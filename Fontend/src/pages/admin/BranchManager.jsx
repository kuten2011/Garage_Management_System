import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance"; 
import {
  Plus,
  Search,
  Building,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API = "/admin/branches";
const PAGE_SIZE = 10;

export default function BranchManager() {
  const [data, setData] = useState({ content: [], totalPages: 1 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Bộ lọc nâng cao
  const [searchTen, setSearchTen] = useState("");
  const [searchDiaChi, setSearchDiaChi] = useState("");
  const [searchSdt, setSearchSdt] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Form thêm/sửa
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    maChiNhanh: "",
    tenChiNhanh: "",
    diaChi: "",
    sdt: "",
    email: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, size: PAGE_SIZE };
      if (searchTen.trim()) params.ten = searchTen.trim();
      if (searchDiaChi.trim()) params.diaChi = searchDiaChi.trim();
      if (searchSdt.trim()) params.sdt = searchSdt.trim();
      if (searchEmail.trim()) params.email = searchEmail.trim();

      const res = await axiosInstance.get(API, { params });
      setData(res.data);
    } catch (err) {
      alert("Lỗi tải danh sách chi nhánh!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchTen, searchDiaChi, searchSdt, searchEmail]);

  const handleSave = async () => {
    if (
      !form.maChiNhanh?.trim() ||
      !form.tenChiNhanh?.trim() ||
      !form.sdt?.trim()
    ) {
      alert("Vui lòng điền đầy đủ mã, tên và số điện thoại!");
      return;
    }
    try {
      if (editing) {
        await axiosInstance.put(`${API}/${form.maChiNhanh}`, form);
        alert("Cập nhật thành công!");
      } else {
        await axiosInstance.post(API, form);
        alert("Thêm chi nhánh thành công!");
      }
      setShowForm(false);
      setEditing(null);
      setForm({
        maChiNhanh: "",
        tenChiNhanh: "",
        diaChi: "",
        sdt: "",
        email: "",
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu chi nhánh!"); 
    }
  };

  const handleDelete = async (maChiNhanh) => {
    if (!window.confirm("Xóa chi nhánh này?")) return;
    try {
      await axiosInstance.delete(`${API}/${maChiNhanh}`);
      fetchData();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const openForm = (branch = null) => {
    setEditing(branch);
    setForm(
      branch
        ? { ...branch }
        : { maChiNhanh: "", tenChiNhanh: "", diaChi: "", sdt: "", email: "" }
    );
    setShowForm(true);
  };

  const resetFilters = () => {
    setSearchTen("");
    setSearchDiaChi("");
    setSearchSdt("");
    setSearchEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex justify-between items-center">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center gap-5">
            <Building className="text-indigo-600" size={56} />
            Quản Lý Chi Nhánh
          </h1>
          <button
            onClick={() => openForm()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition flex items-center gap-4"
          >
            <Plus size={28} /> Thêm chi nhánh mới
          </button>
        </div>

        {/* Bộ lọc nâng cao */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10">
          <h3 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-4">
            <Search size={32} className="text-indigo-600" />
            Bộ lọc chi nhánh
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Tên chi nhánh"
                value={searchTen}
                onChange={(e) => setSearchTen(e.target.value)}
                className="w-full pl-12 pr-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
              />
              <Building
                size={24}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Địa chỉ"
                value={searchDiaChi}
                onChange={(e) => setSearchDiaChi(e.target.value)}
                className="w-full pl-12 pr-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
              <MapPin
                size={24}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Số điện thoại"
                value={searchSdt}
                onChange={(e) => setSearchSdt(e.target.value)}
                className="w-full pl-12 pr-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none font-mono"
              />
              <Phone
                size={24}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none"
              />
              <Mail
                size={24}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {(searchTen || searchDiaChi || searchSdt || searchEmail) && (
            <div className="text-center mt-8">
              <button
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800 font-bold text-xl underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Bảng chi nhánh – ĐÃ SỬA KHÔNG LỆCH HOÀN TOÀN */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-32 text-2xl text-gray-500">
              Đang tải chi nhánh...
            </div>
          ) : data.content.length === 0 ? (
            <div className="text-center py-32 text-3xl text-gray-400 font-bold">
              Chưa có chi nhánh nào
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-10 py-6 text-left text-xl font-bold min-w-[120px]">
                        Mã CN
                      </th>
                      <th className="px-10 py-6 text-left text-xl font-bold min-w-[200px]">
                        Tên chi nhánh
                      </th>
                      <th className="px-10 py-6 text-left text-xl font-bold min-w-[300px]">
                        Địa chỉ
                      </th>
                      <th className="px-10 py-6 text-left text-xl font-bold min-w-[180px]">
                        Số điện thoại
                      </th>
                      <th className="px-10 py-6 text-left text-xl font-bold min-w-[250px]">
                        Email
                      </th>
                      <th className="px-10 py-6 text-center text-xl font-bold min-w-[150px]">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.content.map((b) => (
                      <tr
                        key={b.maChiNhanh}
                        className="hover:bg-indigo-50 transition"
                      >
                        <td className="px-10 py-8 font-bold text-indigo-700 text-xl">
                          {b.maChiNhanh}
                        </td>
                        <td className="px-10 py-8 font-bold text-lg">
                          {b.tenChiNhanh}
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                            <MapPin
                              size={22}
                              className="text-gray-500 flex-shrink-0"
                            />
                            <span className="text-gray-700 break-words">
                              {b.diaChi || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                            <Phone
                              size={22}
                              className="text-green-600 flex-shrink-0"
                            />
                            <span className="text-gray-700 font-mono">
                              {b.sdt}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                            <Mail
                              size={22}
                              className="text-blue-600 flex-shrink-0"
                            />
                            <span className="text-gray-700 break-words">
                              {b.email || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex justify-center gap-6">
                            <button
                              onClick={() => openForm(b)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <Edit3 size={28} />
                            </button>
                            <button
                              onClick={() => handleDelete(b.maChiNhanh)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={28} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
              {data.totalPages > 1 && (
                <div className="flex justify-center gap-4 py-8 bg-gray-50">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-4 rounded-full bg-white shadow disabled:opacity-50"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  {[...Array(data.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-14 h-14 rounded-full font-bold text-xl ${
                        page === i
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl"
                          : "bg-white shadow hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages - 1, p + 1))
                    }
                    disabled={page === data.totalPages - 1}
                    className="p-4 rounded-full bg-white shadow disabled:opacity-50"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal thêm/sửa chi nhánh */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-4xl">
              <h2 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {editing ? "SỬA CHI NHÁNH" : "THÊM CHI NHÁNH MỚI"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <input
                  placeholder="Mã chi nhánh (VD: CN01)"
                  value={form.maChiNhanh}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maChiNhanh: e.target.value.toUpperCase(),
                    })
                  }
                  className="px-8 py-6 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-indigo-300 font-mono"
                  disabled={!!editing}
                />
                <input
                  placeholder="Tên chi nhánh"
                  value={form.tenChiNhanh}
                  onChange={(e) =>
                    setForm({ ...form, tenChiNhanh: e.target.value })
                  }
                  className="px-8 py-6 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-purple-300"
                />
                <textarea
                  placeholder="Địa chỉ chi nhánh"
                  value={form.diaChi}
                  onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                  rows="3"
                  className="px-8 py-6 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-blue-300 resize-none"
                />
                <input
                  placeholder="Số điện thoại"
                  value={form.sdt}
                  onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                  className="px-8 py-6 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-green-300 font-mono"
                />
                <input
                  type="email"
                  placeholder="Email chi nhánh"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="px-8 py-6 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-orange-300"
                />
              </div>

              <div className="flex justify-center gap-10 mt-16">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-16 py-6 border-2 border-gray-400 rounded-2xl font-bold text-2xl hover:bg-gray-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  className="px-20 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition"
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
