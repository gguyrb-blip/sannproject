import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertiesSection from "@/components/PropertiesSection";
import AboutSection from "@/components/AboutSection";
import GalleryStrip from "@/components/GalleryStrip";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import StickyBookingBar from "@/components/StickyBookingBar";
import LineFloat from "@/components/LineFloat";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PropertiesSection />
        <AboutSection />
        <GalleryStrip />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <LineFloat />
      <StickyBookingBar />
      <RevealOnScroll />
    </>
  );
}
