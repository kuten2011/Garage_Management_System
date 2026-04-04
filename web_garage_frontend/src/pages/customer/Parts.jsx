import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  Star,
  ArrowLeft,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "/admin/parts";
const DEFAULT_IMAGE = "https://placehold.net/400x400.png";
const PAGE_SIZE = 8;

export default function PartsPage() {
  const [data, setData] = useState({ content: [], totalPages: 1 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Input states (cho debounce)
  const [searchInput, setSearchInput] = useState("");
  const [priceFromInput, setPriceFromInput] = useState("");
  const [priceToInput, setPriceToInput] = useState("");
  const [stockFromInput, setStockFromInput] = useState("");
  const [stockToInput, setStockToInput] = useState("");

  // Filter states (giá trị thực tế dùng cho API)
  const [search, setSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [stockFrom, setStockFrom] = useState("");
  const [stockTo, setStockTo] = useState("");

  const navigate = useNavigate();

  // Debounce cho search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce cho price filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setPriceFrom(priceFromInput);
      setPriceTo(priceToInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [priceFromInput, priceToInput]);

  // Debounce cho stock filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setStockFrom(stockFromInput);
      setStockTo(stockToInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [stockFromInput, stockToInput]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: PAGE_SIZE });
      if (search.trim()) params.append("search", search.trim());
      if (priceFrom) params.append("priceFrom", priceFrom);
      if (priceTo) params.append("priceTo", priceTo);
      if (stockFrom) params.append("stockFrom", stockFrom);
      if (stockTo) params.append("stockTo", stockTo);

      const res = await fetch(`${API}?${params}`);
      const result = await res.json();
      console.log("API Response:", result); // Debug
      setData(result);
    } catch (err) {
      console.error("Lỗi tải phụ tùng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, priceFrom, priceTo, stockFrom, stockTo]);

  const resetFilters = () => {
    setSearchInput("");
    setPriceFromInput("");
    setPriceToInput("");
    setStockFromInput("");
    setStockToInput("");
    setSearch("");
    setPriceFrom("");
    setPriceTo("");
    setStockFrom("");
    setStockTo("");
    setPage(0);
  };

  const priceRanges = [
    { label: "Dưới 500k", max: 500000 },
    { label: "500k - 1tr", min: 500000, max: 1000000 },
    { label: "1tr - 3tr", min: 1000000, max: 3000000 },
    { label: "Trên 3tr", min: 3000000 },
  ];

  const stockRanges = [
    { label: "Hết hàng", max: 0 },
    { label: "Còn hàng", min: 1 },
  ];

  const applyPriceRange = (range) => {
    setPriceFromInput(range.min?.toString() || "");
    setPriceToInput(range.max?.toString() || "");
  };

  const applyStockRange = (range) => {
    setStockFromInput(range.min?.toString() || "");
    setStockToInput(range.max?.toString() || "");
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

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Quay lại trang chủ</span>
          </button>

          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">TẤT CẢ PHỤ TÙNG</h1>
            <p className="text-xl opacity-90">
              Khám phá đầy đủ phụ tùng chính hãng, chất lượng cao
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Bộ lọc */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <Filter size={28} className="text-yellow-600" />
            Tìm kiếm và lọc phụ tùng
          </h3>

          <div className="space-y-6">
            {/* Tìm kiếm theo keyword */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên phụ tùng
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm phụ tùng..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"
                />
              </div>
            </div>

            {/* Lọc giá */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Khoảng giá
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Từ (VNĐ)"
                    value={priceFromInput}
                    onChange={(e) => setPriceFromInput(e.target.value)}
                    className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  />
                  <span className="text-lg font-bold text-gray-600">—</span>
                  <input
                    type="number"
                    placeholder="Đến (VNĐ)"
                    value={priceToInput}
                    onChange={(e) => setPriceToInput(e.target.value)}
                    className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPriceRange(range)}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 text-gray-800 font-medium rounded-lg transition-all border border-yellow-300 hover:border-yellow-400 hover:shadow-md"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lọc tồn kho */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số lượng tồn kho
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={stockFromInput}
                    onChange={(e) => setStockFromInput(e.target.value)}
                    className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  />
                  <span className="text-lg font-bold text-gray-600">—</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={stockToInput}
                    onChange={(e) => setStockToInput(e.target.value)}
                    className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {stockRanges.map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyStockRange(range)}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-gray-800 font-medium rounded-lg transition-all border border-blue-300 hover:border-blue-400 hover:shadow-md"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nút xóa lọc */}
          {(searchInput ||
            priceFromInput ||
            priceToInput ||
            stockFromInput ||
            stockToInput) && (
            <div className="text-center mt-6">
              <button
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800 font-semibold text-base underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Grid Cards */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-xl text-gray-600">Đang tải phụ tùng...</p>
          </div>
        ) : data.content.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl text-gray-400 font-bold mb-2">
              Không tìm thấy phụ tùng nào
            </p>
            <p className="text-gray-500">
              Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.content.map((part) => {
                const stockStatus = getStockStatus(part.soLuongTon);
                return (
                  <div
                    key={part.maPT}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* Card Header */}
                    <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={part.hinhAnh || DEFAULT_IMAGE}
                        alt={part.tenPT}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />

                      {/* Badge trạng thái */}
                      <div
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                          getStockStatus(part.soLuongTon).text === "Còn hàng"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {getStockStatus(part.soLuongTon).text}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      {/* Giá tiền */}
                      <div className="mb-3 bg-yellow-50 p-3 rounded-lg border-2 border-yellow-200">
                        <div className="text-center">
                          <p className="text-xs text-gray-600 mb-1">
                            Giá phụ tùng
                          </p>
                          <p className="text-xl font-black text-red-600">
                            {Number(part.donGia).toLocaleString()}đ
                          </p>
                        </div>
                      </div>

                      {/* Tính năng */}
                      <div className="flex items-center justify-center gap-3 mb-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-yellow-600" />
                          <span>Giao nhanh</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-600" />
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

            {/* Phân trang */}
            {data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12 pb-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-3 rounded-full bg-white shadow-lg disabled:opacity-40 hover:bg-yellow-50 transition"
                >
                  <ChevronLeft size={24} />
                </button>

                {[...Array(data.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-12 h-12 rounded-full font-bold text-base transition-all duration-300 ${
                      page === i
                        ? "bg-yellow-400 text-gray-900 shadow-xl scale-110"
                        : "bg-white shadow-lg hover:bg-gray-50"
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
                  className="p-3 rounded-full bg-white shadow-lg disabled:opacity-40 hover:bg-yellow-50 transition"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
