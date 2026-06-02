import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const iconMap = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type = "info" } = event.detail || {};
      if (!message) return;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const toast = { id, message, type };
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 3200);
    };

    window.addEventListener("app-toast", handleToast);
    return () => window.removeEventListener("app-toast", handleToast);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[min(92vw,22rem)] flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || Info;
        const tone =
          toast.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-900"
              : "border-slate-200 bg-white text-slate-900";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl ${tone}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 text-sm font-medium leading-6">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
              className="shrink-0 text-current/60 transition hover:text-current"
              aria-label="Đóng thông báo"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
