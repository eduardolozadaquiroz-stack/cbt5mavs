"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface Aviso {
  id: string;
  titulo: string;
  cuerpo: string;
  tipo: string;
  estado: string;
  fecha_publicacion: string | null;
  autor_id: string | null;
  fotos: string[];
  videos: string[];
  pdfs: string[];
  es_evento: boolean;
  evento_inicio: string | null;
  evento_fin: string | null;
  evento_lugar: string | null;
  evento_vestimenta: string | null;
  evento_enlace: string | null;
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
                    {aviso.fotos && aviso.fotos.length > 0 && (
                      <div style={{ aspectRatio: "16/9" }} className="overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={aviso.fotos[0]} alt={aviso.titulo} className="w-full h-full object-cover" />
                      </div>
                    )}
                    {aviso.fotos && aviso.fotos.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto px-md pt-2">
                        {aviso.fotos.slice(1).map((url: string, i: number) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={url} alt="" className="h-14 w-14 rounded-lg object-cover flex-shrink-0 border border-slate-200" />
                        ))}
                      </div>
                    )}
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
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{aviso.cuerpo}</p>

                      {/* Banner de evento */}
                      {aviso.es_evento && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🗓️</span>
                            <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm">Información del Evento</h4>
                          </div>
                          {aviso.evento_inicio && (
                            <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">
                              📅 <strong>Inicio:</strong>{" "}
                              {new Date(aviso.evento_inicio).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })} ·{" "}
                              {new Date(aviso.evento_inicio).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                          {aviso.evento_fin && (
                            <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">
                              📅 <strong>Fin:</strong>{" "}
                              {new Date(aviso.evento_fin).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })} ·{" "}
                              {new Date(aviso.evento_fin).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                          {aviso.evento_lugar && <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">📍 {aviso.evento_lugar}</p>}
                          {aviso.evento_vestimenta && <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">👔 <strong>Vestimenta:</strong> {aviso.evento_vestimenta}</p>}
                          {aviso.evento_enlace && (
                            <a href={aviso.evento_enlace} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-1 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline">
                              🔗 Ver más información
                            </a>
                          )}
                        </div>
                      )}

                      {/* Videos */}
                      {(aviso.videos?.length ?? 0) > 0 && (
                        <div className="flex flex-col gap-3 mt-3">
                          {aviso.videos.map((url: string, i: number) => (
                            <video key={i} controls className="w-full rounded-xl bg-black" src={url}>
                              Tu navegador no soporta video HTML5.
                            </video>
                          ))}
                        </div>
                      )}

                      {/* PDFs */}
                      {(aviso.pdfs?.length ?? 0) > 0 && (
                        <div className="flex flex-col gap-2 mt-3">
                          {aviso.pdfs.map((url: string, i: number) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600 flex-shrink-0">
                                <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                              </svg>
                              <span className="text-sm font-medium text-red-700 dark:text-red-300 truncate">
                                {(() => { try { return decodeURIComponent(url.split("/").pop() ?? "documento.pdf"); } catch { return "documento.pdf"; } })()}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
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

