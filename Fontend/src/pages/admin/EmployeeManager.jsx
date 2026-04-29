import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Plus,
  Search,
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  X,
  Edit2,
  Trash2,
} from "lucide-react";

const VAI_TRO_OPTIONS = ["Lễ tân", "Kỹ thuật viên", "Quản lý", "Quản trị viên"];

export default function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);

  // Bộ lọc
  const [filters, setFilters] = useState({
    maNV: "",
    hoTen: "",
    vaiTro: "",
    maChiNhanh: "",
  });

  // Modal thêm / sửa
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    maNV: "",
    hoTen: "",
    vaiTro: "Lễ tân",
    sdt: "",
    email: "",
    matKhau: "",
    maChiNhanh: "",
  });
  const [processing, setProcessing] = useState(false);

  // Load nhân viên
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Load chi nhánh từ /admin/branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const res = await axiosInstance.get("/admin/branches?page=0&size=100");
        const branchList = res.data.content || [];
        setBranches(branchList);
        if (branchList.length > 0) {
          setCurrentEmployee(prev => ({ ...prev, maChiNhanh: branchList[0].maChiNhanh }));
        }
      } catch (err) {
        console.error(err);
        alert("Không thể tải danh sách chi nhánh!");
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/employees");
      const data = Array.isArray(res.data) ? res.data : [];
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách nhân viên!");
    } finally {
      setLoading(false);
    }
  };

  // Lọc nhân viên
  useEffect(() => {
    let filtered = employees;
    if (filters.maNV)
      filtered = filtered.filter(e =>
        e.maNV.toLowerCase().includes(filters.maNV.toLowerCase())
      );
    if (filters.hoTen)
      filtered = filtered.filter(e =>
        e.hoTen.toLowerCase().includes(filters.hoTen.toLowerCase())
      );
    if (filters.vaiTro) filtered = filtered.filter(e => e.vaiTro === filters.vaiTro);
    if (filters.maChiNhanh)
      filtered = filtered.filter(e => e.maChiNhanh === filters.maChiNhanh);
    setFilteredEmployees(filtered);
  }, [filters, employees]);

  // Mở modal thêm mới
  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentEmployee({
      hoTen: "",
      vaiTro: "Lễ tân",
      sdt: "",
      email: "",
      matKhau: "",
      maChiNhanh: branches[0]?.maChiNhanh || "",
    });
    setShowModal(true);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (emp) => {
    setIsEditMode(true);
    setCurrentEmployee({
      maNV: emp.maNV,
      hoTen: emp.hoTen,
      vaiTro: emp.vaiTro,
      sdt: emp.sdt || "",
      email: emp.email,
      matKhau: "", // không hiện mật khẩu cũ
      maChiNhanh: emp.maChiNhanh,
    });
    setShowModal(true);
  };

  // Lưu (thêm hoặc sửa)
  const handleSave = async () => {
    if (!currentEmployee.hoTen?.trim() || !currentEmployee.email?.trim() || !currentEmployee.maChiNhanh) {
      alert("Vui lòng nhập họ tên, email và chọn chi nhánh!");
      return;
    }
    if (!isEditMode && !currentEmployee.matKhau?.trim()) {
      alert("Vui lòng nhập mật khẩu khi thêm mới!");
      return;
    }

    try {
      setProcessing(true);
      if (isEditMode) {
        await axiosInstance.put(`/admin/employees/${currentEmployee.maNV}`, currentEmployee);
        alert("Cập nhật nhân viên thành công!");
      } else {
        await axiosInstance.post("/admin/employees", currentEmployee);
        alert("Thêm nhân viên thành công!");
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data || "Lưu thất bại!");
    } finally {
      setProcessing(false);
    }
  };

  // XÓA nhân viên
  const handleDelete = async (maNV, hoTen) => {
    if (!window.confirm(`Xóa nhân viên "${hoTen}" (Mã: ${maNV})?\nHành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/admin/employees/${maNV}`);
      alert("Xóa nhân viên thành công!");
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data || "Xóa thất bại! Có thể nhân viên đang có dữ liệu liên quan.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center gap-4">
            <User size={48} className="text-indigo-600" />
            Quản Lý Nhân Viên
          </h1>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition flex items-center gap-3"
          >
            <Plus size={28} />
            Thêm nhân viên mới
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <Search size={32} className="text-indigo-600" />
            <h2 className="text-3xl font-bold text-gray-800">Tìm kiếm & Lọc</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <input
              placeholder="Mã nhân viên"
              value={filters.maNV}
              onChange={(e) => setFilters({ ...filters, maNV: e.target.value })}
              className="px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-indigo-300"
            />
            <input
              placeholder="Họ và tên"
              value={filters.hoTen}
              onChange={(e) => setFilters({ ...filters, hoTen: e.target.value })}
              className="px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-indigo-300"
            />
            <select
              value={filters.vaiTro}
              onChange={(e) => setFilters({ ...filters, vaiTro: e.target.value })}
              className="px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-indigo-300"
            >
              <option value="">Tất cả vai trò</option>
              {VAI_TRO_OPTIONS.map((vt) => (
                <option key={vt} value={vt}>{vt}</option>
              ))}
            </select>
            <select
              value={filters.maChiNhanh}
              onChange={(e) => setFilters({ ...filters, maChiNhanh: e.target.value })}
              className="px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-indigo-300"
            >
              <option value="">Tất cả chi nhánh</option>
              {branches.map((b) => (
                <option key={b.maChiNhanh} value={b.maChiNhanh}>
                  {b.tenChiNhanh} ({b.maChiNhanh})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Danh sách nhân viên */}
        {loading ? (
          <div className="text-center text-3xl py-20">Đang tải nhân viên...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center text-3xl text-gray-500 py-20">
            Không tìm thấy nhân viên nào
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.maNV}
                className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition transform hover:-translate-y-2 relative"
              >
                {/* Nút Sửa & Xóa */}
                <div className="absolute top-4 right-4 flex gap-3">
                  <button
                    onClick={() => openEditModal(emp)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={24} />
                  </button>
                  <button
                    onClick={() => handleDelete(emp.maNV, emp.hoTen)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Xóa nhân viên"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-700">
                    {emp.hoTen.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{emp.hoTen}</h3>
                    <p className="text-lg text-indigo-600 font-semibold flex items-center gap-2">
                      <Briefcase size={20} />
                      {emp.vaiTro || "Nhân viên"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-lg">
                  <p><strong>Mã NV:</strong> {emp.maNV}</p>
                  <p className="flex items-center gap-2"><Phone size={18} /> {emp.sdt || "-"}</p>
                  <p className="flex items-center gap-2"><Mail size={18} /> {emp.email}</p>
                  <p className="flex items-center gap-2">
                    <Building size={18} />
                    <strong>Chi nhánh:</strong>{" "}
                    {branches.find(b => b.maChiNhanh === emp.maChiNhanh)?.tenChiNhanh || emp.maChiNhanh || "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-indigo-600">
                {isEditMode ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={36} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isEditMode && (
                <div className="px-6 py-5 bg-gray-100 rounded-2xl text-xl font-bold text-gray-700 col-span-2">
                  Mã nhân viên: {currentEmployee.maNV}
                </div>
              )}

              <input
                type="text"
                placeholder="Họ và tên *"
                value={currentEmployee.hoTen}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, hoTen: e.target.value })}
                className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-indigo-300"
              />

              <select
                value={currentEmployee.vaiTro}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, vaiTro: e.target.value })}
                className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-indigo-300"
              >
                {VAI_TRO_OPTIONS.map((vt) => (
                  <option key={vt} value={vt}>{vt}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Số điện thoại"
                value={currentEmployee.sdt}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, sdt: e.target.value })}
                className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-indigo-300"
              />

              <input
                type="email"
                placeholder="Email *"
                value={currentEmployee.email}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
                className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-indigo-300"
              />

              {!isEditMode && (
                <input
                  type="password"
                  placeholder="Mật khẩu *"
                  value={currentEmployee.matKhau}
                  onChange={(e) => setCurrentEmployee({ ...currentEmployee, matKhau: e.target.value })}
                  className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-indigo-300"
                />
              )}

              <select
                value={currentEmployee.maChiNhanh}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, maChiNhanh: e.target.value })}
                className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-indigo-300"
              >
                <option value="">Chọn chi nhánh *</option>
                {branches.map((b) => (
                  <option key={b.maChiNhanh} value={b.maChiNhanh}>
                    {b.tenChiNhanh} ({b.maChiNhanh})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center gap-8 mt-12">
              <button
                onClick={() => setShowModal(false)}
                className="px-12 py-5 border-2 border-gray-400 rounded-2xl font-bold text-2xl hover:bg-gray-100 transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                disabled={processing || loadingBranches}
                className="px-16 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition disabled:opacity-70"
              >
                {processing ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Thêm nhân viên"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}