import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Plus,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

export default function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [filters, setFilters] = useState({
    maKH: "",
    hoTen: "",
    sdt: "",
    email: "",
  });

  // Modal thêm/sửa
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    maKH: "",
    hoTen: "",
    sdt: "",
    email: "",
    diaChi: "",
    matKhau: "",
    confirmMatKhau: "", // thêm dòng này
  });
  const [processing, setProcessing] = useState(false);

  // Load khách hàng
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/customers");
      const data = (res.data.content || res.data || []).map((c) => ({
        ...c,
        soXeSoHuu: c.xeList?.length || 0, // tính số xe sở hữu
      }));
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách khách hàng!");
    } finally {
      setLoading(false);
    }
  };

  // Lọc khách hàng
  useEffect(() => {
    let filtered = customers;
    if (filters.maKH)
      filtered = filtered.filter((c) =>
        c.maKH.toLowerCase().includes(filters.maKH.toLowerCase()),
      );
    if (filters.hoTen)
      filtered = filtered.filter((c) =>
        c.hoTen.toLowerCase().includes(filters.hoTen.toLowerCase()),
      );
    if (filters.sdt)
      filtered = filtered.filter((c) => c.sdt?.includes(filters.sdt));
    if (filters.email)
      filtered = filtered.filter((c) =>
        c.email.toLowerCase().includes(filters.email.toLowerCase()),
      );
    setFilteredCustomers(filtered);
  }, [filters, customers]);

  // Mở modal thêm mới
  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentCustomer({
      hoTen: "",
      sdt: "",
      email: "",
      diaChi: "",
      matKhau: "",
    });
    setShowModal(true);
  };

  // Mở modal sửa
  const openEditModal = (cust) => {
    setIsEditMode(true);
    setCurrentCustomer({
      maKH: cust.maKH,
      hoTen: cust.hoTen,
      sdt: cust.sdt || "",
      email: cust.email,
      diaChi: cust.diaChi || "",
      matKhau: "", // không hiển thị mật khẩu cũ
    });
    setShowModal(true);
  };

  // Lưu khách hàng
  const handleSave = async () => {
    if (!currentCustomer.hoTen?.trim() || !currentCustomer.email?.trim()) {
      alert("Vui lòng nhập họ tên và email!");
      return;
    }
    if (!isEditMode && !currentCustomer.matKhau?.trim()) {
      alert("Vui lòng nhập mật khẩu khi thêm mới!");
      return;
    }

    try {
      setProcessing(true);
      if (isEditMode) {
        // PUT /admin/customers/{maKH}
        await axiosInstance.put(
          `/admin/customers/${currentCustomer.maKH}`,
          currentCustomer,
        );
        alert("Cập nhật khách hàng thành công!");
      } else {
        // POST /web_garage/auth/register
        //backend cần confirm
        // forntend ở tạo cũng cần
        // check confirm trước
        if (currentCustomer.matKhau !== currentCustomer.confirmMatKhau) {
          alert("Mật khẩu xác nhận không khớp!");
          return;
        }

        // loại bỏ trước khi gửi
        const { maKH, confirmMatKhau, ...dataToSend } = currentCustomer;

        await axiosInstance.post("/web_garage/auth/register", dataToSend);
        alert("Thêm khách hàng thành công!");
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data || "Lưu thất bại!");
    } finally {
      setProcessing(false);
    }
  };

  // Xóa khách hàng
  const handleDelete = async (maKH, hoTen) => {
    if (
      !window.confirm(
        `Xóa khách hàng "${hoTen}" (Mã: ${maKH})?\nCẩn thận: sẽ xóa cả xe liên quan!`,
      )
    ) {
      return;
    }
    try {
      // DELETE /admin/customers/{maKH}
      await axiosInstance.delete(`/admin/customers/${maKH}`);
      alert("Xóa thành công!");
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data || "Xóa thất bại! Có thể có dữ liệu liên quan.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center gap-4">
            <User size={48} className="text-green-600" />
            Quản Lý Khách Hàng
          </h1>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition flex items-center gap-3"
          >
            <Plus size={28} />
            Thêm khách hàng mới
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <Search size={32} className="text-green-600" />
            <h2 className="text-3xl font-bold text-gray-800">Tìm kiếm & Lọc</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <input
              placeholder="Mã khách hàng"
              value={filters.maKH}
              onChange={(e) => setFilters({ ...filters, maKH: e.target.value })}
              className="px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-green-300"
            />
            <input
              placeholder="Họ và tên"
              value={filters.hoTen}
              onChange={(e) =>
                setFilters({ ...filters, hoTen: e.target.value })
              }
              className="px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-green-300"
            />
            <input
              placeholder="Số điện thoại"
              value={filters.sdt}
              onChange={(e) => setFilters({ ...filters, sdt: e.target.value })}
              className="px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-green-300"
            />
            <input
              placeholder="Email"
              value={filters.email}
              onChange={(e) =>
                setFilters({ ...filters, email: e.target.value })
              }
              className="px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:ring-4 focus:ring-green-300"
            />
          </div>
        </div>

        {/* Danh sách khách hàng */}
        {loading ? (
          <div className="text-center text-3xl py-20">
            Đang tải khách hàng...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center text-3xl text-gray-500 py-20">
            Không tìm thấy khách hàng nào
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCustomers.map((c) => (
              <div
                key={c.maKH}
                className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition transform hover:-translate-y-2 relative"
              >
                {/* Nút Sửa & Xóa */}
                <div className="absolute top-4 right-4 flex gap-3">
                  <button
                    onClick={() => openEditModal(c)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={24} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.maKH, c.hoTen)}
                    className="text-red-600 hover:text-red-800"
                    title="Xóa khách hàng"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-3xl font-bold text-green-700">
                    {c.hoTen.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {c.hoTen}
                    </h3>
                    <p className="text-lg text-green-600 font-semibold">
                      Mã KH: {c.maKH}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-lg">
                  <p className="flex items-center gap-3">
                    <Phone size={20} className="text-green-600" />
                    {c.sdt || "-"}
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail size={20} className="text-green-600" />
                    {c.email}
                  </p>
                  <p className="flex items-center gap-3">
                    <MapPin size={20} className="text-green-600" />
                    <span className="text-gray-700">
                      {c.diaChi || "Chưa có địa chỉ"}
                    </span>
                  </p>
                  <p className="flex items-center gap-3 pt-4 border-t">
                    <Car size={22} className="text-green-600" />
                    <strong>Số xe sở hữu:</strong>{" "}
                    <span className="font-bold text-xl text-green-700">
                      {c.xeList?.length || 0}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa Khách Hàng */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-green-600">
                {isEditMode ? "Chỉnh Sửa Khách Hàng" : "Thêm Khách Hàng Mới"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={36} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isEditMode && (
                <div className="px-6 py-5 bg-gray-100 rounded-2xl text-xl font-bold text-gray-700 col-span-2">
                  Mã KH: {currentCustomer.maKH}
                </div>
              )}

              <input
                type="text"
                placeholder="Họ và tên *"
                value={currentCustomer.hoTen}
                onChange={(e) =>
                  setCurrentCustomer({
                    ...currentCustomer,
                    hoTen: e.target.value,
                  })
                }
                className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-green-300"
              />

              <input
                type="text"
                placeholder="Số điện thoại"
                value={currentCustomer.sdt}
                onChange={(e) =>
                  setCurrentCustomer({
                    ...currentCustomer,
                    sdt: e.target.value,
                  })
                }
                className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-green-300"
              />

              <input
                type="email"
                placeholder="Email *"
                value={currentCustomer.email}
                onChange={(e) =>
                  setCurrentCustomer({
                    ...currentCustomer,
                    email: e.target.value,
                  })
                }
                className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-green-300"
              />

              <input
                type="text"
                placeholder="Địa chỉ"
                value={currentCustomer.diaChi}
                onChange={(e) =>
                  setCurrentCustomer({
                    ...currentCustomer,
                    diaChi: e.target.value,
                  })
                }
                className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-green-300 col-span-2"
              />

              {!isEditMode && (
                <>
                  <input
                    type="password"
                    placeholder="Mật khẩu *"
                    value={currentCustomer.matKhau}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        matKhau: e.target.value,
                      })
                    }
                    className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-green-300 col-span-2"
                  />

                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu *"
                    value={currentCustomer.confirmMatKhau}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        confirmMatKhau: e.target.value,
                      })
                    }
                    className="px-6 py-5 border-2 border-gray-300 rounded-2xl text-xl focus:ring-4 focus:ring-green-300 col-span-2"
                  />
                </>
              )}
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
                disabled={processing}
                className="px-16 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition disabled:opacity-70"
              >
                {processing
                  ? "Đang lưu..."
                  : isEditMode
                    ? "Cập nhật"
                    : "Thêm khách hàng"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
