import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

const accentClass = {
  indigo: "text-indigo-600 bg-indigo-50",
  green: "text-green-600 bg-green-50",
  yellow: "text-yellow-700 bg-yellow-50",
};

export default function CollapsibleFilter({
  title = "Bộ lọc",
  icon: Icon = Filter,
  accent = "indigo",
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const tone = accentClass[accent] || accentClass.indigo;

  return (
    <section className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
            <Icon size={22} />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-bold text-gray-800">{title}</span>
            <span className="block text-sm text-gray-500">
              {open ? "Nhấn để thu gọn" : "Nhấn để mở bộ lọc"}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="border-t border-gray-100 p-5">{children}</div>}
    </section>
  );
}
