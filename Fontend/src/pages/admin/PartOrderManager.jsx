import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, CheckCircle2, XCircle, BadgeCheck, AlertTriangle, ShoppingCart } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const API = "/admin/part-orders";

export default function PartOrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tất cả");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API);
      setOrders(res.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === "Tất cả") return orders;
    return orders.filter((order) => order.trangThai === filter);
  }, [orders, filter]);

  const updateStatus = async (maDon, trangThai) => {
    try {
      await axiosInstance.patch(`${API}/${maDon}/status`, { trangThai });
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Cap nhat trang thai that bai.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-indigo-600" size={32} />
          <div>
            <h1 className="text-2xl font-black text-gray-900">Quan ly don dat phu tung</h1>
            <p className="text-sm text-gray-500">Theo doi don cua khach, xac nhan va cap nhat thanh toan.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border px-4 py-3 text-sm font-medium">
            <option>Tất cả</option>
            <option>Chờ xác nhận</option>
            <option>Đã xác nhận</option>
            <option>Thanh toán thành công</option>
            <option>Từ chối</option>
            <option>Thanh toán thất bại</option>
          </select>
          <button onClick={fetchOrders} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50">
            <RefreshCcw size={16} />
            Tải lại
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow">Dang tai don hang...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow">Khong co don hang phu hop.</div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.maDon} className="rounded-2xl bg-white p-5 shadow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-black text-gray-900">{order.maDon}</div>
                  <div className="text-sm text-gray-500">
                    {order.hoTen} - {order.sdt} - {order.email || "No email"}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Chi nhanh: {order.tenChiNhanh || order.maChiNhanh || "-"} | Ngay dat: {new Date(order.ngayDat).toLocaleString("vi-VN")}
                  </div>
                </div>
                <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">
                  {order.trangThai}
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
                <div>Tong tien: <span className="font-bold">{Number(order.tongTien || 0).toLocaleString("vi-VN")}đ</span></div>
                <div>Khach hang: <span className="font-bold">{order.maKH || "-"}</span></div>
                <div>Da tra kho: <span className="font-bold">{order.daTraKho ? "Co" : "Khong"}</span></div>
              </div>

              <div className="mt-4 space-y-2">
                {order.items?.map((line) => (
                  <div key={line.maPT} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                    <span>{line.tenPT}</span>
                    <span className="font-semibold">x{line.soLuong} - {Number(line.thanhTien || 0).toLocaleString("vi-VN")}đ</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => updateStatus(order.maDon, "Đã xác nhận")} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
                  <BadgeCheck size={16} />
                  Xác nhận
                </button>
                <button onClick={() => updateStatus(order.maDon, "Thanh toán thành công")} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700">
                  <CheckCircle2 size={16} />
                  Thanh toán thành công
                </button>
                <button onClick={() => updateStatus(order.maDon, "Từ chối")} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
                  <XCircle size={16} />
                  Từ chối
                </button>
                <button onClick={() => updateStatus(order.maDon, "Thanh toán thất bại")} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600">
                  <AlertTriangle size={16} />
                  Thanh toán thất bại
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
