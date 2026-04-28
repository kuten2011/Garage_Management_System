import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Plus,
  Search,
  Package,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ArrowUpDown,
  Upload,
  X,
  Image,
} from "lucide-react";

const API = "/admin/parts";
const PAGE_SIZE = 10;

export default function PartManager() {
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [stockUnder, setStockUnder] = useState("");
  const [sortBy, setSortBy] = useState("maPT");
  const [sortDir, setSortDir] = useState("asc");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ tenPT: "", donGia: "", soLuongTon: "" });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: PAGE_SIZE,
        sortBy,
        sortDir,
        ...(search && { search }),
        ...(priceFrom && { priceFrom }),
        ...(priceTo && { priceTo }),
        ...(stockUnder && { stockUnder }),
      };

      if (search.trim()) params.append("search", search.trim());
      if (priceFrom) params.append("priceFrom", priceFrom);
      if (priceTo) params.append("priceTo", priceTo);
      if (stockUnder) params.append("stockUnder", stockUnder);

      const res = await axiosInstance.get(API, { params });
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, priceFrom, priceTo, stockUnder, sortBy, sortDir]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ảnh không được vượt quá 5MB!");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // const handleSave = async () => {
  //   if (!form.tenPT || !form.donGia || form.soLuongTon === "") {
  //     alert("Điền đầy đủ thông tin!");
  //     return;
  //   }
  //   try {
  //     if (editing) {
  //       await axiosInstance.put(`${API}/${editing.maPT}`, {
  //         tenPT: form.tenPT,
  //         donGia: Number(form.donGia),
  //         soLuongTon: Number(form.soLuongTon)
  //       });
  //     } else {
  //       await axiosInstance.post(API, {
  //         tenPT: form.tenPT,
  //         donGia: Number(form.donGia),
  //         soLuongTon: Number(form.soLuongTon)
  //       });
  //     }
  //     setShowForm(false);
  //     setEditing(null);
  //     setForm({ tenPT: "", donGia: "", soLuongTon: "" });
  //     fetchData();
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Lỗi lưu!");
  //   }
  // };
  const handleSave = async () => {
    if (!form.tenPT || !form.donGia || form.soLuongTon === "") {
      alert("Điền đầy đủ thông tin!");
      return;
    }
    try {
      if (editing) {
        // UPDATE với FormData
        const formData = new FormData();
        formData.append("maPT", editing.maPT);
        formData.append("tenPT", form.tenPT);
        formData.append("donGia", form.donGia);
        formData.append("soLuongTon", form.soLuongTon);

        if (imageFile) {
          formData.append("image", imageFile);
        }

        await axiosInstance.put(`${API}/${editing.maPT}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // CREATE với FormData (không gửi maPT - backend tự tạo)
        const formData = new FormData();
        formData.append("tenPT", form.tenPT);
        formData.append("donGia", form.donGia);
        formData.append("soLuongTon", form.soLuongTon);

        if (imageFile) {
          formData.append("image", imageFile);
        }

        await axiosInstance.post(API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setShowForm(false);
      setEditing(null);
      setForm({ tenPT: "", donGia: "", soLuongTon: "" });
      setImageFile(null);
      setImagePreview(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu!");
    }
  };

  const handleDelete = async (maPT) => {
    if (!confirm("Xóa phụ tùng này?")) return;
    await axiosInstance.delete(`${API}/${maPT}`);
    fetchData();
  };

  const openForm = (item = null) => {
    setEditing(item);
    setForm(
      item
        ? {
            tenPT: item.tenPT,
            donGia: item.donGia,
            soLuongTon: item.soLuongTon,
          }
        : { tenPT: "", donGia: "", soLuongTon: "" },
    );
    setImageFile(null);
    setImagePreview(item?.hinhAnh || null);
    setShowForm(true);
  };

  const resetFilters = () => {
    setSearch("");
    setPriceFrom("");
    setPriceTo("");
    setStockUnder("");
    setSortBy("maPT");
    setSortDir("asc");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-4">
            <Package className="text-indigo-600" size={44} />
            Quản Lý Phụ Tùng
          </h1>
          <button
            onClick={() => openForm()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition"
          >
            <Plus size={24} className="inline mr-2" /> Thêm phụ tùng
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Search size={28} className="text-indigo-600" />
            Bộ lọc & Sắp xếp
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={22}
              />
              <input
                type="text"
                placeholder="Tìm mã hoặc tên phụ tùng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-lg"
              />
            </div>

            <input
              type="number"
              placeholder="Giá từ (đ)"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none text-lg placeholder-gray-500"
            />

            <input
              type="number"
              placeholder="Giá đến (đ)"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none text-lg placeholder-gray-500"
            />

            <div className="relative">
              <AlertTriangle
                className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                size={22}
              />
              <input
                type="number"
                placeholder="Tồn kho dưới... (cảnh báo)"
                value={stockUnder}
                onChange={(e) => setStockUnder(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-lg"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-lg font-medium"
            >
              <option value="maPT">Mã phụ tùng</option>
              <option value="tenPT">Tên phụ tùng</option>
              <option value="donGia">Đơn giá</option>
              <option value="soLuongTon">Tồn kho</option>
            </select>

            <button
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition text-lg"
            >
              <ArrowUpDown size={22} />
              {sortDir === "asc" ? "Tăng dần" : "Giảm dần"}
            </button>
          </div>

          {(search || priceFrom || priceTo || stockUnder) && (
            <div className="mt-6 text-center">
              <button
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800 font-bold underline text-lg"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-xl">
              Đang tải dữ liệu...
            </div>
          ) : data.content.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-2xl font-bold">
              Không tìm thấy phụ tùng nào
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-8 py-5 text-left">Hình Ảnh</th>
                    <th className="px-8 py-5 text-left">Mã PT</th>
                    <th className="px-8 py-5 text-left">Tên Phụ Tùng</th>
                    <th className="px-8 py-5 text-right">Đơn Giá</th>
                    <th className="px-8 py-5 text-center">Tồn Kho</th>
                    <th className="px-8 py-5 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.content.map((p) => (
                    <tr key={p.maPT} className="hover:bg-indigo-50 transition">
                      <td className="px-8 py-6">
                        {p.hinhAnh ? (
                          <img
                            src={p.hinhAnh}
                            alt={p.tenPT}
                            className="w-16 h-16 object-cover rounded-lg shadow"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Image size={32} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 font-bold text-indigo-700 text-lg">
                        {p.maPT}
                      </td>
                      <td className="px-8 py-6 text-gray-800">{p.tenPT}</td>
                      <td className="px-8 py-6 text-right font-mono text-lg">
                        {p.donGia.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={`px-5 py-2 rounded-full font-bold text-sm ${p.soLuongTon === 0 ? "bg-red-100 text-red-800" : p.soLuongTon <= 5 ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}`}
                        >
                          {p.soLuongTon}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => openForm(p)}
                          className="text-indigo-600 hover:text-indigo-800 mx-4"
                        >
                          <Edit3 size={24} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.maPT)}
                          className="text-red-600 hover:text-red-800 mx-4"
                        >
                          <Trash2 size={24} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {data.totalPages > 1 && (
                <div className="flex justify-center gap-3 py-6 bg-gray-50">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-3 rounded-lg bg-white shadow disabled:opacity-50"
                  >
                    <ChevronLeft />
                  </button>
                  {[...Array(data.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-12 h-12 rounded-lg font-bold ${page === i ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "bg-white"} shadow`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages - 1, p + 1))
                    }
                    disabled={page === data.totalPages - 1}
                    className="p-3 rounded-lg bg-white shadow disabled:opacity-50"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {editing ? "SỬA PHỤ TÙNG" : "THÊM PHỤ TÙNG MỚI"}
              </h2>
              {editing && (
                <p className="text-center text-2xl font-bold text-indigo-700 mb-8">
                  Mã: {editing.maPT}
                </p>
              )}
              <div className="space-y-8">
                <input
                  placeholder="Tên phụ tùng"
                  value={form.tenPT}
                  onChange={(e) => setForm({ ...form, tenPT: e.target.value })}
                  className="w-full px-6 py-5 border-2 border-gray-300 rounded-xl text-xl focus:ring-4 focus:ring-indigo-300"
                />
                <input
                  type="number"
                  placeholder="Đơn giá"
                  value={form.donGia}
                  onChange={(e) => setForm({ ...form, donGia: e.target.value })}
                  className="w-full px-6 py-5 border-2 border-gray-300 rounded-xl text-xl focus:ring-4 focus:ring-purple-300"
                />
                <input
                  type="number"
                  placeholder="Số lượng tồn kho"
                  value={form.soLuongTon}
                  onChange={(e) =>
                    setForm({ ...form, soLuongTon: e.target.value })
                  }
                  className="w-full px-6 py-5 border-2 border-gray-300 rounded-xl text-xl focus:ring-4 focus:ring-green-300"
                />

                {/* Upload ảnh */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  <label className="flex flex-col items-center cursor-pointer">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 rounded-lg shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeImage();
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={48} className="text-gray-400 mb-2" />
                        <span className="text-gray-600 text-lg">
                          Click để chọn ảnh
                        </span>
                        <span className="text-gray-400 text-sm mt-1">
                          PNG, JPG tối đa 5MB
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-12">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-12 py-5 border-2 border-gray-400 rounded-xl font-bold text-xl hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-16 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl"
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
