"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import AvisosFooter from "@/components/layout/AvisosFooter";
import AvisosHeader from "@/components/sections/AvisosHeader";
import AvisosGrid from "@/components/sections/AvisosGrid";
import AvisosPagination from "@/components/sections/AvisosPagination";
import LoadingSpinner from "@/components/LoadingSpinner";

const LIMIT = 6;

export default function AvisosPage() {
  const [tipo,  setTipo]  = useState("");
  const [page,  setPage]  = useState(1);
  const [total, setTotal] = useState(0);

  const handleTipo = (t: string) => { setTipo(t); setPage(1); };
  const handleTotal = useCallback((t: number) => setTotal(t), []);

  return (
    <>
      <LoadingSpinner duration={3000} />
      <Navbar activePage="avisos" />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-8 py-12 flex flex-col gap-8">
        <AvisosHeader tipo={tipo} onTipoChange={handleTipo} />
        <AvisosGrid   tipo={tipo} page={page} onTotal={handleTotal} />
        <AvisosPagination page={page} total={total} limit={LIMIT} onPage={setPage} />
      </main>
      <AvisosFooter />
    </>
  );
}

