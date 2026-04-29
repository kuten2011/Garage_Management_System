import { Phone, MapPin } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-red-700 text-white py-2 text-sm">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="text-xs md:text-sm">Đức Hòa Đông, Đức Hòa, Long An</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} />
          <span className="font-semibold">Hotline: 0944799819</span>
        </div>
      </div>
    </div>
  );
}