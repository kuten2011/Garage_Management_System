import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Clock,
  Star,
  ArrowLeft,
  X,
} from "lucide-react";

const API = "/admin/services";
const PAGE_SIZE = 8;

export default function ServicesPage({ onBack }) {
  const [data, setData] = useState({ content: [], totalPages: 1 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [priceFromInput, setPriceFromInput] = useState("");
  const [priceToInput, setPriceToInput] = useState("");

  const [search, setSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: PAGE_SIZE });
      if (search.trim()) params.append("search", search.trim());
      if (priceFrom) params.append("priceFrom", priceFrom);
      if (priceTo) params.append("priceTo", priceTo);

      const res = await fetch(`${API}?${params}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, priceFrom, priceTo]);

  const resetFilters = () => {
    setSearchInput("");
    setPriceFromInput("");
    setPriceToInput("");
    setSearch("");
    setPriceFrom("");
    setPriceTo("");
    setPage(0);
  };

  // Quick price filters
  const priceRanges = [
    { label: "Dưới 100k", max: 100000 },
    { label: "100k - 500k", min: 100000, max: 500000 },
    { label: "500k - 1tr", min: 500000, max: 1000000 },
    { label: "Trên 1tr", min: 1000000 },
  ];

  const applyPriceRange = (range) => {
    setPriceFromInput(range.min?.toString() || "");
    setPriceToInput(range.max?.toString() || "");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Quay lại trang chủ</span>
          </button>

          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">TẤT CẢ DỊCH VỤ</h1>
            <p className="text-xl opacity-90">
              Khám phá đầy đủ các dịch vụ chuyên nghiệp của chúng tôi
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Bộ lọc */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <Search size={28} className="text-yellow-600" />
            Tìm kiếm dịch vụ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tìm kiếm theo keyword */}
            <div className="relative">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tên dịch vụ..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"
                />
              </div>
            </div>

            {/* Lọc giá */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-semibold">Giá:</span>
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

              {/* Quick price filters */}
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

          {/* Nút xóa lọc */}
          {(searchInput || priceFromInput || priceToInput) && (
            <div className="text-center mt-6">
              <button
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800 font-semibold text-base underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Grid Cards */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-xl text-gray-600">Đang tải dịch vụ...</p>
          </div>
        ) : data.content.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl text-gray-400 font-bold mb-2">
              Không tìm thấy dịch vụ nào
            </p>
            {search && (
              <p className="text-gray-500">
                Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.content.map((service) => (
                <div
                  key={service.maDV}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Card Header */}
                  <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 opacity-10 rounded-full -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-yellow-400 opacity-10 rounded-full -ml-10 -mb-10"></div>

                    <div className="relative text-center z-10 p-4">
                      <div className="flex justify-center mb-2">
                        <Wrench className="text-yellow-400" size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-white line-clamp-2">
                        {service.tenDV}
                      </h3>
                    </div>

                    <Star
                      size={18}
                      className="absolute top-3 right-3 text-yellow-400 fill-yellow-400"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {/* Giá tiền */}
                    <div className="mb-4 bg-yellow-50 p-3 rounded-lg border-2 border-yellow-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">
                          Giá dịch vụ
                        </p>
                        <p className="text-xl font-black text-red-600">
                          {Number(service.giaTien).toLocaleString()}đ
                        </p>
                      </div>
                    </div>

                    {/* Mô tả */}
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {service.moTa ||
                          "Dịch vụ chuyên nghiệp, đảm bảo chất lượng cao"}
                      </p>
                    </div>

                    {/* Tính năng */}
                    <div className="flex items-center justify-center gap-3 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-yellow-600" />
                        <span>Nhanh</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-600" />
                        <span>Uy tín</span>
                      </div>
                    </div>

                    {/* Button */}
                    <a href="tel:0944799819">
                      <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                        Đặt dịch vụ ngay
                      </button>
                    </a>
                  </div>
                </div>
              ))}
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
