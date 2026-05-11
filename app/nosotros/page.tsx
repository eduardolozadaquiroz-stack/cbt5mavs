import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";
import NosotrosContent from "./NosotrosContent";

// ISR: revalidar estado de la seccion cada 30 s.
export const revalidate = 30;

export const metadata = {
  title: "Quienes somos - CBT Num. 5, Maria Amparo Viderique de Shein",
};

export default async function NosotrosPage() {
  // A01 - Access Control: bloquear acceso si la seccion esta deshabilitada
  if (!(await isSectionEnabled("nosotros"))) notFound();

  return <NosotrosContent />;
}
