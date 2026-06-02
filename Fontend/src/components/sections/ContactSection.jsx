import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Clock, Lock, MessageSquareText } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const API_BASE = `/customer`;

export default function ContactSection() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const isLoggedIn = !!token || !!refreshToken;
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const maKH = userData.username || "";

  const [formData, setFormData] = useState({
    ngayHen: "",
    gioHen: "",
    ghiChu: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setMessage("Vui lòng đăng nhập để đặt lịch hẹn!");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!maKH) {
      setMessage("Không thể lấy thông tin khách hàng. Vui lòng đăng nhập lại!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axiosInstance.post(`${API_BASE}/bookings`, {
        maKH,
        ngayHen: formData.ngayHen,
        gioHen: formData.gioHen,
        ghiChu: formData.ghiChu.trim() || null,
        trangThai: "Chờ xác nhận",
      });

      setMessage("Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ xác nhận sớm nhất.");
      setFormData({ ngayHen: "", gioHen: "", ghiChu: "" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Đặt lịch thất bại!";
      setMessage("Lỗi: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1613214150384-0b9974f7f7a3?w=1800&h=1000&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="flex flex-col justify-center" data-reveal>
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-sm font-black text-slate-950">
            <CalendarCheck size={16} />
            Đặt lịch trực tuyến
          </div>
          <h2 className="text-3xl font-black sm:text-5xl">
            Chọn thời gian, gửi yêu cầu, garage xác nhận lại.
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-slate-300">
            Form đặt lịch được tối ưu để khách thao tác nhanh trên điện thoại.
            Sau khi gửi, lịch hẹn sẽ được lưu vào hệ thống để dễ theo dõi.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <Clock className="mb-3 text-yellow-300" size={24} />
              <p className="font-bold">Giờ làm việc</p>
              <p className="mt-1 text-sm text-slate-300">08:00 - 17:00 hằng ngày</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <MessageSquareText className="mb-3 text-emerald-300" size={24} />
              <p className="font-bold">Xác nhận nhanh</p>
              <p className="mt-1 text-sm text-slate-300">Garage liên hệ lại sau khi nhận lịch</p>
            </div>
          </div>
        </div>

        <div data-reveal>
          {!isLoggedIn ? (
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center shadow-2xl backdrop-blur sm:p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-black">Yêu cầu đăng nhập</h3>
              <p className="mx-auto mt-4 max-w-md text-slate-300">
                Bạn cần đăng nhập tài khoản khách hàng để đặt lịch và theo dõi trạng thái sửa chữa.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-7 rounded-xl bg-yellow-400 px-6 py-3 font-black text-slate-950 shadow-lg shadow-yellow-500/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                Đăng nhập ngay
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur sm:p-8"
            >
              <div className="mb-6 rounded-2xl bg-slate-950/60 p-4 text-center">
                <p className="text-sm text-slate-400">Đang đặt lịch cho khách hàng</p>
                <p className="mt-1 text-2xl font-black text-yellow-300">{maKH}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">Ngày hẹn *</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.ngayHen}
                    onChange={(e) => setFormData({ ...formData, ngayHen: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-5 py-4 text-white outline-none transition focus:border-yellow-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">Giờ hẹn *</label>
                  <input
                    type="time"
                    min="08:00"
                    max="17:00"
                    value={formData.gioHen}
                    onChange={(e) => setFormData({ ...formData, gioHen: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-5 py-4 text-white outline-none transition focus:border-yellow-300"
                    required
                  />
                  <p className="mt-1 text-xs text-slate-400">Giờ làm việc: 08:00 - 17:00</p>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold">Mô tả vấn đề</label>
                  <textarea
                    rows="4"
                    placeholder="Ví dụ: xe phát tiếng lạ, đèn báo lỗi, cần kiểm tra phanh..."
                    value={formData.ghiChu}
                    onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-yellow-300"
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`mt-5 rounded-xl p-4 text-center font-bold ${
                    message.includes("thành công")
                      ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                      : "border border-red-500/40 bg-red-500/15 text-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 shadow-lg shadow-yellow-500/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang gửi yêu cầu..." : "Gửi đặt lịch"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
