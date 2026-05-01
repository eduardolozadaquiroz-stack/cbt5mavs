import Navbar from "@/components/layout/Navbar";
import AdmisionFooter from "@/components/layout/AdmisionFooter";
import AdmisionHeroSection from "@/components/sections/AdmisionHeroSection";
import AdmisionStepsSection from "@/components/sections/AdmisionStepsSection";
import AdmisionRequirementsSection from "@/components/sections/AdmisionRequirementsSection";
import AdmisionFAQSection from "@/components/sections/AdmisionFAQSection";
import LoadingSpinner from "@/components/LoadingSpinner";

export const metadata = {
  title: "Proceso de Admión - CBT Núm. 5, María Amparo Viderique de Shein",
};

export default function AdmisionPage() {
  return (
    <>
      <LoadingSpinner duration={3000} />
      <Navbar activePage="admision" />
      <main className="w-full flex flex-col pb-xl">
        <AdmisionHeroSection />
        <AdmisionStepsSection />
        <AdmisionRequirementsSection />
        <AdmisionFAQSection />
      </main>
      <AdmisionFooter />
    </>
  );
}
