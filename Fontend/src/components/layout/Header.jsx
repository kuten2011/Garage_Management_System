import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  Wrench,
  Home,
  Car,
  Package,
  Info,
  PhoneCall,
  ClipboardList,
  User,
  Edit3,
  Lock,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ isScrolled }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: "",
    sdt: "",
    email: "",
    diaChi: "",
    matKhauCu: "",
    matKhauMoi: "",
    xacNhanMatKhau: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const rawUserData = localStorage.getItem("user");
  const userData = rawUserData ? JSON.parse(rawUserData) : {};
  const maTaiKhoan = userData.maKH || userData.maNV || userData.username || "";
  const isLoggedIn = !!token && !!maTaiKhoan;

  let isStaff = false;
  if (isLoggedIn && userData.authorities) {
    try {
      const authorities = userData.authorities || [];
      const roles = authorities.map((auth) =>
        typeof auth === "string" ? auth : auth.authority
      );
      isStaff = roles.some((role) => role !== "ROLE_CUSTOMER");
    } catch (e) {
      console.error("Lỗi parse authorities:", e);
    }
  }

  useEffect(() => {
    if (showAccountPopup && isLoggedIn && maTaiKhoan) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const apiUrl = isStaff
            ? `/admin/employees/api/${maTaiKhoan}`
            : `/api/customers/api/${maTaiKhoan}`;

          const response = await axiosInstance.get(apiUrl);
          const data = response.data;

          setFormData((prev) => ({
            ...prev,
            hoTen: data.hoTen || "",
            sdt: data.sdt || "",
            email: data.email || "",
            diaChi: data.diaChi || "",
            matKhauCu: "",
            matKhauMoi: "",
            xacNhanMatKhau: "",
          }));
        } catch (err) {
          console.error("Lỗi lấy thông tin:", err);
          alert("Không thể tải thông tin tài khoản. Vui lòng thử lại.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [showAccountPopup, isLoggedIn, maTaiKhoan, isStaff]);

  const menuItems = [
    { label: "Trang chủ", route: "/", icon: <Home size={18} /> },
    { label: "Dịch vụ", route: "/services", icon: <Car size={18} /> },
    { label: "Sản phẩm", route: "/parts", icon: <Package size={18} /> },
    { label: "Giới thiệu", route: "/#about", icon: <Info size={18} /> },
    { label: "Liên hệ", route: "/#contact", icon: <PhoneCall size={18} /> },
  ];

  let finalMenuItems = isLoggedIn
    ? [
        ...menuItems,
        { label: "Phiếu Sửa Chữa", route: "/my-repairs", icon: <ClipboardList size={18} /> },
      ]
    : menuItems;

  if (isStaff) {
    finalMenuItems.unshift({ label: "Quản trị", route: "/admin", icon: <Wrench size={18} /> });
  }

  const isActive = (itemRoute) => {
    if (itemRoute.includes("#")) {
      const [path, hash] = itemRoute.split("#");
      return location.pathname === path && location.hash === `#${hash}`;
    }
    return location.pathname === itemRoute;
  };

  const handleNavClick = (item) => {
    navigate(item.route);
    setIsMenuOpen(false);
  };

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
    } else {
      navigate("/login");
    }
  };

  const handleSaveAccount = async () => {
    if (processing || loading) return;
    setProcessing(true);

    try {
      if (formData.matKhauMoi || formData.xacNhanMatKhau) {
        if (!formData.matKhauCu) {
          alert("Vui lòng nhập mật khẩu cũ để đổi mật khẩu!");
          setProcessing(false);
          return;
        }
        if (formData.matKhauMoi !== formData.xacNhanMatKhau) {
          alert("Mật khẩu mới và xác nhận không khớp!");
          setProcessing(false);
          return;
        }
        if (formData.matKhauMoi.length < 6) {
          alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
          setProcessing(false);
          return;
        }
      }

      const payload = {
        hoTen: formData.hoTen.trim() || null,
        sdt: formData.sdt.trim() || null,
        email: formData.email.trim() || null,
        diaChi: formData.diaChi.trim() || null,
      };

      if (formData.matKhauMoi) {
        payload.matKhau = formData.matKhauMoi;
        payload.matKhauCu = formData.matKhauCu;
      }

      const apiUrl = isStaff
        ? `/admin/employees/api/${maTaiKhoan}`
        : `/api/customers/api/${maTaiKhoan}`;

      await axiosInstance.patch(apiUrl, payload);

      const updatedUser = {
        ...userData,
        hoTen: payload.hoTen || userData.hoTen,
        sdt: payload.sdt || userData.sdt,
        email: payload.email || userData.email,
        diaChi: payload.diaChi || userData.diaChi,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Cập nhật thông tin thành công!");
      setShowAccountPopup(false);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      const msg = err.response?.data?.message || err.message || "Lỗi không xác định";
      alert("Cập nhật thất bại: " + msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-gray-900 text-white transition-all ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl">
              G
            </div>
            <span className="text-xl md:text-2xl font-bold text-yellow-400">
              Web Garage
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {finalMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`hover:text-yellow-400 transition font-medium flex items-center gap-2 ${
                  isActive(item.route) ? "text-yellow-400" : ""
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            {isLoggedIn && (
              <button
                onClick={() => setShowAccountPopup(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-full font-bold hover:bg-yellow-500 transition"
              >
                <User size={18} />
                {maTaiKhoan}
              </button>
            )}

            <button
              onClick={handleAuth}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-full font-bold hover:bg-yellow-500 transition"
            >
              {isLoggedIn ? (
                <>
                  <LogOut size={18} />
                  Đăng xuất
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Đăng nhập
                </>
              )}
            </button>
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {finalMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`block w-full text-left py-3 hover:text-yellow-400 font-medium flex items-center gap-3 ${
                  isActive(item.route) ? "text-yellow-400" : ""
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            {isLoggedIn && (
              <button
                onClick={() => {
                  setShowAccountPopup(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-3 hover:text-yellow-400 font-medium flex items-center gap-3"
              >
                <User size={20} />
                {maTaiKhoan} (Thông tin tài khoản)
              </button>
            )}

            <button
              onClick={handleAuth}
              className="block w-full text-left py-3 flex items-center gap-3 hover:text-yellow-400 font-medium"
            >
              {isLoggedIn ? (
                <>
                  <LogOut size={20} />
                  Đăng xuất
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Đăng nhập
                </>
              )}
            </button>
          </nav>
        )}
      </div>

      {/* POPUP */}
      {showAccountPopup && isLoggedIn && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-800">
            {/* Header sticky */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Edit3 size={32} className="text-indigo-600" />
                <h2 className="text-3xl font-bold text-indigo-700">
                  Chỉnh sửa thông tin tài khoản
                </h2>
              </div>
              <button
                onClick={() => setShowAccountPopup(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={28} />
              </button>
            </div>

            {/* Nội dung scrollable */}
            <div className="p-8">
              {loading ? (
                <div className="text-center py-10 text-lg font-medium text-gray-700">
                  Đang tải thông tin...
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Họ và tên</label>
                    <input
                      type="text"
                      value={formData.hoTen}
                      onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg text-gray-800 placeholder-gray-400"
                      placeholder="Nhập họ tên"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Số điện thoại</label>
                    <input
                      type="text"
                      value={formData.sdt}
                      onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg text-gray-800 placeholder-gray-400"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg text-gray-800 placeholder-gray-400"
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Địa chỉ</label>
                    <input
                      type="text"
                      value={formData.diaChi}
                      onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg text-gray-800 placeholder-gray-400"
                      placeholder="Nhập địa chỉ"
                    />
                  </div>

                  {/* Đổi mật khẩu */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock size={20} className="text-indigo-600" />
                      <h3 className="text-xl font-semibold text-indigo-700">Đổi mật khẩu</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-lg font-medium mb-2 text-gray-700">Mật khẩu cũ</label>
                        <input
                          type="password"
                          value={formData.matKhauCu}
                          onChange={(e) => setFormData({ ...formData, matKhauCu: e.target.value })}
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg text-gray-800 placeholder-gray-400"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-medium mb-2 text-gray-700">Mật khẩu mới</label>
                        <input
                          type="password"
                          value={formData.matKhauMoi}
                          onChange={(e) => setFormData({ ...formData, matKhauMoi: e.target.value })}
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg text-gray-800 placeholder-gray-400"
                          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-medium mb-2 text-gray-700">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          value={formData.xacNhanMatKhau}
                          onChange={(e) => setFormData({ ...formData, xacNhanMatKhau: e.target.value })}
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg text-gray-800 placeholder-gray-400"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer sticky */}
            <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 flex justify-center gap-6">
              <button
                onClick={() => setShowAccountPopup(false)}
                disabled={processing || loading}
                className="px-12 py-4 border-4 border-gray-400 rounded-2xl font-bold text-xl text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveAccount}
                disabled={processing || loading}
                className="px-16 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition disabled:opacity-50"
              >
                {processing ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}