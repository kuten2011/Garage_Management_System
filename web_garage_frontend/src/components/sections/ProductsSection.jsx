import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Star, Clock } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const API = `/admin/parts`;
const DEFAULT_PART_IMAGE = "https://placehold.net/400x400.png";

export default function PartsSection({ onViewAllParts }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${API}?page=0&size=8`);
      const result = res.data;
      setParts(result.content || []);
    } catch (err) {
      console.error("Lỗi tải phụ tùng:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (soLuongTon) => {
    if (soLuongTon <= 0)
      return {
        text: "Hết hàng",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    return {
      text: "Còn hàng",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  };

  const handleNavigate = () => {
    navigate("/parts");
  };

  return (
    <section id="parts" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Phụ tùng nổi bật
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải phụ tùng...</p>
          </div>
        ) : (
          <>
            {/* Grid phụ tùng */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {parts.slice(0, 8).map((part) => {
                const stockStatus = getStockStatus(part.soLuongTon);
                return (
                  <div
                    key={part.maPT}
                    onClick={handleNavigate}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Card Header */}
                    <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={part.hinhAnh || DEFAULT_PART_IMAGE}
                        alt={part.tenPT}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_PART_IMAGE;
                        }}
                      />

                      {/* Badge trạng thái */}
                      <div
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                          stockStatus.text === "Còn hàng"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {stockStatus.text}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Giá tiền */}
                      <div className="mb-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">
                            Giá phụ tùng
                          </p>
                          <p className="text-2xl font-black text-red-600">
                            {Number(part.donGia).toLocaleString()}đ
                          </p>
                        </div>
                      </div>

                      {/* Tính năng */}
                      <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={16} className="text-yellow-600" />
                          <span>Giao nhanh</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-600" />
                          <span>Chính hãng</span>
                        </div>
                      </div>

                      {/* Button */}
                      <a
                        href={
                          part.soLuongTon === 0 ? undefined : "tel:0944799819"
                        }
                        className={
                          part.soLuongTon === 0 ? "pointer-events-none" : ""
                        }
                      >
                        <button
                          className={`w-full font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                            part.soLuongTon === 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                          }`}
                          disabled={part.soLuongTon === 0}
                        >
                          {part.soLuongTon === 0 ? "Hết hàng" : "Đặt mua ngay"}
                        </button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nút xem tất cả */}
            <div className="text-center">
              <button
                onClick={handleNavigate}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg inline-flex items-center gap-2"
              >
                Xem tất cả phụ tùng
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
