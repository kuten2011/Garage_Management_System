import { Calendar, Wrench, Package, Mail, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Ngưỡng cảnh báo phụ tùng sắp hết - người dùng có thể thay đổi ngay trên giao diện
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  // Thống kê động
  const [stats, setStats] = useState({
    todayBookings: 0,
    ongoingRepairs: 0,
    lowStockParts: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Lấy thống kê từ backend
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0];

        const [bookingsRes, repairsRes, partsRes] = await Promise.all([
          // Lịch hẹn hôm nay
          axiosInstance.get("/admin/bookings", {
            params: { dateFrom: today, dateTo: today, size: 1 },
          }),
          // Chỉ lấy phiếu "Đang sửa" (không tính "Hoàn thành" hay trạng thái khác)
          axiosInstance.get("/admin/repairs", {
            params: { trangThai: "Đang sửa", size: 1 },
          }),
          // Phụ tùng sắp hết
          axiosInstance.get("/admin/parts", {
            params: { stockUnder: lowStockThreshold, size: 1 },
          }),
        ]);

        setStats({
          todayBookings: bookingsRes.data.totalElements || 0,
          ongoingRepairs: repairsRes.data.totalElements || 0,
          lowStockParts: partsRes.data.totalElements || 0,
        });
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
        setMessage("❌ Lỗi tải dữ liệu thống kê: " + (error.response?.data?.message || error.message));
        setStats({ todayBookings: 0, ongoingRepairs: 0, lowStockParts: 0 });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [lowStockThreshold]); // Tự động reload khi thay đổi ngưỡng

  const handleManualSend = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axiosInstance.post("/admin/customer-care/run-manually");
      setMessage("✅ " + (response.data.message || "Gửi email chăm sóc khách hàng thành công!"));
    } catch (error) {
      console.error("Lỗi gửi email:", error);
      const errMsg = error.response?.data?.message || error.message || "Lỗi không xác định";
      setMessage("❌ " + errMsg);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 7000);
    }
  };

  return (
    <div className="p-6">
      {/* 3 ô thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statsLoading ? (
          <div className="col-span-3 text-center py-10 text-gray-500 text-xl">
            Đang tải thống kê...
          </div>
        ) : (
          <>
            {/* Lịch hôm nay */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Lịch hôm nay</p>
                  <p className="text-4xl font-bold mt-2">{stats.todayBookings}</p>
                </div>
                <div className="bg-blue-600 p-4 rounded-full text-white">
                  <Calendar className="w-10 h-10" />
                </div>
              </div>
            </div>

            {/* Đang sửa chữa – CHỈ TÍNH "ĐANG SỬA", KHÔNG TÍNH "HOÀN THÀNH" */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Đang sửa chữa</p>
                  <p className="text-4xl font-bold mt-2">{stats.ongoingRepairs}</p>
                </div>
                <div className="bg-orange-600 p-4 rounded-full text-white">
                  <Wrench className="w-10 h-10" />
                </div>
              </div>
            </div>

            {/* Phụ tùng sắp hết */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-500 text-sm">Phụ tùng sắp hết</p>
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-4xl font-bold">{stats.lowStockParts}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm text-gray-600">Cảnh báo khi dưới:</span>
                    <input
                      type="number"
                      min="1"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-3 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600">cái</span>
                  </div>
                </div>
                <div className="bg-red-600 p-4 rounded-full text-white">
                  <Package className="w-10 h-10" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Khu vực chào mừng + nút gửi email thủ công */}
      <div className="bg-white rounded-2xl shadow-xl p-10">
        <h3 className="text-3xl font-bold text-indigo-700 mb-4">
          Chào mừng đến Hệ thống Quản trị Garage
        </h3>
        <p className="text-gray-600 text-lg mb-8">
          Quản lý toàn diện: lịch hẹn, sửa chữa, kho phụ tùng, nhân viên, khách hàng và báo cáo doanh thu.
        </p>

        <div className="flex flex-col items-start gap-4">
          <button
            onClick={handleManualSend}
            disabled={isLoading}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all
              ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              }`}
          >
            <Mail className="w-6 h-6" />
            {isLoading ? "Đang gửi email chăm sóc..." : "Gửi ngay email chăm sóc khách hàng"}
          </button>

          {message && (
            <div
              className={`mt-4 px-6 py-3 rounded-lg text-lg font-medium ${
                message.startsWith("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-4">
            • Tự động: Mỗi ngày lúc 8:00 sáng<br />
            • Thủ công: Nhấn nút trên để gửi ngay lập tức
          </p>
        </div>
      </div>
    </div>
  );
}