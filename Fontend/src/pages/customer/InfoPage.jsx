import AboutSection from "../../components/sections/AboutSection";

export default function InfoPage() {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white px-4 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-yellow-700">
            Thông tin
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Giới thiệu Garage
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Tổng quan về mô hình vận hành, quy trình làm việc và cách hệ thống hỗ trợ khách hàng.
          </p>
        </div>
      </section>
      <AboutSection />
    </main>
  );
}
