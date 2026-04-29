import HeroSection from '../../components/sections/HeroSection';
import ServicesSection from '../../components/sections/ServicesSection';
import ProductsSection from '../../components/sections/ProductsSection';
import AboutSection from '../../components/sections/AboutSection';
import ContactSection from '../../components/sections/ContactSection';

export default function HomeContent() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}