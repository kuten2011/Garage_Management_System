import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance"; 

const API_BASE = `http://${window.location.hostname}:8080/customer`;

export default function ContactSection() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const maKH = userData.username || ""; 
  console.log("Mã khách hàng từ localStorage:", maKH);
  console.log("Mã khách hàng từ localStorage:", userData);

  const [formData, setFormData] = useState({
    ngayHen: '',
    gioHen: '',
    ghiChu: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    setMessage('');

    try {
      const payload = {
        maKH: maKH, 
        ngayHen: formData.ngayHen,
        gioHen: formData.gioHen,
        ghiChu: formData.ghiChu.trim() || null,
        trangThai: "Chờ xác nhận"
      };

      await axiosInstance.post(`${API_BASE}/bookings`, payload);

      setMessage("Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ xác nhận sớm nhất.");
      setFormData({ngayHen: '', gioHen: '', ghiChu: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Đặt lịch thất bại!";
      setMessage("Lỗi: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-yellow-400">
          Đặt Lịch Hẹn Sửa Chữa
        </h2>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Vui lòng chọn ngày giờ phù hợp. Chúng tôi sẽ liên hệ xác nhận sớm nhất!
        </p>
        <div className="w-32 h-1 bg-yellow-400 mx-auto mb-12"></div>

        <div className="max-w-2xl mx-auto">
          {!isLoggedIn ? (
            <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl text-center">
              <div className="text-6xl mb-6">🔒</div>
              <h3 className="text-2xl font-bold mb-4">Yêu cầu đăng nhập</h3>
              <p className="text-gray-300 mb-8">
                Bạn cần đăng nhập tài khoản khách hàng để đặt lịch và theo dõi trạng thái sửa chữa.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="bg-yellow-400 text-gray-900 font-bold py-4 px-10 rounded-xl hover:bg-yellow-500 transition transform hover:scale-105 shadow-lg"
              >
                ĐĂNG NHẬP NGAY
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl">
              <div className="mb-8 text-center">
                <p className="text-sm text-gray-400">Đang đặt lịch cho khách hàng:</p>
                <p className="text-2xl font-bold text-yellow-400">{maKH}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày hẹn *</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.ngayHen}
                      onChange={(e) => setFormData({...formData, ngayHen: e.target.value})}
                      className="w-full px-5 py-4 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-yellow-400 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Giờ hẹn *</label>
                    <input
                      type="time"
                      min="08:00"
                      max="17:00"
                      value={formData.gioHen}
                      onChange={(e) => setFormData({...formData, gioHen: e.target.value})}
                      className="w-full px-5 py-4 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-yellow-400 focus:outline-none transition"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Giờ làm việc: 8:00 - 17:00</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mô tả vấn đề</label>
                    <textarea
                      rows="4"
                      placeholder="Mô tả chi tiết để chúng tôi chuẩn bị tốt hơn (lỗi lạ, tiếng động, đèn báo...)"
                      value={formData.ghiChu}
                      onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                      className="w-full px-5 py-4 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-yellow-400 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg text-center font-medium ${
                    message.includes("thành công")
                      ? "bg-green-900/50 text-green-300 border border-green-600"
                      : "bg-red-900/50 text-red-300 border border-red-600"
                  }`}>
                    {message}
                  </div>
                )}

                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-14 py-5 rounded-xl font-bold text-xl shadow-lg transition transform hover:scale-105 ${
                      loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600"
                    }`}
                  >
                    {loading ? "Đang gửi yêu cầu..." : "GỬI ĐẶT LỊCH"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}