"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Aviso {
  id: string;
  titulo: string;
  cuerpo: string;
  tipo: string;
  activo: boolean;
  fotos: string[];
  videos: string[];
  pdfs: string[];
  fecha_publicacion: string | null;
  es_evento: boolean;
  evento_inicio: string | null;
  evento_fin: string | null;
  evento_lugar: string | null;
  evento_vestimenta: string | null;
  evento_enlace: string | null;
}

const TIPO_LABEL: Record<string, string> = {
  urgente:        "Urgente",
  academico:      "Académico",
  administrativo: "Administrativo",
  institucional:  "Institucional",
  sistema:        "Sistema",
};

const TIPO_CLASS: Record<string, string> = {
  urgente:        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  academico:      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  administrativo: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  institucional:  "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  sistema:        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

export default function PadresAvisosPage() {
  const [avisos, setAvisos]       = useState<Aviso[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [filtro, setFiltro]       = useState("todos");
  const router = useRouter();

  useEffect(() => {
    // Verificar sesión padre
    const alumnoId = sessionStorage.getItem("selectedAlumnoId");
    if (!alumnoId) { router.replace("/dashboard/padres/seleccionar-alumno"); return; }

    fetch("/api/avisos?limit=50&para=padres", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) { router.replace("/login"); return null; }
        return r.json();
      })
      .then((json) => {
        if (!json) return;
        if (!json.avisos) { setError(json.error ?? "Error al cargar avisos"); return; }
        setAvisos(json.avisos);
      })
      .catch(() => setError("Error de red"))
      .finally(() => setLoading(false));
  }, [router]);

  const tipos = [...new Set(avisos.map((a) => a.tipo))];

  const lista = filtro === "todos"
    ? avisos
    : avisos.filter((a) => a.tipo === filtro);

  const urgentes = avisos.filter((a) => a.tipo === "urgente");

  if (loading) return <LoadingSpinner duration={3000} />;

  return (
    <>
      <DashboardTopbar userImageAlt="Padre de familia" activeTopLink="avisos" linkBase="/dashboard/padres" />
      <div className="flex flex-1 pt-16">
        <DashboardSidebar activeLink="avisos" headerVariant="simple" linkBase="/dashboard/padres" />
        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Header */}
          <div className="mb-lg">
            <h1 className="font-display-lg text-display-lg text-on-background mb-1">Avisos del Plantel</h1>
            <p className="font-body-base text-body-base text-on-surface-variant">
              Comunicados y notificaciones de CBT Núm. 5
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-red-700 dark:text-red-300 text-sm mb-lg">
              {error}
            </div>
          )}

          {/* Avisos urgentes destacados */}
          {urgentes.length > 0 && (
            <div className="mb-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-md">
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                <h2 className="font-title-sm text-title-sm text-red-800 dark:text-red-300">Avisos Urgentes</h2>
              </div>
              <div className="flex flex-col gap-2">
                {urgentes.map((a) => (
                  <div key={a.id} className="bg-white dark:bg-red-950/30 rounded-lg p-3 border border-red-100 dark:border-red-800">
                    <p className="font-semibold text-sm text-red-900 dark:text-red-200">{a.titulo}</p>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">{a.cuerpo}</p>
                    {a.fecha_publicacion && (
                      <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                        {new Date(a.fecha_publicacion).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtros */}
          {tipos.length > 1 && (
            <div className="mb-md flex flex-wrap gap-2">
              <button
                onClick={() => setFiltro("todos")}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filtro === "todos" ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container"}`}
              >
                Todos ({avisos.length})
              </button>
              {tipos.map((t) => (
                <button
                  key={t}
                  onClick={() => setFiltro(t)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filtro === t ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container"}`}
                >
                  {TIPO_LABEL[t] ?? t} ({avisos.filter((a) => a.tipo === t).length})
                </button>
              ))}
            </div>
          )}

          {/* Lista de avisos */}
          {lista.length === 0 ? (
            <div className="bg-surface border border-outline-variant rounded-xl px-md py-xl text-center text-on-surface-variant font-body-base text-body-base">
              No hay avisos publicados.
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              {lista.map((a) => (
                <div key={a.id} className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                  {a.fotos.length > 0 && (
                    <div style={{ aspectRatio: "16/9" }} className="overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.fotos[0]} alt={a.titulo} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {a.fotos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto px-md pt-2">
                      {a.fotos.slice(1).map((url, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={url} alt="" className="h-14 w-14 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700" />
                      ))}
                    </div>
                  )}
                  <div className="p-md">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${TIPO_CLASS[a.tipo] ?? "bg-surface-container text-on-surface"}`}>
                        {TIPO_LABEL[a.tipo] ?? a.tipo}
                      </span>
                      {a.fecha_publicacion && (
                        <span className="text-xs text-on-surface-variant">
                          {new Date(a.fecha_publicacion).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    <h3 className="font-title-sm text-title-sm text-on-surface mb-1">{a.titulo}</h3>
                    <p className="font-body-base text-body-base text-on-surface-variant">{a.cuerpo}</p>

                    {/* Banner de evento */}
                    {a.es_evento && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🗓️</span>
                          <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm">Información del Evento</h4>
                        </div>
                        {a.evento_inicio && (
                          <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">
                            📅 <strong>Inicio:</strong>{" "}
                            {new Date(a.evento_inicio).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })} ·{" "}
                            {new Date(a.evento_inicio).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                        {a.evento_fin && (
                          <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">
                            📅 <strong>Fin:</strong>{" "}
                            {new Date(a.evento_fin).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })} ·{" "}
                            {new Date(a.evento_fin).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                        {a.evento_lugar && <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">📍 {a.evento_lugar}</p>}
                        {a.evento_vestimenta && <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">👔 <strong>Vestimenta:</strong> {a.evento_vestimenta}</p>}
                        {a.evento_enlace && (
                          <a href={a.evento_enlace} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline">
                            🔗 Ver más información
                          </a>
                        )}
                      </div>
                    )}

                    {/* Videos */}
                    {(a.videos?.length ?? 0) > 0 && (
                      <div className="flex flex-col gap-3 mt-3">
                        {a.videos.map((url, i) => (
                          <video key={i} controls className="w-full rounded-xl bg-black" src={url}>
                            Tu navegador no soporta video HTML5.
                          </video>
                        ))}
                      </div>
                    )}

                    {/* PDFs */}
                    {(a.pdfs?.length ?? 0) > 0 && (
                      <div className="flex flex-col gap-2 mt-3">
                        {a.pdfs.map((url, i) => (
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
        </main>
      </div>
    </>
  );
}
