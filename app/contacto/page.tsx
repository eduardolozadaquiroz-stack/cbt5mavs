import Navbar from "@/components/layout/Navbar";
import ContactoFooter from "@/components/layout/ContactoFooter";
import ContactoHeader from "@/components/sections/ContactoHeader";
import ContactoForm from "@/components/sections/ContactoForm";
import ContactoInfoGrid from "@/components/sections/ContactoInfoGrid";
import ContactoMap from "@/components/sections/ContactoMap";

export default function ContactoPage() {
  return (
    <>
      <Navbar activePage="contacto" />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-16 lg:py-20 flex flex-col gap-12 lg:gap-16">
        <ContactoHeader />

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <ContactoForm />

          {/* Right column */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8">
            <ContactoInfoGrid />
            <ContactoMap />
          </div>
        </div>
      </main>
      <ContactoFooter />
    </>
  );
}
