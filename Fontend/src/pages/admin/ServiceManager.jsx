import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance"; 
import { Plus, Search, DollarSign, Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const API = "/admin/services";
const PAGE_SIZE = 10;

export default function ServiceManager() {
  const [data, setData] = useState({ content: [], totalPages: 1 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [search, setSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // Form thêm/sửa
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    maDV: "", tenDV: "", giaTien: "", moTa: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, size: PAGE_SIZE };
      if (search.trim()) params.search = search.trim();
      if (priceFrom) params.priceFrom = priceFrom;
      if (priceTo) params.priceTo = priceTo;

      const res = await axiosInstance.get(API, { params });
      setData(res.data);
    } catch (err) {
      alert("Lỗi tải danh sách dịch vụ!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, priceFrom, priceTo]);

  const handleSave = async () => {
    if (!form.maDV?.trim() || !form.tenDV?.trim() || !form.giaTien) {
      alert("Vui lòng điền đầy đủ: Mã DV, Tên DV, Giá tiền!");
      return;
    }
    try {
      if (editing) {
        await axiosInstance.put(`${API}/${form.maDV}`, form);
        alert("Cập nhật dịch vụ thành công!");
      } else {
        await axiosInstance.post(API, form);
        alert("Thêm dịch vụ thành công!");
      }
      setShowForm(false);
      setEditing(null);
      setForm({ maDV: "", tenDV: "", giaTien: "", moTa: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu dịch vụ!");
    }
  };

  const handleDelete = async (maDV) => {
    if (!window.confirm(`Xóa dịch vụ ${maDV}?`)) return;
    try {
      await axiosInstance.delete(`${API}/${maDV}`);
      fetchData();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const openForm = (item = null) => {
    setEditing(item);
    setForm(item ? { ...item } : { maDV: "", tenDV: "", giaTien: "", moTa: "" });
    setShowForm(true);
  };

  const resetFilters = () => {
    setSearch("");
    setPriceFrom("");
    setPriceTo("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex justify-between items-center">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center gap-5">
            <DollarSign className="text-green-600" size={56} />
            Quản Lý Dịch Vụ
          </h1>
          <button
            onClick={() => openForm()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition flex items-center gap-4"
          >
            <Plus size={28} /> Thêm dịch vụ mới
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10">
          <h3 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-4">
            <Search size={32} className="text-indigo-600" />
            Bộ lọc tìm kiếm
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tìm kiếm */}
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={26} />
              <input
                type="text"
                placeholder="Tìm mã dịch vụ, tên dịch vụ..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
              />
            </div>

            {/* Lọc giá */}
            <div className="flex items-center gap-4">
              <DollarSign className="text-green-600" size={26} />
              <input
                type="number"
                placeholder="Giá từ (VNĐ)"
                value={priceFrom}
                onChange={e => setPriceFrom(e.target.value)}
                className="flex-1 px-5 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
              <span className="text-xl font-bold text-gray-600">→</span>
              <input
                type="number"
                placeholder="Giá đến (VNĐ)"
                value={priceTo}
                onChange={e => setPriceTo(e.target.value)}
                className="flex-1 px-5 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>

          {/* Nút xóa lọc */}
          {(search || priceFrom || priceTo) && (
            <div className="text-center mt-10">
              <button
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800 font-bold text-xl underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Bảng dịch vụ */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-32 text-2xl text-gray-500">Đang tải dịch vụ...</div>
          ) : data.content.length === 0 ? (
            <div className="text-center py-32 text-3xl text-gray-400 font-bold">Chưa có dịch vụ nào</div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-10 py-6 text-left text-xl font-bold">Mã DV</th>
                    <th className="px-10 py-6 text-left text-xl font-bold">Tên dịch vụ</th>
                    <th className="px-10 py-6 text-right text-xl font-bold">Giá tiền</th>
                    <th className="px-10 py-6 text-left text-xl font-bold">Mô tả</th>
                    <th className="px-10 py-6 text-center text-xl font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.content.map(s => (
                    <tr key={s.maDV} className="hover:bg-indigo-50 transition">
                      <td className="px-10 py-8 font-bold text-indigo-700 text-xl">{s.maDV}</td>
                      <td className="px-10 py-8 font-semibold text-lg">{s.tenDV}</td>
                      <td className="px-10 py-8 text-right font-mono text-xl text-green-600">
                        {Number(s.giaTien).toLocaleString()}đ
                      </td>
                      <td className="px-10 py-8 text-gray-700">{s.moTa || "-"}</td>
                      <td className="px-10 py-8 text-center">
                        <button onClick={() => openForm(s)} className="text-indigo-600 hover:text-indigo-800 mx-4">
                          <Edit3 size={28} />
                        </button>
                        <button onClick={() => handleDelete(s.maDV)} className="text-red-600 hover:text-red-800 mx-4">
                          <Trash2 size={28} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Phân trang */}
              {data.totalPages > 1 && (
                <div className="flex justify-center gap-4 py-8 bg-gray-50">
                  <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0} className="p-4 rounded-full bg-white shadow disabled:opacity-50"><ChevronLeft size={24} /></button>
                  {[...Array(data.totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i)} className={`w-14 h-14 rounded-full font-bold text-xl ${page===i ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl" : "bg-white shadow hover:bg-gray-100"}`}>
                      {i+1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(data.totalPages-1, p+1))} disabled={page===data.totalPages-1} className="p-4 rounded-full bg-white shadow disabled:opacity-50"><ChevronRight size={24} /></button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal thêm/sửa */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-4xl">
              <h2 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {editing ? "SỬA DỊCH VỤ" : "THÊM DỊCH VỤ MỚI"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <input
                  placeholder="Mã dịch vụ (VD: DV001)"
                  value={form.maDV}
                  onChange={e => setForm({ ...form, maDV: e.target.value.toUpperCase() })}
                  className="px-8 py-6 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-indigo-300 font-mono"
                  disabled={!!editing}
                />
                <input
                  placeholder="Tên dịch vụ"
                  value={form.tenDV}
                  onChange={e => setForm({ ...form, tenDV: e.target.value })}
                  className="px-8 py-6 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-purple-300"
                />
                <input
                  type="number"
                  placeholder="Giá tiền (VNĐ)"
                  value={form.giaTien}
                  onChange={e => setForm({ ...form, giaTien: e.target.value })}
                  className="px-8 py-6 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-green-300"
                />
                <textarea
                  placeholder="Mô tả dịch vụ (tùy chọn)"
                  value={form.moTa}
                  onChange={e => setForm({ ...form, moTa: e.target.value })}
                  rows="4"
                  className="px-8 py-6 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-indigo-300 resize-none"
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