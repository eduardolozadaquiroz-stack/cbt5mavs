import Navbar from "@/components/layout/Navbar";
import AdmisionFooter from "@/components/layout/AdmisionFooter";
import AdmisionContent from "./AdmisionContent";
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
        <AdmisionContent />
      </main>
      <AdmisionFooter />
    </>
  );
}
