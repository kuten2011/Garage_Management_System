// src/security/AdminLogin.jsx (đã chỉnh sửa hoàn chỉnh)
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Thêm Link để tạo link đúng cách
import { LogIn, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@gara.com"); // Để test admin
  // const [email, setEmail] = useState(""); // Nếu muốn để trống
  const [password, setPassword] = useState("123456");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "/web_garage/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Lưu token và thông tin user
      localStorage.setItem("token", res.data.jwt);
      localStorage.setItem("user", JSON.stringify(res.data));

      console.log("Đăng nhập thành công! Token:", res.data.jwt);
      console.log("Authorities:", res.data.authorities);

      // Lấy roles từ authorities
      const authorities = res.data.authorities || [];
      const roles = authorities.map((auth) => (typeof auth === "string" ? auth : auth.authority));

      // Nếu là khách hàng → về trang chủ
      if (roles.includes("ROLE_CUSTOMER")) {
        navigate("/", { replace: true });
        return;
      }

      // Các role staff (admin, manager, employee...) → vào dashboard admin
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      if (err.response?.status === 401) {
        setError("Sai email hoặc mật khẩu!");
      } else if (err.response?.status === 403) {
        setError("Tài khoản bị khóa hoặc không có quyền truy cập!");
      } else {
        setError("Lỗi kết nối server. Vui lòng thử lại sau!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-900 text-3xl font-bold">
            G
          </div>
          <h2 className="text-3xl font-bold text-gray-800">ĐĂNG NHẬP HỆ THỐNG</h2>
          <p className="text-gray-600 mt-2">Garage Ô Tô Kuten</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-yellow-400 transition text-base"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-yellow-400 transition text-base"
              required
              disabled={loading}
            />
          </div>

          {/* Thông báo lỗi */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Nút đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg
              ${loading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 text-gray-900 hover:shadow-xl transform hover:-translate-y-1"
              }`}
          >
            <LogIn size={24} />
            {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        {/* Link đăng ký */}
        <p className="text-center mt-8 text-gray-600">
          Chưa có tài khoản khách hàng?{" "}
          <Link to="/register" className="text-yellow-600 font-bold hover:text-yellow-700 hover:underline">
            Đăng ký ngay
          </Link>
        </p>

        {/* Quay lại trang chủ */}
        <p className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700 underline"
          >
            ← Quay lại trang chủ
          </button>
        </p>
      </div>
    </div>
  );
}