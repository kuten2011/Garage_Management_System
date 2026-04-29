import { useState, useEffect } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from '../ui/FloatingButtons';

export default function CustomerLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header isScrolled={isScrolled} />
      {children}
      <FloatingButtons />
      <Footer />
    </div>
  );
}