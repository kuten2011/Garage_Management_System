export default function HeroSection() {
  return (
    <section id="home" className="relative h-[500px] bg-cover bg-center"
      style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=1600&h=500&fit=crop')"}}>
      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
        <div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-yellow-400 mb-4">
            Gara Ô Tô Web Garage
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl text-gray-200 mb-6">
            Dịch vụ sửa chữa, bảo dưỡng, sơn xe chuyên nghiệp – Uy tín – Tận tâm
          </p>
          <a href="#contact" className="inline-block bg-yellow-400 text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-yellow-500 transition">
            Đặt lịch ngay
          </a>
        </div>
      </div>
    </section>
  );
}