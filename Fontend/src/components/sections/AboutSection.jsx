import { Award, ChevronRight, Settings, UsersRound } from "lucide-react";

const strengths = [
  "Đội ngũ kỹ thuật viên có kinh nghiệm thực tế",
  "Quy trình tiếp nhận, sửa chữa và thanh toán rõ ràng",
  "Lưu lịch sử xe, phiếu sửa và trạng thái ngay trên hệ thống",
];

const highlights = [
  { label: "Kỹ thuật viên", value: "12+", icon: UsersRound },
  { label: "Quy trình kiểm tra", value: "6 bước", icon: Settings },
  { label: "Cam kết dịch vụ", value: "Rõ ràng", icon: Award },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="relative" data-reveal>
          <img
            src="https://i.imgur.com/Rw8gANO.jpeg"
            alt="Garage Web Garage"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl"
          />
          <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-slate-950/85 p-5 text-white shadow-2xl backdrop-blur">
            <p className="text-sm font-semibold text-yellow-300">Không chỉ sửa xe</p>
            <p className="mt-1 text-xl font-black">Quản lý dịch vụ minh bạch từ lúc đặt lịch đến khi hoàn tất.</p>
          </div>
        </div>

        <div data-reveal>
          <div className="mb-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
            Về Web Garage
          </div>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Một garage có trải nghiệm số, không chỉ là quầy tiếp nhận.
          </h2>
          <p className="mt-5 leading-8 text-slate-600">
            Web Garage tập trung vào sự rõ ràng: khách hàng biết mình đã đặt lịch gì,
            xe đang ở trạng thái nào và các dịch vụ/phụ tùng được sử dụng ra sao.
          </p>

          <div className="mt-6 space-y-3">
            {strengths.map((text) => (
              <div key={text} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <ChevronRight className="mt-0.5 flex-shrink-0 text-yellow-500" size={20} />
                <span className="text-sm font-semibold text-slate-700">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
                  data-reveal
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <Icon className="mb-3 text-emerald-600" size={22} />
                  <p className="font-black text-slate-900">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
