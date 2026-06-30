import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./security/Login";
import RegisterPage from "./security/Register";

import AdminDashboard from "./admin/AdminDashboard";
import BookingManager from "./admin/BookingManager";
import RepairManager from "./admin/RepairManager";
import RepairDetail from "./admin/RepairDetail";
import PartManager from "./admin/PartManager";
import ServiceManager from "./admin/ServiceManager";
import PartOrderManager from "./admin/PartOrderManager";
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
import ServiceDetail from "./customer/ServiceDetail";
import PartDetail from "./customer/PartDetail";
import PartCart from "./customer/PartCart";
import CustomerLayout from "./customer/CustomerLayout";
import HomeContent from "./customer/HomeContent";
import MyRepairs from "./customer/MyRepairs";
import InfoPage from "./customer/InfoPage";
import ContactPage from "./customer/ContactPage";
import ToastHost from "../components/ui/ToastHost";
import { getStoredRoles, isAuthenticated } from "../utils/authStorage";

function getUserRoles() {
  return getStoredRoles();
}

function hasAnyRole(allowedRoles) {
  const roles = getUserRoles();
  return allowedRoles.some((role) => roles.includes(role));
}

function ProtectedRoleRoute({ children, allowedRoles, fallback = "/login" }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setAllowed(authenticated && hasAnyRole(allowedRoles));
    setReady(true);
  }, [allowedRoles]);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Dang kiem tra dang nhap...</div>;
  }

  return allowed ? children : <Navigate to={fallback} replace />;
}

export default function App() {
  return (
    <Router>
      <ToastHost />
      <Routes>
        <Route path="/" element={<Navigate to="/customer" replace />} />
        <Route path="/customer" element={<CustomerLayout><HomeContent /></CustomerLayout>} />
        <Route path="/thong-tin" element={<CustomerLayout><InfoPage /></CustomerLayout>} />
        <Route path="/lien-he" element={<CustomerLayout><ContactPage /></CustomerLayout>} />
        <Route path="/customer/services" element={<CustomerLayout><Services /></CustomerLayout>} />
        <Route path="/customer/services/:maDV" element={<CustomerLayout><ServiceDetail /></CustomerLayout>} />
        <Route path="/customer/parts" element={<CustomerLayout><Parts /></CustomerLayout>} />
        <Route path="/customer/parts/:maPT" element={<CustomerLayout><PartDetail /></CustomerLayout>} />
        <Route path="/customer/cart" element={<ProtectedRoleRoute allowedRoles={["ROLE_CUSTOMER"]}><CustomerLayout><PartCart /></CustomerLayout></ProtectedRoleRoute>} />
        <Route path="/my-repairs" element={<ProtectedRoleRoute allowedRoles={["ROLE_CUSTOMER"]}><CustomerLayout><MyRepairs /></CustomerLayout></ProtectedRoleRoute>} />
        <Route path="/customer/my-repairs" element={<ProtectedRoleRoute allowedRoles={["ROLE_CUSTOMER"]}><CustomerLayout><MyRepairs /></CustomerLayout></ProtectedRoleRoute>} />
        <Route
          path="/customer/repairParts/:maPhieu"
          element={
            <ProtectedRoleRoute allowedRoles={["ROLE_CUSTOMER"]}>
              <CustomerLayout><RepairDetail /></CustomerLayout>
            </ProtectedRoleRoute>
          }
        />

        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />

        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services" element={<Navigate to="/customer/services" replace />} />
        <Route path="/services/:maDV" element={<CustomerLayout><ServiceDetail /></CustomerLayout>} />
        <Route path="/parts" element={<Navigate to="/customer/parts" replace />} />
        <Route path="/parts/:maPT" element={<CustomerLayout><PartDetail /></CustomerLayout>} />
        <Route path="/cart" element={<ProtectedRoleRoute allowedRoles={["ROLE_CUSTOMER"]}><Navigate to="/customer/cart" replace /></ProtectedRoleRoute>} />

        <Route
          path="/admin"
          element={
            <ProtectedRoleRoute allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"]} fallback="/login">
              <AdminLayout />
            </ProtectedRoleRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<BookingManager />} />
          <Route path="repairs" element={<RepairManager />} />
          <Route path="parts" element={<PartManager />} />
          <Route path="services" element={<ServiceManager />} />
          <Route path="part-orders" element={<PartOrderManager />} />
          <Route path="employees" element={<EmployeeManager />} />
          <Route path="customers" element={<CustomerManager />} />
          <Route path="vehicles" element={<VehicleManager />} />
          <Route path="branches" element={<BranchManager />} />
          <Route path="feedbacks" element={<FeedbackManager />} />
          <Route path="reports" element={<ReportManager />} />
        </Route>

        <Route path="/admin" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
