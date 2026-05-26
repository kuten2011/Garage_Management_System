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

  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [currentView]);

  return (
    <div className="home-page min-h-screen bg-white">
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
