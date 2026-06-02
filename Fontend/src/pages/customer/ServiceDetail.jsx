import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building, CalendarDays, PhoneCall, Save, Wrench } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { notify } from "../../utils/notify";

export default function ServiceDetail() {
  const { maDV } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
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
    const fetchService = async () => {
      try {
        const res = await axiosInstance.get(`/public/services/${maDV}`);
        setService(res.data);
        setMoTa(res.data.moTa || "");
      } catch (err) {
        notify("Không tải được chi tiết dịch vụ.", "error");
        navigate("/customer/services");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [maDV, navigate]);

  const saveDescription = async () => {
    try {
      setSaving(true);
      const payload = {
        maDV: service.maDV,
        tenDV: service.tenDV,
        giaTien: service.giaTien,
        moTa,
        maChiNhanh: service.maChiNhanh,
      };
      const res = await axiosInstance.put(`/admin/services/${service.maDV}`, payload);
      setService(res.data);
      notify("Đã cập nhật mô tả dịch vụ.", "success");
    } catch (err) {
      notify(err.response?.data?.message || "Không cập nhật được mô tả.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !service) {
    return <div className="min-h-screen bg-gray-100 py-24 text-center text-xl text-gray-600">Dang tai...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <button onClick={() => navigate("/customer/services")} className="mb-6 inline-flex items-center gap-2 font-semibold text-gray-700 hover:text-yellow-600">
          <ArrowLeft size={20} />
          Quay lai dich vu
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white sm:p-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-sm font-black text-gray-900">
              <Wrench size={16} />
              {service.maDV}
            </div>
            <h1 className="mb-4 text-3xl font-black sm:text-5xl">{service.tenDV}</h1>
            <div className="flex items-center gap-2 text-yellow-200">
              <Building size={18} />
              {service.tenChiNhanh || service.maChiNhanh || "Chua gan chi nhanh"}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="mb-3 text-xl font-black text-gray-900">Mo ta dich vu</h2>
              {canEdit ? (
                <div className="space-y-3">
                  <textarea
                    rows="7"
                    value={moTa}
                    onChange={(e) => setMoTa(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 leading-7 outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Nhap mo ta dich vu"
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
                <p className="leading-7 text-gray-700">
                  {service.moTa || "Dich vu chuyen nghiep, phu hop cho nhu cau kiem tra, bao duong va sua chua xe."}
                </p>
              )}
            </div>

            <div className="h-fit rounded-xl border border-yellow-200 bg-yellow-50 p-5">
              <p className="text-sm text-gray-600">Gia dich vu</p>
              <p className="mb-5 text-3xl font-black text-red-600">{Number(service.giaTien).toLocaleString("vi-VN")}đ</p>
              <a href="tel:0944799819" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-gray-900 hover:bg-yellow-500">
                <PhoneCall size={20} />
                Goi dat dich vu
              </a>
              <button
                onClick={() => navigate("/customer")}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-800 hover:bg-gray-50"
              >
                <CalendarDays size={20} />
                Dat lich sua xe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
