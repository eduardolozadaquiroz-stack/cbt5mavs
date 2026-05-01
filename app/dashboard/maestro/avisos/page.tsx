"use client";
import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEzpJcll0X5d9jtID0KZQY9DQZRRq2urTYr7OTdd5wbN3bwTITJS_udArelmyFwKHp52jZMTZigPK27koZBzrOk8apUTBoENBTNSQ_9UV341OiiIG2ayvR2P6RSKF_-zlJhwraxvKTWP30vx0XqFtP3QHDJZtZ5q0FsLnV0k_-5Y9u3x3nfcJe2qD7R3eQk7iDmNl6Al0VZjLNgQ06SdDzzwjB1yyZU_u4Aiu24ZTFsCj_CbalIFeIYzf8-mCoS4Y8hn9Ux-Vpjacf";

type TipoAviso = "Urgente" | "Académico" | "Administrativo" | "Institucional";

const TIPO_STYLE: Record<TipoAviso, string> = {
  Urgente:        "bg-error-container text-on-error-container",
  Académico:      "bg-primary-fixed text-on-primary-fixed",
  Administrativo: "bg-surface-container text-primary",
  Institucional:  "bg-secondary-fixed text-on-secondary-fixed",
};

const AVISOS: {
  id: number;
  tipo: TipoAviso;
  fecha: string;
  titulo: string;
  cuerpo: string;
  firmado: string;
  leido: boolean;
}[] = [
  {
    id: 1,
    tipo: "Urgente",
    fecha: "29 de abril de 2026",
    titulo: "Cierre de captura de calificaciones — Tercer Parcial",
    cuerpo:
      "Se les recuerda a todos los docentes que el sistema de captura de calificaciones del Tercer Parcial cerrará el próximo 3 de mayo a las 14:00 hrs. Cualquier calificación no registrada antes de esa hora quedará como No Presentado.",
    firmado: "Dirección Académica",
    leido: false,
  },
  {
    id: 2,
    tipo: "Académico",
    fecha: "27 de abril de 2026",
    titulo: "Entrega de rúbricas y evidencias de aprendizaje",
    cuerpo:
      "Se solicita a los docentes entregar en la Coordinación Académica las rúbricas y evidencias de aprendizaje del 3er Parcial a más tardar el 5 de mayo. El formato se encuentra disponible en el portal institucional.",
    firmado: "Coordinación Académica",
    leido: false,
  },
  {
    id: 3,
    tipo: "Institucional",
    fecha: "25 de abril de 2026",
    titulo: "Festejo Día del Maestro — 15 de mayo",
    cuerpo:
      "El plantel organizará un evento especial el 15 de mayo en el auditorio escolar a las 10:00 hrs para celebrar el Día del Maestro. No habrá clases ese día. Se invita a todo el personal docente y administrativo a asistir.",
    firmado: "Dirección General",
    leido: true,
  },
  {
    id: 4,
    tipo: "Administrativo",
    fecha: "22 de abril de 2026",
    titulo: "Actualización de datos en el sistema SIGEEMS",
    cuerpo:
      "Se exhorta a todos los docentes a verificar y actualizar sus datos personales, grado académico y carga horaria en el sistema SIGEEMS antes del 30 de abril. El acceso está disponible en el portal estatal.",
    firmado: "Subdirección Administrativa",
    leido: true,
  },
  {
    id: 5,
    tipo: "Académico",
    fecha: "18 de abril de 2026",
    titulo: "Reunión de Academia por Área — 6 de mayo",
    cuerpo:
      "Se convoca a reunión de academia por áreas de conocimiento el próximo 6 de mayo a las 09:00 hrs en las instalaciones del plantel. La asistencia es obligatoria. Por favor confirmar asistencia a más tardar el 4 de mayo.",
    firmado: "Jefatura de Área",
    leido: true,
  },
];

export default function AvisosMaestroPage() {
  const [filtro, setFiltro] = useState("Todos");
  const noLeidos = AVISOS.filter((a) => !a.leido).length;
  const avisosFiltrados = filtro === "Todos" ? AVISOS : AVISOS.filter((a) => a.tipo === filtro);

  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        activeTopLink="avisos"
        linkBase="/dashboard/maestro"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="inicio" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[900px] mx-auto p-md lg:p-lg">

            {/* Header */}
            <div className="mb-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
                  Avisos
                  {noLeidos > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-error text-on-error text-[10px] font-bold">
                      {noLeidos}
                    </span>
                  )}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Comunicados y notificaciones del plantel para el personal docente.
                </p>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap mb-lg">
              {(["Todos", "Urgente", "Académico", "Administrativo", "Institucional"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFiltro(tab)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                    filtro === tab
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-white border-outline-variant text-on-surface hover:bg-surface-container-lowest"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Aviso cards */}
            <div className="flex flex-col gap-md">
              {avisosFiltrados.map((aviso) => (
                <div
                  key={aviso.id}
                  className={`bg-white border rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all ${
                    !aviso.leido ? "border-l-4 border-l-primary border-outline-variant" : "border-outline-variant"
                  }`}
                >
                  <div className="p-md">
                    <div className="flex items-start justify-between gap-4 mb-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${TIPO_STYLE[aviso.tipo]}`}>
                          {aviso.tipo}
                        </span>
                        {!aviso.leido && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
                            Nuevo
                          </span>
                        )}
                        <span className="text-xs text-on-surface-variant">{aviso.fecha}</span>
                      </div>
                    </div>

                    <h3 className="font-title-sm text-title-sm text-on-surface mb-sm">{aviso.titulo}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-md">
                      {aviso.cuerpo}
                    </p>

                    <div className="flex items-center justify-between pt-sm border-t border-outline-variant">
                      <p className="text-xs text-on-surface-variant italic">Firmado: {aviso.firmado}</p>
                      {!aviso.leido && (
                        <button className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>done</span>
                          Marcar como leído
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
