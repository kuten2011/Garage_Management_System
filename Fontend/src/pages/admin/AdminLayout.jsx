import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Wrench,
  Users,
  Package,
  FileText,
  LogOut,
  Car,
  Hammer,
  Store,
  Inbox,
  Menu as MenuIcon,
  X,
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
  { icon: Store, label: "Chi nhánh", path: "/admin/branches" },
  { icon: Inbox, label: "Phản hồi", path: "/admin/feedbacks" },
  { icon: FileText, label: "Báo cáo", path: "/admin/reports" },
];

export default function AdminLayout() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeLabel =
    menu.find((item) => item.path === location.pathname)?.label || "Dashboard";

  const MenuItems = ({ onItemClick }) => (
    <>
      {menu.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-all lg:gap-4 lg:px-6 lg:py-4 lg:text-base ${
              active
                ? "bg-white text-indigo-800 font-bold border-l-4 border-yellow-400"
                : "text-indigo-50 hover:bg-indigo-700"
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <aside className="hidden bg-gradient-to-b from-indigo-800 to-indigo-900 text-white shadow-2xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col">
        <div className="flex-shrink-0 border-b border-indigo-700 p-6 text-center">
          <h1 className="flex items-center justify-center gap-3 text-2xl font-bold">
            <Wrench className="h-8 w-8" />
            GARAGE ADMIN
          </h1>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto pb-6">
          <MenuItems />
        </nav>

        <div className="flex-shrink-0 border-t border-indigo-700 p-6">
          <Link
            to="/"
            className="flex items-center gap-3 text-red-300 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b bg-white shadow-md">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <h2 className="min-w-0 truncate text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              {activeLabel}
            </h2>

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 text-white shadow lg:hidden"
              aria-label={
                isMenuOpen ? "Đóng menu quản trị" : "Mở menu quản trị"
              }
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {isMenuOpen && (
            <nav className="max-h-[70vh] overflow-y-auto border-t border-indigo-700 bg-gradient-to-b from-indigo-800 to-indigo-900 py-2 lg:hidden">
              <MenuItems onItemClick={() => setIsMenuOpen(false)} />
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-200 hover:bg-indigo-700 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                <span>Quay lại trang chủ</span>
              </Link>
            </nav>
          )}
        </header>

        <main className="min-h-screen bg-gray-50 p-3 sm:p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
