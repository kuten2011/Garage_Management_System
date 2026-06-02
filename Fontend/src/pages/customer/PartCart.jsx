import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building, Minus, Plus, ShoppingCart, Trash2, RefreshCcw, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { notify } from "../../utils/notify";

const CART_KEY = "partCart";

export default function PartCart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [form, setForm] = useState({
    hoTen: "",
    sdt: "",
    email: "",
    maChiNhanh: "",
    ghiChu: "",
  });

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    setItems(savedItems);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setForm((prev) => ({
      ...prev,
      hoTen: user.hoTen || "",
      sdt: user.sdt || "",
      email: user.username || user.email || "",
    }));

    axiosInstance.get("/public/branches?page=0&size=100")
      .then((res) => setBranches(res.data.content || res.data || []))
      .catch(() => setBranches([]));
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.donGia || 0) * Number(item.soLuong || 1), 0),
    [items],
  );

  const saveItems = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
  };

  const changeQuantity = (maPT, delta) => {
    saveItems(
      items.map((item) =>
        item.maPT === maPT ? { ...item, soLuong: Math.max(1, Number(item.soLuong || 1) + delta) } : item,
      ),
    );
  };

  const removeItem = (maPT) => {
    saveItems(items.filter((item) => item.maPT !== maPT));
  };

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axiosInstance.get("/customer/part-orders");
      setOrders(res.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const submitOrder = async () => {
    if (!form.hoTen.trim() || !form.sdt.trim() || !form.maChiNhanh) {
      notify("Vui lòng nhập họ tên, số điện thoại và chọn chi nhánh nhận hàng.", "error");
      return;
    }
    if (items.length === 0) {
      notify("Giỏ hàng đang trống.", "error");
      return;
    }

    const invalidItem = items.find((item) => item.maChiNhanh && item.maChiNhanh !== form.maChiNhanh);
    if (invalidItem) {
      notify(`Phụ tùng ${invalidItem.tenPT} không thuộc chi nhánh đã chọn.`, "error");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        items: items.map((item) => ({ maPT: item.maPT, soLuong: Number(item.soLuong || 1) })),
      };
      const res = await axiosInstance.post("/customer/part-orders", payload);
      localStorage.removeItem(CART_KEY);
      setItems([]);
      notify(`Đặt trước thành công. Mã đơn: ${res.data.maDon}`, "success");
      await loadOrders();
    } catch (err) {
      notify(err.response?.data?.message || "Không gửi được đơn đặt trước.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <button onClick={() => navigate("/customer/parts")} className="mb-6 inline-flex items-center gap-2 font-semibold text-gray-700 hover:text-yellow-600">
          <ArrowLeft size={20} />
          Tiep tuc xem phu tung
        </button>

        <div className="mb-8 flex items-center gap-3">
          <ShoppingCart className="text-yellow-500" size={36} />
          <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">Gio dat truoc phu tung</h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow">
            Gio hang dang trong.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.maPT} className="flex gap-4 rounded-xl bg-white p-4 shadow">
                  <img
                    src={item.hinhAnh || "https://placehold.net/120x120.png"}
                    alt={item.tenPT}
                    className="h-24 w-24 rounded-lg bg-gray-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-gray-900">{item.tenPT}</h3>
                    <p className="text-sm text-gray-500">{item.maPT}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-gray-600">
                      <Building size={14} />
                      {item.tenChiNhanh || item.maChiNhanh || "Chua gan chi nhanh"}
                    </p>
                    <p className="mt-2 font-bold text-red-600">{Number(item.donGia).toLocaleString("vi-VN")}đ</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.maPT)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={20} />
                    </button>
                    <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-300">
                      <button className="p-2 hover:bg-gray-100" onClick={() => changeQuantity(item.maPT, -1)}>
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold">{item.soLuong}</span>
                      <button className="p-2 hover:bg-gray-100" onClick={() => changeQuantity(item.maPT, 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-xl bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-black">Thong tin dat truoc</h2>
              <div className="space-y-3">
                <input value={form.hoTen} onChange={(e) => setForm({ ...form, hoTen: e.target.value })} placeholder="Ho ten" className="w-full rounded-xl border px-4 py-3" />
                <input value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} placeholder="So dien thoai" className="w-full rounded-xl border px-4 py-3" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full rounded-xl border px-4 py-3" />
                <select value={form.maChiNhanh} onChange={(e) => setForm({ ...form, maChiNhanh: e.target.value })} className="w-full rounded-xl border px-4 py-3">
                  <option value="">-- Chon chi nhanh nhan hang --</option>
                  {branches.map((branch) => (
                    <option key={branch.maChiNhanh} value={branch.maChiNhanh}>
                      {branch.tenChiNhanh} ({branch.maChiNhanh})
                    </option>
                  ))}
                </select>
                <textarea value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} placeholder="Ghi chu" className="w-full resize-none rounded-xl border px-4 py-3" rows="3" />
              </div>

              <div className="mt-5 flex justify-between text-lg font-black">
                <span>Tong tam tinh</span>
                <span className="text-red-600">{total.toLocaleString("vi-VN")}đ</span>
              </div>

              <button
                disabled={submitting}
                onClick={submitOrder}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-gray-900 hover:bg-yellow-500 disabled:opacity-60"
              >
                Gui don dat truoc
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 rounded-2xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">Don hang cua toi</h2>
            <button onClick={loadOrders} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
              <RefreshCcw size={16} />
              Tai lai
            </button>
          </div>

          {loadingOrders ? (
            <div className="py-8 text-center text-gray-500">Dang tai don hang...</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-gray-500">Chua co don hang nao.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.maDon} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-black text-gray-900">{order.maDon}</div>
                      <div className="text-sm text-gray-500">
                        {order.tenChiNhanh || order.maChiNhanh || "Chua co chi nhanh"} - {new Date(order.ngayDat).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">
                      {order.trangThai}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
                    <div>Tong tien: <span className="font-bold">{Number(order.tongTien || 0).toLocaleString("vi-VN")}đ</span></div>
                    <div>Ho ten: <span className="font-bold">{order.hoTen}</span></div>
                    <div>Dien thoai: <span className="font-bold">{order.sdt}</span></div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {order.items?.map((line) => (
                      <div key={line.maPT} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                        <span>{line.tenPT}</span>
                        <span className="font-semibold">x{line.soLuong} - {Number(line.thanhTien || 0).toLocaleString("vi-VN")}đ</span>
                      </div>
                    ))}
                  </div>
                  {order.trangThai === "Thanh toán thành công" && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                      <CheckCircle2 size={16} />
                      Da thanh toan
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
