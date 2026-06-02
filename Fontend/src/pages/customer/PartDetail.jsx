import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building,
  Minus,
  Package,
  Plus,
  Save,
  ShoppingCart,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { notify } from "../../utils/notify";

const DEFAULT_IMAGE = "https://placehold.net/600x420.png";
const CART_KEY = "partCart";

export default function PartDetail() {
  const { maPT } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [moTa, setMoTa] = useState("");
  const [saving, setSaving] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canEdit = useMemo(() => {
    const roles = (user.authorities || []).map((auth) =>
      typeof auth === "string" ? auth : auth.authority,
    );
    return roles.some((role) => role !== "ROLE_CUSTOMER");
  }, [user]);

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const res = await axiosInstance.get(`/public/parts/${maPT}`);
        setPart(res.data);
        setMoTa(res.data.moTa || "");
      } catch (err) {
        notify("Không tải được chi tiết phụ tùng.", "error");
        navigate("/customer/parts");
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [maPT, navigate]);

  const addToCart = () => {
    const current = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    const index = current.findIndex((item) => item.maPT === part.maPT);
    if (index >= 0) {
      current[index].soLuong += quantity;
    } else {
      current.push({ ...part, soLuong: quantity });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(current));
    navigate("/customer/cart");
  };

  const saveDescription = async () => {
    try {
      setSaving(true);
      const payload = {
        maPT: part.maPT,
        tenPT: part.tenPT,
        donGia: part.donGia,
        soLuongTon: part.soLuongTon,
        moTa,
        hinhAnh: part.hinhAnh,
        maChiNhanh: part.maChiNhanh,
      };
      const res = await axiosInstance.put(`/admin/parts/${part.maPT}`, payload);
      setPart(res.data);
      notify("Đã cập nhật mô tả phụ tùng.", "success");
    } catch (err) {
      notify(err.response?.data?.message || "Không cập nhật được mô tả.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !part) {
    return <div className="min-h-screen bg-gray-100 py-24 text-center text-xl text-gray-600">Dang tai...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <button onClick={() => navigate("/customer/parts")} className="mb-6 inline-flex items-center gap-2 font-semibold text-gray-700 hover:text-yellow-600">
          <ArrowLeft size={20} />
          Quay lai phu tung
        </button>

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2">
          <div className="flex min-h-[320px] items-center justify-center bg-gray-100">
            <img src={part.hinhAnh || DEFAULT_IMAGE} alt={part.tenPT} className="h-full max-h-[520px] w-full object-cover" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-800">
              <Package size={16} />
              {part.maPT}
            </div>

            <h1 className="mb-4 text-3xl font-black text-gray-900 sm:text-4xl">{part.tenPT}</h1>

            <div className="mb-6 flex items-center gap-2 text-gray-600">
              <Building size={18} className="text-indigo-600" />
              {part.tenChiNhanh || part.maChiNhanh || "Chua gan chi nhanh"}
            </div>

            <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
              <p className="text-sm text-gray-600">Gia phu tung</p>
              <p className="text-3xl font-black text-red-600">{Number(part.donGia).toLocaleString("vi-VN")}đ</p>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold text-gray-700">Mo ta phu tung</p>
              {canEdit ? (
                <div className="space-y-3">
                  <textarea
                    value={moTa}
                    onChange={(e) => setMoTa(e.target.value)}
                    rows="5"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Nhap mo ta phu tung"
                  />
                  <button
                    onClick={saveDescription}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-60"
                  >
                    <Save size={16} />
                    {saving ? "Dang luu..." : "Luu mo ta"}
                  </button>
                </div>
              ) : (
                <p className="leading-7 text-gray-700">{part.moTa || "Chua co mo ta cho phu tung nay."}</p>
              )}
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold text-gray-700">So luong dat truoc</p>
              <div className="inline-flex overflow-hidden rounded-xl border border-gray-300">
                <button className="p-3 hover:bg-gray-100" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Minus size={18} />
                </button>
                <span className="w-16 text-center font-bold">{quantity}</span>
                <button className="p-3 hover:bg-gray-100" onClick={() => setQuantity((q) => q + 1)}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={part.soLuongTon <= 0}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-yellow-400 px-6 py-4 font-black text-gray-900 hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              <ShoppingCart size={22} />
              {part.soLuongTon <= 0 ? "Het hang" : "Them vao gio dat truoc"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
