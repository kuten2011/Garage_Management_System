import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Star, Clock, Sparkles } from "lucide-react";

const API = `http://${window.location.hostname}:8080/admin/services`;

export default function ServicesSection({ onViewAllServices }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}?page=0&size=8`);
      const result = await res.json();
      setServices(result.content || []);
    } catch (err) {
      console.error("Lỗi tải dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Dịch vụ nổi bật
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải dịch vụ...</p>
          </div>
        ) : (
          <>
            {/* Grid dịch vụ */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {services.slice(0, 8).map((service) => (
                <div
                  key={service.maDV}
                  onClick={() => navigate("/services")}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
                >
                  {/* Card Header */}
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 opacity-10 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative text-center z-10 p-4">
                      <div className="flex justify-center mb-3">
                        <Wrench className="text-yellow-400" size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-white line-clamp-2">
                        {service.tenDV}
                      </h3>
                    </div>

                    <Star
                      size={20}
                      className="absolute top-3 right-3 text-yellow-400 fill-yellow-400"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Giá tiền */}
                    <div className="mb-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">
                          Giá dịch vụ
                        </p>
                        <p className="text-2xl font-black text-red-600">
                          {Number(service.giaTien).toLocaleString()}đ
                        </p>
                      </div>
                    </div>

                    {/* Mô tả */}
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {service.moTa ||
                          "Dịch vụ chuyên nghiệp, đảm bảo chất lượng cao với đội ngũ kỹ thuật viên giàu kinh nghiệm."}
                      </p>
                    </div>

                    {/* Tính năng */}
                    <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={16} className="text-yellow-600" />
                        <span>Nhanh chóng</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-600" />
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

            {/* Nút xem tất cả */}
            <div className="text-center">
              <button
                onClick={() => {
                  navigate("/services");
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg inline-flex items-center gap-2"
              >
                Xem tất cả dịch vụ
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
