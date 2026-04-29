import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import ProductsSection from '../components/sections/ProductsSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/layout/Footer';
import FloatingButtons from '../components/ui/FloatingButtons';

export default function GarageWebsite() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header isScrolled={isScrolled} currentView={currentView} setCurrentView={setCurrentView} />

      {currentView === 'home' && (
        <>
          <HeroSection />
          <ServicesSection />
          <ProductsSection />
          <AboutSection />
          <ContactSection />
          <FloatingButtons />
        </>
      )}

      <Footer />
    </div>
  );
}