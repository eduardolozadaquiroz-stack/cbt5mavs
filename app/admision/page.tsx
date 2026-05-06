import Navbar from "@/components/layout/Navbar";
import AdmisionFooter from "@/components/layout/AdmisionFooter";
import AdmisionContent from "./AdmisionContent";

export const metadata = {
  title: "Proceso de Admisión - CBT Núm. 5, María Amparo Viderique de Shein",
};

export default function AdmisionPage() {
  return (
    <>
      <Navbar activePage="admision" />
      <main className="flex-grow w-full flex flex-col pb-12 lg:pb-16">
        <AdmisionContent />
      </main>
      <AdmisionFooter />
    </>
  );
}
