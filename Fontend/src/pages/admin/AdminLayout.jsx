import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  Home, Calendar, Wrench, Users, Package, FileText, LogOut, Car, 
  Hammer, Store, Inbox
} from "lucide-react";

const menu = [
  { icon: Home, label: "Tổng quan", path: "/admin" },
  { icon: Calendar, label: "Lịch hẹn", path: "/admin/bookings" },
  { icon: Wrench, label: "Phiếu sửa chữa", path: "/admin/repairs" },
  { icon: Package, label: "Phụ tùng", path: "/admin/parts" },
  { icon: Hammer, label: "Dịch vụ", path: "/admin/services" },
  { icon: Users, label: "Nhân viên", path: "/admin/employees" },
  { icon: Users, label: "Khách hàng", path: "/admin/customers" },
  { icon: Car, label: "Xe", path: "/admin/vehicles" },
  { icon: Store, label: "Chi Nhánh", path: "/admin/branches" },
  { icon: Inbox, label: "Phản hồi", path: "/admin/feedbacks" },
  { icon: FileText, label: "Báo cáo", path: "/admin/reports" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white shadow-2xl">
        <div className="p-6 text-center border-b border-indigo-700">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-3">
            <Wrench className="w-8 h-8" />
            GARAGE ADMIN
          </h1>
        </div>
        <nav className="mt-6">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 transition-all ${
                  active
                    ? "bg-white text-indigo-800 font-bold border-l-4 border-yellow-400"
                    : "hover:bg-indigo-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-6">
          <Link to="/" className="flex items-center gap-3 text-red-300 hover:text-white">
            <LogOut className="w-5 h-5" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">
        <header className="bg-white shadow-md px-8 py-6 border-b">
          <h2 className="text-3xl font-bold text-gray-800">
            {menu.find(m => m.path === location.pathname)?.label || "Dashboard"}
          </h2>
        </header>
        <main className="p-8 bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}