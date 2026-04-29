import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Search,
  MessageSquare,
  Star,
  Car,
  User,
  Clock,
  CheckCircle,
  Edit3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API = "/admin/feedbacks";
const PAGE_SIZE = 10;

export default function FeedbackManager() {
  const [data, setData] = useState({ content: [], totalPages: 1 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [starFilter, setStarFilter] = useState("Tất cả"); // Bộ lọc sao mới
  const [selected, setSelected] = useState(null);
  const [responseText, setResponseText] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "0",
        size: "1000", 
        search: search.trim(),
        trangThai: statusFilter === "Tất cả" ? "" : statusFilter,
      });
      const res = await axiosInstance.get(`${API}?${params}`);
      let filtered = res.data.content || res.data || [];

      if (starFilter !== "Tất cả") {
        filtered = filtered.filter((fb) => fb.soSao === parseInt(starFilter));
      }

      const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
      setData({
        content: pageData,
        totalPages: Math.ceil(filtered.length / PAGE_SIZE),
        number: page,
      });
    } catch (err) {
      alert("Lỗi tải phản hồi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, statusFilter, starFilter]);

  const handleSaveResponse = async () => {
    if (!responseText.trim()) return alert("Vui lòng nhập phản hồi!");
    try {
      const dto = { phanHoiQL: responseText, trangThai: "Đã phản hồi" };
      await axiosInstance.patch(`${API}/${selected.maPhanHoi}`, dto);
      alert("Phản hồi thành công!");
      setSelected(null);
      setResponseText("");
      fetchData();
    } catch (err) {
      alert("Gửi phản hồi thất bại!");
    }
  };

  const renderStars = (soSao) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={20}
            className={
              i <= soSao ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }
          />
        ))}
        <span className="ml-2 font-bold text-lg">{soSao}/5</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 flex items-center justify-center gap-4">
          <MessageSquare size={40} className="text-indigo-600" />
          Quản Lý Phản Hồi Khách Hàng
        </h1>

        {/* Bộ lọc – ĐÃ BỔ SUNG LỌC THEO SAO */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm theo nội dung, biển số, khách hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border rounded-xl focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-4 border rounded-xl bg-white font-medium"
            >
              <option>Tất cả trạng thái</option>
              <option>Chưa phản hồi</option>
              <option>Đã phản hồi</option>
            </select>

            {/* BỘ LỌC THEO SỐ SAO MỚI */}
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="px-6 py-4 border rounded-xl bg-white font-medium flex items-center gap-3"
            >
              <option value="Tất cả">Tất cả số sao</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>

        {/* Danh sách phản hồi – GIỮ NGUYÊN 100% NHƯ CŨ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 text-xl text-gray-500">
              Đang tải...
            </div>
          ) : data.content.length === 0 ? (
            <div className="col-span-full text-center py-20 text-xl text-gray-500">
              Chưa có phản hồi nào
            </div>
          ) : (
            data.content.map((fb) => (
              <div
                key={fb.maPhanHoi}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Car size={18} />
                      <span className="font-mono font-bold">{fb.bienSo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={18} />
                      <span>
                        {fb.hoTenKhach} ({fb.maKH})
                      </span>
                    </div>
                  </div>
                  {renderStars(fb.soSao)}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  {fb.noiDung}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {new Date(fb.ngayGui).toLocaleString("vi-VN")}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      fb.trangThai === "Đã phản hồi"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {fb.trangThai}
                  </span>
                </div>

                {fb.phanHoiQL && (
                  <div className="bg-indigo-50 p-4 rounded-xl mt-4">
                    <p className="text-indigo-800 font-medium">
                      Phản hồi của garage:
                    </p>
                    <p className="text-indigo-700">{fb.phanHoiQL}</p>
                  </div>
                )}

                {fb.trangThai === "Chưa phản hồi" && (
                  <button
                    onClick={() => {
                      setSelected(fb);
                      setResponseText(fb.phanHoiQL || "");
                    }}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Edit3 size={18} />
                    Trả lời
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Phân trang – GIỮ NGUYÊN */}
        {data.totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-3 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">
              Trang {page + 1} / {data.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(data.totalPages - 1, p + 1))
              }
              disabled={page === data.totalPages - 1}
              className="p-3 rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Modal trả lời – GIỮ NGUYÊN */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">
                Trả lời phản hồi từ khách
              </h2>

              <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-bold">
                      {selected.hoTenKhach} - {selected.bienSo}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phiếu: {selected.maPSC}
                    </p>
                  </div>
                  {renderStars(selected.soSao)}
                </div>
                <p className="text-gray-700 italic">"{selected.noiDung}"</p>
              </div>

              <textarea
                rows="6"
                placeholder="Nhập phản hồi của garage..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-300 outline-none text-lg resize-none"
              />

              <div className="flex justify-center gap-8 mt-10">
                <button
                  onClick={() => {
                    setSelected(null);
                    setResponseText("");
                  }}
                  className="px-16 py-4 border-2 border-gray-400 rounded-2xl font-bold text-xl hover:bg-gray-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveResponse}
                  className="px-16 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition"
                >
                  Gửi phản hồi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
