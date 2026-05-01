import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import MetricsSection from "@/components/sections/MetricsSection";
import CareersSection from "@/components/sections/CareersSection";
import CTASection from "@/components/sections/CTASection";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function InicioPage() {
  return (
    <>
      <LoadingSpinner duration={3000} />
      <Navbar activePage="inicio" />
      <main className="flex-grow">
        <HeroSection />
        <MetricsSection />
        <CareersSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
