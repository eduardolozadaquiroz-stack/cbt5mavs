"use client";
import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useRealtimeAvisos } from "@/hooks/useRealtimeAvisos";

const AVATAR = "";

export default function AvisosInternoPage() {
  const [filtro, setFiltro] = useState("Todos");
  const { avisos: allAvisos, loading, error } = useRealtimeAvisos();

  const avisosFiltrados = filtro === "Todos"
    ? allAvisos
    : allAvisos.filter((a) => a.tipo === filtro);

  const urgentes = allAvisos.filter((a) => a.tipo === "urgente" || a.tipo === "Urgente").length;
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
                        {new Date(aviso.fecha_publicacion).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-title-sm text-title-sm text-on-surface">{aviso.titulo}</h2>
                  <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed">
                    {aviso.contenido}
                  </p>

                  {aviso.imagen_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={aviso.imagen_url} alt={aviso.titulo} className="rounded-lg max-h-64 object-cover w-full" />
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
