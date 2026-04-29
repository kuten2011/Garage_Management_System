import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance"; 
import { TrendingUp, DollarSign, Car, Wrench, Calendar, Building } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API = "/admin/reports";

export default function ReportManager() {
  const [allReports, setAllReports] = useState([]); // Lưu tất cả báo cáo từ backend
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu lọc cho biểu đồ
  const [summary, setSummary] = useState({ totalBranches: 0, totalRevenue: 0, totalCars: 0 });
  const [loading, setLoading] = useState(true);

  // Bộ lọc: từ tháng đến tháng (YYYY-MM)
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, summaryRes] = await Promise.all([
          axiosInstance.get(`${API}`), // Lấy tất cả báo cáo
          axiosInstance.get(`${API}/summary`)
        ]);

        // Lưu tất cả báo cáo (đã sort theo tháng)
        const reports = allRes.data
          .sort((a, b) => a.thangNam.localeCompare(b.thangNam))
          .map(item => ({
            month: item.thangNam,
            revenue: item.doanhThu || 0,
            cars: item.soXePhucVu || 0
          }));

        setAllReports(reports);
        setFilteredData(reports); // Ban đầu hiển thị tất cả
        setSummary(summaryRes.data);
      } catch (err) {
        alert("Lỗi tải báo cáo!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Áp dụng filter khi fromMonth/toMonth thay đổi
  useEffect(() => {
    if (!allReports.length) return;

    let filtered = allReports;

    if (fromMonth) {
      filtered = filtered.filter(item => item.month >= fromMonth);
    }

    if (toMonth) {
      filtered = filtered.filter(item => item.month <= toMonth);
    }

    setFilteredData(filtered);

    // Cập nhật summary theo filtered data
    const totalRevenue = filtered.reduce((sum, item) => sum + item.revenue, 0);
    const totalCars = filtered.reduce((sum, item) => sum + item.cars, 0);

    setSummary(prev => ({
      ...prev,
      totalRevenue,
      totalCars
    }));
  }, [fromMonth, toMonth, allReports]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <TrendingUp size={32} className="text-indigo-600" />
          Báo Cáo Doanh Thu & Hoạt Động
        </h1>

        {/* Bộ lọc */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ tháng</label>
              <input
                type="month"
                value={fromMonth}
                onChange={(e) => setFromMonth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến tháng</label>
              <input
                type="month"
                value={toMonth}
                onChange={(e) => setToMonth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setFromMonth(""); setToMonth(""); }}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Thống kê tổng hợp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Tổng chi nhánh", value: summary.totalBranches, icon: Building, color: "bg-indigo-600" },
            { label: "Tổng doanh thu", value: formatCurrency(summary.totalRevenue), icon: DollarSign, color: "bg-green-600" },
            { label: "Tổng xe phục vụ", value: summary.totalCars, icon: Car, color: "bg-purple-600" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Biểu đồ */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải báo cáo...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Không có dữ liệu cho khoảng thời gian này</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Biểu đồ doanh thu & xe phục vụ</h2>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: "#555" }}
                  tickFormatter={(value) => {
                    const [year, month] = value.split("-");
                    return `${month}/${year}`;
                  }}
                />
                <YAxis yAxisId="left" tick={{ fill: "#10b981" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8b5cf6" }} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(value) : value,
                    name === "revenue" ? "Doanh thu" : "Số xe"
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  dot={{ fill: "#10b981", r: 8 }}
                  name="Doanh thu"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cars" 
                  stroke="#8b5cf6" 
                  strokeWidth={4}
                  dot={{ fill: "#8b5cf6", r: 8 }}
                  name="Số xe phục vụ"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}