import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";
import AvisosContent from "./AvisosContent";

// ISR: revalidar estado de la seccion cada 30 s.
export const revalidate = 30;

export const metadata = {
  title: "Avisos - CBT Num. 5, Maria Amparo Viderique de Shein",
};

export default async function AvisosPage() {
  // A01 - Access Control: bloquear acceso si la seccion esta deshabilitada
  if (!(await isSectionEnabled("avisos"))) notFound();

  return <AvisosContent />;
}
