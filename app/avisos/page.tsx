import Navbar from "@/components/layout/Navbar";
import AvisosFooter from "@/components/layout/AvisosFooter";
import AvisosHeader from "@/components/sections/AvisosHeader";
import AvisosGrid from "@/components/sections/AvisosGrid";
import AvisosPagination from "@/components/sections/AvisosPagination";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AvisosPage() {
  return (
    <>
      <LoadingSpinner duration={3000} />
      <Navbar activePage="avisos" />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-8 py-12 flex flex-col gap-8">
        <AvisosHeader />
        <AvisosGrid />
        <AvisosPagination />
      </main>
      <AvisosFooter />
    </>
  );
}
