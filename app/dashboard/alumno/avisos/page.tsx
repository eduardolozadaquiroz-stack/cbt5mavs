"use client";
import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useRealtimeAvisos } from "@/hooks/useRealtimeAvisos";

const AVATAR = "";

export default function AvisosInternoPage() {
  const [filtro, setFiltro] = useState("Todos");
  const { avisos: allAvisos, loading, error } = useRealtimeAvisos("alumnos");

  const avisosFiltrados = filtro === "Todos"
    ? allAvisos
    : allAvisos.filter((a) => a.tipo === filtro.toLowerCase());

  const urgentes = allAvisos.filter((a) => a.tipo === "urgente").length;
  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        activeTopLink="avisos"
        linkBase="/dashboard/alumno"
      />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="inicio" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Page Header */}
          <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background">Avisos Institucionales</h1>
              <p className="text-on-surface-variant mt-unit">
                Comunicados oficiales del plantel para tu grupo.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-md py-sm bg-error-container text-on-error-container rounded-full text-label-bold font-label-bold text-sm">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                notifications_active
              </span>
              {urgentes} urgente{urgentes !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-sm mb-lg">
            {["Todos", "Urgente", "Académico", "Administrativo", "Institucional"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFiltro(tab)}
                className={`px-md py-unit rounded-full text-label-bold font-label-bold text-sm border transition-colors ${
                  filtro === tab
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Aviso cards */}
          <div className="flex flex-col gap-md">
            {loading && (
              <div className="text-center py-xl text-on-surface-variant">Cargando avisos...</div>
            )}
            {error && (
              <div className="rounded-lg bg-error-container text-on-error-container px-md py-sm">{error}</div>
            )}
            {!loading && avisosFiltrados.map((aviso) => (
              <article
                key={aviso.id}
                className="bg-surface border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-md md:p-lg flex flex-col gap-sm">
                  <div className="flex items-start justify-between gap-md flex-wrap">
                    <div className="flex items-center gap-sm flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-fixed text-on-primary-fixed capitalize">
                        {aviso.tipo}
                      </span>
                      <span className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {aviso.fecha_publicacion
                          ? new Date(aviso.fecha_publicacion).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })
                          : "Sin fecha"}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-title-sm text-title-sm text-on-surface">{aviso.titulo}</h2>
                  <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed">
                    {aviso.cuerpo}
                  </p>

                  {aviso.fotos.length > 0 && (
                    <div>
                      <div style={{ aspectRatio: "16/9" }} className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={aviso.fotos[0]} alt={aviso.titulo} className="w-full h-full object-cover" />
                      </div>
                      {aviso.fotos.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto mt-2">
                          {aviso.fotos.slice(1).map((url, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={i} src={url} alt="" className="h-16 w-16 rounded-lg object-cover flex-shrink-0 border border-outline-variant" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Banner de evento */}
                  {aviso.es_evento && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🗓️</span>
                        <h3 className="font-bold text-blue-900 dark:text-blue-200 text-sm">Información del Evento</h3>
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
                    <div className="flex flex-col gap-3">
                      {aviso.videos.map((url, i) => (
                        <video key={i} controls className="w-full rounded-xl bg-black" src={url}>
                          Tu navegador no soporta video HTML5.
                        </video>
                      ))}
                    </div>
                  )}

                  {/* PDFs */}
                  {(aviso.pdfs?.length ?? 0) > 0 && (
                    <div className="flex flex-col gap-2">
                      {aviso.pdfs.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600 flex-shrink-0">
                            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                          </svg>
                          <span className="text-sm font-medium text-red-700 dark:text-red-300 truncate">
                            {(() => { try { return decodeURIComponent(url.split("/").pop() ?? "documento.pdf"); } catch { return "documento.pdf"; } })()}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500 ml-auto flex-shrink-0">
                            <path d="M5 20h14v-2H5v2zm7-18L5.33 9h4.84v4h3.66V9h4.84L12 2z"/>
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {!loading && avisosFiltrados.length === 0 && (
              <div className="text-center py-xl text-on-surface-variant">No hay avisos en esta categoría.</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
