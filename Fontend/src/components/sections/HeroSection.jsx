import { ArrowRight, CalendarCheck, Gauge, ShieldCheck, Sparkles, Wrench } from "lucide-react";

const stats = [
  { label: "Xe đã phục vụ", value: "2.500+", icon: Wrench },
  { label: "Đặt lịch nhanh", value: "24/7", icon: CalendarCheck },
  { label: "Bảo hành rõ ràng", value: "100%", icon: ShieldCheck },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="home-hero relative min-h-[calc(100vh-96px)] overflow-hidden bg-slate-950 text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,6,23,0.92) 0%, rgba(15,23,42,0.72) 48%, rgba(15,23,42,0.28) 100%), url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1800&h=1100&fit=crop')",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl" data-reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-white/10 px-4 py-2 text-sm font-semibold text-yellow-200 backdrop-blur">
            <Sparkles size={18} />
            Garage chăm xe hiện đại tại Long An
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl">
            Chăm sóc xe gọn gàng, rõ tiến độ, đúng hẹn.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Đặt lịch sửa chữa, theo dõi phiếu sửa, chọn dịch vụ và phụ tùng ngay trên web.
            Mọi thông tin được quản lý tập trung để khách hàng dễ kiểm tra.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-4 font-bold text-slate-950 shadow-xl shadow-yellow-500/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              Đặt lịch ngay
              <ArrowRight size={20} className="transition group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-4 font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Xem dịch vụ
            </a>
          </div>

          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="home-stat-panel border border-white/15 bg-white/10 p-4 backdrop-blur"
                  data-reveal
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <Icon className="mb-3 text-yellow-300" size={24} />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 right-4 hidden max-w-xs rounded-2xl border border-white/15 bg-slate-950/55 p-5 shadow-2xl backdrop-blur lg:block home-float">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
              <Gauge size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-300">Quy trình kiểm tra</p>
              <p className="text-lg font-bold">Nhanh, minh bạch, có lịch sử</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
