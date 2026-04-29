import { ChevronRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <img
              src="https://i.imgur.com/Rw8gANO.jpeg"
              alt="Garage"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Giới thiệu về Web Garage</h2>
            <div className="w-20 h-1 bg-yellow-400 mb-6"></div>
            <p className="text-gray-600 mb-4">
              Web Garage tự hào là gara ô tô chuyên nghiệp hàng đầu, cung cấp đầy đủ dịch vụ sửa chữa, bảo dưỡng, làm đẹp xe.
            </p>
            <p className="text-gray-600 mb-4">
              Với đội ngũ kỹ thuật viên nhiều năm kinh nghiệm và thiết bị hiện đại, chúng tôi cam kết mang đến sự hài lòng tuyệt đối cho khách hàng.
            </p>
            <ul className="space-y-2">
              {['Đội ngũ kỹ thuật viên chuyên nghiệp', 'Cơ sở vật chất hiện đại', 'Giá cả hợp lý, dịch vụ tận tâm'].map((text, i) => (
                <li key={i} className="flex items-center gap-2">
                  <ChevronRight className="text-yellow-400" size={20} />
                  <span className="text-gray-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}