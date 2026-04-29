import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./security/Login";
import RegisterPage from "./security/Register";

import AdminDashboard from "./admin/AdminDashboard";
import BookingManager from "./admin/BookingManager";
import RepairManager from "./admin/RepairManager";
import RepairDetail from "./admin/RepairDetail";
import PartManager from "./admin/PartManager";
import ServiceManager from "./admin/ServiceManager";
import EmployeeManager from "./admin/EmployeeManager";
import CustomerManager from "./admin/CustomerManager";
import VehicleManager from "./admin/VehicleManager";
import ReportManager from "./admin/ReportManager";
import BranchManager from "./admin/BranchManager";
import FeedbackManager from "./admin/FeedbackManager";

import PaymentSuccess from "./payment/PaymentSuccess";
import PaymentFailed from "./payment/PaymentFailed";

import Services from "./customer/Services";
import Parts from "./customer/Parts";
import CustomerLayout from "./customer/CustomerLayout"; 
import HomeContent from "./customer/HomeContent"; 
import MyRepairs from "./customer/MyRepairs";

// Component bảo vệ route admin
function ProtectedAdminRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Đang kiểm tra đăng nhập...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Trang khách hàng với layout chung */}
        <Route path="/" element={<CustomerLayout><HomeContent /></CustomerLayout>} />
        <Route path="/services" element={<CustomerLayout><Services /></CustomerLayout>} />
        <Route path="/parts" element={<CustomerLayout><Parts /></CustomerLayout>} />
        <Route path="/my-repairs" element={<CustomerLayout><MyRepairs /></CustomerLayout>} />
        <Route path="/customer/repairParts/:maPhieu" element={<CustomerLayout><RepairDetail /></CustomerLayout>} />

        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />

        {/* ĐĂNG NHẬP ADMIN – TRUY CẬP TRỰC TIẾP ĐƯỢC */}
        <Route path="/login" element={<AdminLogin />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* TOÀN BỘ ADMIN – BẢO VỆ BẰNG TOKEN */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<BookingManager />} />
          <Route path="repairs" element={<RepairManager />} />
          <Route path="parts" element={<PartManager />} />
          <Route path="services" element={<ServiceManager />} />
          <Route path="employees" element={<EmployeeManager />} />
          <Route path="customers" element={<CustomerManager />} />
          <Route path="vehicles" element={<VehicleManager />} />
          <Route path="branches" element={<BranchManager />} />
          <Route path="feedbacks" element={<FeedbackManager />} />
          <Route path="reports" element={<ReportManager />} />
        </Route>

        {/* Redirect nếu vào /admin mà chưa login */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
}