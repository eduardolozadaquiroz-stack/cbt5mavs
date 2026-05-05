"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface Aviso {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string;
  estado: string;
  fecha_publicacion: string | null;
  autor_id: string | null;
}

const TIPO_STYLE: Record<string, string> = {
  urgente:        "bg-error-container text-on-error-container",
  academico:      "bg-primary-fixed text-on-primary-fixed",
  administrativo: "bg-surface-container text-primary",
  institucional:  "bg-secondary-fixed text-on-secondary-fixed",
};

const FILTROS = ["Todos", "urgente", "academico", "administrativo", "institucional"];

export default function AvisosMaestroPage() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    fetch("/api/avisos?para=maestros")
      .then((r) => r.json())
      .then((d) => {
        setAvisos(d.avisos ?? []);
        setLoading(false);
      });
  }, []);

  const avisosFiltrados = filtro === "Todos"
    ? avisos
    : avisos.filter((a) => a.tipo === filtro);

  return (
    <>
      <DashboardTopbar userImageAlt="Maestro" activeTopLink="avisos" linkBase="/dashboard/maestro" />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="inicio" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[900px] mx-auto p-md lg:p-lg">

            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-background">Avisos</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Comunicados y notificaciones del plantel.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap mb-lg">
              {FILTROS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFiltro(tab)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                    filtro === tab
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-white border-outline-variant text-on-surface hover:bg-surface-container-lowest"
                  }`}
                >
                  {tab === "Todos" ? "Todos" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-sm text-on-surface-variant">Cargando avisos…</p>
            ) : avisosFiltrados.length === 0 ? (
              <div className="bg-surface-container-high border border-outline-variant rounded-xl p-lg text-center">
                <p className="text-on-surface-variant">No hay avisos disponibles.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-md">
                {avisosFiltrados.map((aviso) => (
                  <div key={aviso.id} className="bg-white border border-outline-variant rounded-lg shadow-sm overflow-hidden">
                    <div className="p-md">
                      <div className="flex items-start justify-between gap-4 mb-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${TIPO_STYLE[aviso.tipo] ?? "bg-surface-variant text-on-surface-variant"}`}>
                            {aviso.tipo}
                          </span>
                          {aviso.fecha_publicacion && (
                            <span className="text-xs text-on-surface-variant">
                              {new Date(aviso.fecha_publicacion).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="font-title-sm text-title-sm text-on-surface mb-sm">{aviso.titulo}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{aviso.contenido}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}

