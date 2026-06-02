import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Package, ShieldCheck, Star } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const API = `/public/parts`;
const DEFAULT_PART_IMAGE = "https://placehold.net/400x400.png";

export default function PartsSection() {
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
      setParts(res.data?.content || []);
    } catch (err) {
      console.error("Lỗi tải phụ tùng:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (soLuongTon) => {
    if (soLuongTon <= 0) {
      return { text: "Hết hàng", className: "bg-red-500 text-white" };
    }
    return { text: "Còn hàng", className: "bg-emerald-500 text-white" };
  };

  return (
    <section id="parts" className="relative overflow-hidden bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-reveal>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
              <Package size={16} />
              Phụ tùng nổi bật
            </div>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Linh kiện chính hãng, dễ kiểm tra tồn kho
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Danh sách phụ tùng được hiển thị trực quan với giá, tình trạng tồn và hình ảnh sản phẩm.
            </p>
          </div>

          <button
            onClick={() => navigate("/customer/parts")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-yellow-500/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
          >
            Xem phụ tùng
            <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center" data-reveal>
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
            <p className="mt-4 text-slate-600">Đang tải phụ tùng...</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {parts.slice(0, 8).map((part, index) => {
              const stockStatus = getStockStatus(part.soLuongTon);
              return (
                <button
                  key={part.maPT}
                  type="button"
                  onClick={() => navigate(`/customer/parts/${part.maPT}`)}
                  className="home-part-card group overflow-hidden rounded-2xl bg-white text-left shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
                  data-reveal
                  style={{ transitionDelay: `${index * 55}ms` }}
                >
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    <img
                      src={part.hinhAnh || DEFAULT_PART_IMAGE}
                      alt={part.tenPT}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_PART_IMAGE;
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-black shadow-lg ${stockStatus.className}`}>
                      {stockStatus.text}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-3 line-clamp-2 min-h-[3rem] text-lg font-black text-slate-900">
                      {part.tenPT}
                    </h3>

                    <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Giá phụ tùng
                      </p>
                      <p className="mt-1 text-2xl font-black text-red-600">
                        {Number(part.donGia).toLocaleString()}đ
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={15} className="text-yellow-600" />
                        Giao nhanh
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck size={15} className="text-emerald-600" />
                        Chính hãng
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
