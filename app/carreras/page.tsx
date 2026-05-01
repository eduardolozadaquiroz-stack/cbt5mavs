import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CarrerasHeroSection from "@/components/sections/CarrerasHeroSection";
import CareersList from "@/components/sections/CareersList";
import LoadingSpinner from "@/components/LoadingSpinner";

export const metadata = {
  title: "Oferta Educativa Técnica - CBT Núm. 5, María Amparo Viderique de Shein",
};

export default function CarrerasPage() {
  return (
    <>
      <LoadingSpinner duration={3000} />
      <Navbar activePage="carreras" />
      <main className="w-full max-w-container-max mx-auto px-md lg:px-lg py-xl">
        <CarrerasHeroSection />
        <CareersList />
      </main>
      <Footer />
    </>
  );
}
