// src/customer/MyRepairs.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Car,
  Wrench,
  DollarSign,
  Star,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const BASE_API = "/customer";
const REPAIR_API = `${BASE_API}/repairs`;
const FEEDBACK_API = `${BASE_API}/feedbacks`;

export default function MyRepairs() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup chung: gửi mới hoặc xem lại
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isViewMode, setIsViewMode] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const maKH = userData.username || "";

  useEffect(() => {
    const fetchMyRepairs = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(REPAIR_API);
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.content)
            ? raw.content
            : [];
        setRepairs(list);
      } catch (err) {
        alert("Không thể tải phiếu sửa chữa của bạn!");
      } finally {
        setLoading(false);
      }
    };

    if (maKH) fetchMyRepairs();
  }, [maKH]);

  const handleSendFeedback = async () => {
    if (rating === 0) return alert("Vui lòng chọn số sao!");
    if (!feedbackText.trim()) return alert("Vui lòng nhập nội dung phản hồi!");

    try {
      await axiosInstance.post(`${FEEDBACK_API}/${selectedRepair.maPhieu}`, {
        noiDung: feedbackText,
        soSao: rating,
      });

      alert("Cảm ơn bạn đã đánh giá!");
      setShowPopup(false);
      setRating(0);
      setFeedbackText("");

      // Refresh để cập nhật ngay
      const res = await axiosInstance.get(REPAIR_API);
      const raw = res.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.content)
          ? raw.content
          : [];
      setRepairs(list);
    } catch (err) {
      alert("Gửi phản hồi thất bại!");
    }
  };

  const openPopup = (repair, viewMode = false) => {
    setSelectedRepair(repair);
    setIsViewMode(viewMode);

    if (viewMode) {
      setRating(repair.soSao || 0);
      setFeedbackText(repair.noiDungPhanHoi || "");
    } else {
      setRating(0);
      setFeedbackText("");
    }

    setShowPopup(true);
  };

  const renderStars = (soSao, size = 24) => {
    if (!soSao) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={
              i <= soSao ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vui lòng đăng nhập để xem phiếu sửa chữa
          </h2>
          <Link to="/login" className="text-indigo-600 underline text-xl">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Phiếu Sửa Chữa Của Bạn
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Theo dõi trạng thái và đánh giá dịch vụ
        </p>

        {loading ? (
          <div className="text-center py-20 text-2xl text-gray-500">
            Đang tải phiếu...
          </div>
        ) : repairs.length === 0 ? (
          <div className="text-center py-20 text-2xl text-gray-500">
            Bạn chưa có phiếu sửa chữa nào
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {repairs.map((r) => {
              const hasFeedback = r.daDanhGia;
              const trangThaiPhanHoi = r.phanHoiQL
                ? "Đã phản hồi"
                : "Chưa phản hồi";

              return (
                <div
                  key={r.maPhieu}
                  className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-indigo-700">
                      {r.maPhieu}
                    </h3>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        r.trangThai === "Hoàn thành"
                          ? "bg-green-100 text-green-800"
                          : r.trangThai === "Đang sửa"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {r.trangThai}
                    </span>
                  </div>

                  <div className="space-y-4 text-gray-700 mb-6">
                    <div className="flex items-center gap-3">
                      <Car size={22} className="text-purple-600" />
                      <span className="font-medium font-mono">
                        {r.xe?.bienSo || "Chưa có"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays size={22} className="text-indigo-600" />
                      <span>{r.ngayLap || "-"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign size={22} className="text-green-600" />
                      <span className="font-bold text-xl">
                        {r.tongTien?.toLocaleString() || 0} đ
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wrench size={22} className="text-gray-600" />
                      <span>{r.thanhToanStatus || "Chưa thanh toán"}</span>
                    </div>
                  </div>

                  {/* Phần đánh giá & phản hồi */}
                  <div className="mb-6">
                    {hasFeedback ? (
                      <button
                        onClick={() => openPopup(r, true)}
                        className={`w-full p-5 rounded-2xl text-left transition border-2 ${
                          trangThaiPhanHoi === "Đã phản hồi"
                            ? "bg-green-50 border-green-300 hover:bg-green-100"
                            : "bg-yellow-50 border-yellow-300 hover:bg-yellow-100"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {trangThaiPhanHoi === "Đã phản hồi" ? (
                            <CheckCircle size={26} className="text-green-600" />
                          ) : (
                            <AlertCircle
                              size={26}
                              className="text-yellow-600"
                            />
                          )}
                          <span
                            className={`font-bold text-lg ${
                              trangThaiPhanHoi === "Đã phản hồi"
                                ? "text-green-800"
                                : "text-yellow-800"
                            }`}
                          >
                            {trangThaiPhanHoi}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">Đánh giá:</span>
                          {renderStars(r.soSao, 26)}
                          <span className="font-bold text-lg ml-2">
                            {r.soSao}/5
                          </span>
                        </div>

                        {r.noiDungPhanHoi && (
                          <p className="text-gray-700 italic truncate mt-2">
                            "{r.noiDungPhanHoi}"
                          </p>
                        )}

                        {r.phanHoiQL && (
                          <p className="text-indigo-700 font-medium mt-3">
                            Garage đã trả lời → Click để xem
                          </p>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => openPopup(r, false)}
                        className="w-full bg-orange-50 border-2 border-orange-300 p-5 rounded-2xl text-center hover:bg-orange-100 transition"
                      >
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <AlertCircle size={26} className="text-orange-600" />
                          <span className="font-bold text-orange-800 text-lg">
                            Chưa đánh giá
                          </span>
                        </div>
                        <span className="text-orange-700 font-medium">
                          Gửi đánh giá & phản hồi ngay
                        </span>
                      </button>
                    )}
                  </div>

                  <Link
                    to={`/customer/repairParts/${r.maPhieu}`}
                    className="block text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
                  >
                    Xem chi tiết phiếu
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Popup chung */}
      {showPopup && selectedRepair && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-600">
                {isViewMode ? "Phản hồi của bạn" : "Gửi đánh giá & Phản hồi"}
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={28} />
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl mb-8">
              <p className="font-bold text-lg mb-2">
                Mã phiếu: {selectedRepair.maPhieu}
              </p>
              <p className="text-gray-600">
                <Car className="inline mr-2" size={18} />
                Ngày đánh giá: {selectedRepair.ngayGui || "-"}
              </p>
            </div>

            {isViewMode ? (
              <>
                <div className="mb-8 text-center">
                  <p className="text-xl font-semibold mb-6">Đánh giá của bạn</p>
                  <div className="flex justify-center gap-4 mb-4">
                    {renderStars(rating, 48)}
                  </div>
                  <p className="text-3xl font-bold text-yellow-500">
                    {rating}/5 sao
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 mb-6">
                  <p className="text-gray-700 italic text-lg">
                    "{feedbackText}"
                  </p>
                </div>

                {selectedRepair.phanHoiQL && (
                  <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-200">
                    <p className="font-bold text-indigo-800 mb-2 text-lg">
                      Phản hồi từ garage:
                    </p>
                    <p className="text-indigo-700 text-lg">
                      {selectedRepair.phanHoiQL}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-xl font-semibold text-center mb-6">
                    Bạn đánh giá dịch vụ này bao nhiêu sao?
                  </p>
                  <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        onClick={() => setRating(i)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={48}
                          className={`transition-all ${
                            i <= rating
                              ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-center mt-4 text-3xl font-bold text-yellow-500">
                      {rating}/5 sao
                    </p>
                  )}
                </div>

                <textarea
                  rows="6"
                  placeholder="Chia sẻ trải nghiệm của bạn (nhân viên, chất lượng sửa chữa, thời gian...)"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-300 outline-none text-lg resize-none mb-8"
                />

                <div className="flex justify-center gap-6">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-14 py-4 border-2 border-gray-400 rounded-2xl font-bold text-xl hover:bg-gray-100 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleSendFeedback}
                    disabled={rating === 0 || !feedbackText.trim()}
                    className="px-16 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Gửi phản hồi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
