import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { TrendingUp, DollarSign, Car, Calendar, Building } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import CollapsibleFilter from "../../components/ui/CollapsibleFilter";

const API = "/admin/reports";

export default function ReportManager() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({ totalBranches: 0, totalRevenue: 0, totalCars: 0 });
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [branchId, setBranchId] = useState("");
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const [maxRevenue, setMaxRevenue] = useState("");
  const [minCars, setMinCars] = useState("");
  const [maxCars, setMaxCars] = useState("");
  const [sortBy, setSortBy] = useState("month");
  const [sortDir, setSortDir] = useState("asc");

  const queryParams = useMemo(() => {
    const params = {};
    if (branchId) params.maChiNhanh = branchId;
    if (fromMonth) params.fromMonth = fromMonth;
    if (toMonth) params.toMonth = toMonth;
    if (minRevenue !== "") params.minRevenue = minRevenue;
    if (maxRevenue !== "") params.maxRevenue = maxRevenue;
    if (minCars !== "") params.minCars = minCars;
    if (maxCars !== "") params.maxCars = maxCars;
    return params;
  }, [branchId, fromMonth, toMonth, minRevenue, maxRevenue, minCars, maxCars]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axiosInstance.get("/admin/branches", {
          params: { page: 0, size: 100 },
        });
        setBranches(res.data?.content || res.data || []);
      } catch {
        setBranches([]);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [reportRes, summaryRes] = await Promise.all([
          axiosInstance.get(API, { params: queryParams }),
          axiosInstance.get(`${API}/summary`, { params: queryParams }),
        ]);

        const mapped = (reportRes.data || []).map((item) => ({
          month: item.thangNam || "",
          revenue: item.doanhThu || 0,
          cars: item.soXePhucVu || 0,
          branchId: item.maChiNhanh || "",
        }));

        mapped.sort((a, b) => {
          let compare = 0;
          if (sortBy === "month") {
            compare = a.month.localeCompare(b.month);
          } else if (sortBy === "revenue") {
            compare = a.revenue - b.revenue;
          } else if (sortBy === "cars") {
            compare = a.cars - b.cars;
          }
          return sortDir === "asc" ? compare : -compare;
        });

        setReports(mapped);
        setSummary(summaryRes.data || { totalBranches: 0, totalRevenue: 0, totalCars: 0 });
      } catch (err) {
        console.error("Lỗi tải báo cáo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [queryParams, sortBy, sortDir]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  const resetFilters = () => {
    setBranchId("");
    setFromMonth("");
    setToMonth("");
    setMinRevenue("");
    setMaxRevenue("");
    setMinCars("");
    setMaxCars("");
    setSortBy("month");
    setSortDir("asc");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <TrendingUp size={32} className="text-indigo-600" />
          Báo Cáo Doanh Thu & Hoạt Động
        </h1>

        <CollapsibleFilter title="Bộ lọc báo cáo" icon={Calendar}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chi nhánh</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="">Tất cả chi nhánh</option>
                {branches.map((branch) => (
                  <option key={branch.maChiNhanh} value={branch.maChiNhanh}>
                    {branch.tenChiNhanh || branch.maChiNhanh}
                  </option>
                ))}
              </select>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doanh thu từ</label>
              <input
                type="number"
                min="0"
                value={minRevenue}
                onChange={(e) => setMinRevenue(e.target.value)}
                placeholder="VNĐ"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doanh thu đến</label>
              <input
                type="number"
                min="0"
                value={maxRevenue}
                onChange={(e) => setMaxRevenue(e.target.value)}
                placeholder="VNĐ"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số xe từ</label>
              <input
                type="number"
                min="0"
                value={minCars}
                onChange={(e) => setMinCars(e.target.value)}
                placeholder="Xe"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số xe đến</label>
              <input
                type="number"
                min="0"
                value={maxCars}
                onChange={(e) => setMaxCars(e.target.value)}
                placeholder="Xe"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="month">Tháng</option>
                <option value="revenue">Doanh thu</option>
                <option value="cars">Số xe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
              <select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </CollapsibleFilter>

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

        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải báo cáo...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Không có dữ liệu phù hợp bộ lọc</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Biểu đồ doanh thu & xe phục vụ</h2>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={reports}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#555" }}
                  tickFormatter={(value) => {
                    if (!value) return value;
                    const [year, month] = value.split("-");
                    return `${month}/${year}`;
                  }}
                />
                <YAxis yAxisId="left" tick={{ fill: "#10b981" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8b5cf6" }} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(value) : value,
                    name === "revenue" ? "Doanh thu" : "Số xe",
                  ]}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ fill: "#10b981", r: 6 }}
                  name="Doanh thu"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cars"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  dot={{ fill: "#8b5cf6", r: 6 }}
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
