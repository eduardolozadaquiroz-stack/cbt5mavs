import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";
import Navbar from "@/components/layout/Navbar";
import ContactoFooter from "@/components/layout/ContactoFooter";
import ContactoHeader from "@/components/sections/ContactoHeader";
import ContactoForm from "@/components/sections/ContactoForm";
import ContactoInfoGrid from "@/components/sections/ContactoInfoGrid";
import ContactoMap from "@/components/sections/ContactoMap";
import LoadingSpinner from "@/components/LoadingSpinner";

// ISR: revalidar estado de la sección cada 30 s.
export const revalidate = 30;

export default async function ContactoPage() {
  if (!(await isSectionEnabled("contacto"))) notFound();
  return (
    <>
      <LoadingSpinner duration={3000} />
      <Navbar activePage="contacto" />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-lg py-xl flex flex-col gap-xl">
        <ContactoHeader />

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg lg:gap-xl items-start">
          <ContactoForm />

          {/* Right column */}
          <div className="lg:col-span-7 flex flex-col gap-lg">
            <ContactoInfoGrid />
            <ContactoMap />
          </div>
        </div>
      </main>
      <ContactoFooter />
    </>
  );
}
