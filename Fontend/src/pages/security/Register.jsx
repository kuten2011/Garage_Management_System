import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, MapPin, AlertCircle } from "lucide-react";

const API_REGISTER = "/web_garage/auth/register";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hoTen: "",
    sdt: "",
    email: "",
    diaChi: "",
    matKhau: "",
    confirmMatKhau: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hoTen.trim()) newErrors.hoTen = "Vui lòng nhập họ tên";
    if (!formData.sdt.trim()) newErrors.sdt = "Vui lòng nhập số điện thoại";
    else if (!/^0[3|5|7|8|9]\d{8}$/.test(formData.sdt))
      newErrors.sdt = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03,05,07,08,09)";

    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";

    if (!formData.matKhau) newErrors.matKhau = "Vui lòng nhập mật khẩu";
    else if (formData.matKhau.length < 6)
      newErrors.matKhau = "Mật khẩu phải ít nhất 6 ký tự";

    if (formData.matKhau !== formData.confirmMatKhau)
      newErrors.confirmMatKhau = "Mật khẩu xác nhận không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerMessage(null);

    try {
      const response = await fetch(API_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hoTen: formData.hoTen.trim(),
          sdt: formData.sdt,
          email: formData.email.toLowerCase(),
          diaChi: formData.diaChi.trim(),
          matKhau: formData.matKhau,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setServerMessage({
          type: "success",
          text: "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setServerMessage({
          type: "error",
          text: result.message || "Đăng ký thất bại. Vui lòng thử lại.",
        });
      }
    } catch (err) {
      setServerMessage({
        type: "error",
        text: "Lỗi kết nối server. Vui lòng kiểm tra lại mạng.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-900 text-3xl font-bold">
            G
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Đăng ký tài khoản</h1>
          <p className="text-gray-600">Tham gia cùng Garage Kuten để đặt lịch dễ dàng hơn</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Họ và tên
              </label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Nguyễn Văn A"
              />
              {errors.hoTen && <p className="text-red-500 text-xs mt-1">{errors.hoTen}</p>}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                Số điện thoại
              </label>
              <input
                type="tel"
                name="sdt"
                value={formData.sdt}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="0901234567"
              />
              {errors.sdt && <p className="text-red-500 text-xs mt-1">{errors.sdt}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="example@gmail.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Địa chỉ (tùy chọn) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Địa chỉ (tùy chọn)
              </label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />
                Mật khẩu
              </label>
              <input
                type="password"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              {errors.matKhau && <p className="text-red-500 text-xs mt-1">{errors.matKhau}</p>}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmMatKhau"
                value={formData.confirmMatKhau}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              {errors.confirmMatKhau && <p className="text-red-500 text-xs mt-1">{errors.confirmMatKhau}</p>}
            </div>

            {/* Thông báo server */}
            {serverMessage && (
              <div
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  serverMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <AlertCircle size={20} />
                <p className="font-medium">{serverMessage.text}</p>
              </div>
            )}

            {/* Nút submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>
          </form>

          {/* Đăng nhập */}
          <p className="text-center mt-8 text-gray-600">
            Đã có tài khoản?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-yellow-600 font-bold hover:text-yellow-700"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}