import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import AdmisionFooter from "@/components/layout/AdmisionFooter";
import AdmisionContent from "./AdmisionContent";
import LoadingSpinner from "@/components/LoadingSpinner";

// A01 – Access Control: forzar SSR para que la comprobación de configuración
// se ejecute en cada request y no quede cacheada con el valor antiguo.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Proceso de Admisión - CBT Núm. 5, María Amparo Viderique de Shein",
};

export default async function AdmisionPage() {
  // A01 – Broken Access Control: verificar en el servidor si la sección está
  // habilitada antes de renderizar. Si está deshabilitada → HTTP 404.
  // Esto impide acceso directo por URL aunque el link no aparezca en el navbar.
  const db = createServiceClient();
  const { data } = await db
    .from("site_config")
    .select("config")
    .eq("id", 1)
    .single();

  const config = data?.config as Record<string, unknown> | undefined;
  const secciones = (config?.secciones ?? {}) as Record<string, { enabled: boolean }>;

  // Priorizar secciones.admision.enabled; fallback a admision.habilitada
  const admisionEnabled =
    secciones?.admision?.enabled !== undefined
      ? secciones.admision.enabled
      : ((config?.admision as Record<string, unknown>)?.habilitada as boolean ?? true);

  if (!admisionEnabled) {
    notFound();
  }

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
