import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, ShieldCheck, Sparkles, Star, Wrench } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const API = `/public/services`;

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${API}?page=0&size=8`);
      setServices(res.data?.content || []);
    } catch (err) {
      console.error("Lỗi tải dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-reveal>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-800">
              <Sparkles size={16} />
              Dịch vụ nổi bật
            </div>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Những hạng mục khách đặt nhiều nhất
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Từ bảo dưỡng định kỳ đến sửa chữa chuyên sâu, mọi dịch vụ được trình bày rõ giá để khách dễ chọn.
            </p>
          </div>

          <button
            onClick={() => navigate("/customer/services")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Xem tất cả
            <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center" data-reveal>
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
            <p className="mt-4 text-slate-600">Đang tải dịch vụ...</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 8).map((service, index) => (
              <button
                key={service.maDV}
                type="button"
                onClick={() => navigate(`/customer/services/${service.maDV}`)}
                className="home-service-card group overflow-hidden rounded-2xl bg-white text-left shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
                data-reveal
                style={{ transitionDelay: `${index * 55}ms` }}
              >
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-slate-950 p-5">
                  <div className="absolute inset-0 home-card-sheen opacity-70" />
                  <div className="relative z-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/30">
                      <Wrench size={30} />
                    </div>
                    <h3 className="line-clamp-2 text-xl font-black text-white">
                      {service.tenDV}
                    </h3>
                  </div>
                  <Star className="absolute right-4 top-4 fill-yellow-300 text-yellow-300" size={20} />
                </div>

                <div className="p-5">
                  <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Giá dịch vụ
                    </p>
                    <p className="mt-1 text-2xl font-black text-red-600">
                      {Number(service.giaTien).toLocaleString()}đ
                    </p>
                  </div>

                  <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
                    {service.moTa ||
                      "Dịch vụ chuyên nghiệp với quy trình kiểm tra rõ ràng và kỹ thuật viên nhiều kinh nghiệm."}
                  </p>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={15} className="text-yellow-600" />
                      Nhanh chóng
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck size={15} className="text-emerald-600" />
                      Uy tín
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
