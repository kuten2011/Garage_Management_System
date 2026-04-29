import { MapPin, Phone, Mail, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">GARAGE Ô TÔ KUTEN</h3>
            <p className="mb-2 flex items-start gap-2 text-sm">
              <MapPin size={16} className="mt-1 flex-shrink-0" />
              <span>Xã Đức Hòa Đông, Huyện Đức Hòa, Tỉnh Long An</span>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Liên hệ</h3>
            <p className="mb-2 flex items-center gap-2 text-sm">
              <Phone size={16} />
              <span>09477.799.819 - 0918.627.773</span>
            </p>
            <p className="mb-2 flex items-center gap-2 text-sm">
              <Mail size={16} />
              <span>khoavo006@gmail.com</span>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Kết nối với chúng tôi</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/attack.237" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <Facebook size={20} />
              </a>
              <a href="https://zalo.me/0944799819" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; 2025 Web Garage. All Design By Kuten.</p>
        </div>
      </div>
    </footer>
  );
}