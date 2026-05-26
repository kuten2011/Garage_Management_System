import { Phone, MessageCircle, Bot, X } from "lucide-react";
import Chatbot from "../chatbot/ChatBotComponent.jsx";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function FloatingButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  // Ẩn toàn bộ floating buttons khi ở trang admin
  const isAdminPage = location.pathname.startsWith("/admin");
  if (isAdminPage) return null;

  return (
    <>
      <div className="fixed right-3 bottom-4 flex flex-col gap-3 z-50 sm:right-6 sm:bottom-6 sm:gap-4">
        {/* Nút Gọi điện & Chat Zalo */}
        <div className="flex flex-col gap-4">
          <a
            href="tel:0944799819"
            className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-red-700 transition-all hover:scale-110 animate-pulse sm:h-14 sm:w-14"
            aria-label="Gọi ngay"
          >
            <Phone size={28} />
          </a>

          <a
            href="https://zalo.me/0944799819"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:from-green-600 hover:to-emerald-700 transition-all hover:scale-110 sm:h-14 sm:w-14"
            aria-label="Chat Zalo"
          >
            <MessageCircle size={28} />
          </a>

          {/* Nút Chatbot AI */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 sm:h-14 sm:w-14 ${
              isChatOpen
                ? "bg-gray-700 hover:bg-gray-800"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 animate-bounce"
            }`}
            aria-label="Chat với trợ lý AI"
          >
            {isChatOpen ? <X size={28} /> : <Bot size={28} />}
          </button>
        </div>
      </div>

      {/* Popup Chatbot */}
      {isChatOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="fixed inset-x-3 bottom-20 z-50 h-[min(620px,calc(100vh-6rem))] bg-white rounded-2xl shadow-3xl border border-gray-200 overflow-hidden flex flex-col sm:inset-x-auto sm:bottom-28 sm:right-6 sm:w-96">
            <Chatbot onClose={() => setIsChatOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
