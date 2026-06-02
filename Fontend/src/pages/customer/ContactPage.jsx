import ContactSection from "../../components/sections/ContactSection";

export default function ContactPage() {
  return (
    <main className="bg-slate-950">
      <section className="border-b border-white/10 bg-slate-950 px-4 py-10 sm:py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-yellow-300">
            Liên hệ
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Kết nối với garage
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Gửi yêu cầu, đặt lịch hoặc liên hệ trực tiếp qua form hỗ trợ.
          </p>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
