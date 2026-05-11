import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CarrerasHeroSection from "@/components/sections/CarrerasHeroSection";
import CareersList from "@/components/sections/CareersList";
import LoadingSpinner from "@/components/LoadingSpinner";

// ISR: revalidar el estado de la sección cada 30 s.
// Cambios del admin se reflejan en ≤30 s sin sacrificar rendimiento.
export const revalidate = 30;

export const metadata = {
  title: "Oferta Educativa Técnica - CBT Núm. 5, María Amparo Viderique de Shein",
};

export default async function CarrerasPage() {
  // A01 – Access Control: verificar en servidor si la sección está habilitada
  if (!(await isSectionEnabled("carreras"))) notFound();
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
