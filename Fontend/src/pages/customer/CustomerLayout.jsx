import { useState, useEffect } from 'react';
import TopBar from '../../components/layout/TopBar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FloatingButtons from '../../components/ui/FloatingButtons';

export default function CustomerLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
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