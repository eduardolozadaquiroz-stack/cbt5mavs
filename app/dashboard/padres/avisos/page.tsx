"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRealtimeAvisos } from "@/hooks/useRealtimeAvisos";
import AvisoCard from "@/components/dashboard/AvisoCard";

const FILTROS = [
  { key: "Todos",          label: "Todos" },
  { key: "urgente",        label: "🚨 Urgentes" },
  { key: "academico",      label: "📚 Académicos" },
  { key: "administrativo", label: "🏛️ Administrativos" },
  { key: "institucional",  label: "🎓 Institucionales" },
];

function Skeletons() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-pulse">
          <div className="p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-20 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="h-3 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PadresAvisosPage() {
  const [filtro, setFiltro]   = useState("Todos");
  const [ready, setReady]     = useState(false);
  const router                = useRouter();

  // Verificar sesión padre — CRÍTICO: sin alumnoId, redirigir
  useEffect(() => {
    const alumnoId = sessionStorage.getItem("selectedAlumnoId");
    if (!alumnoId) { router.replace("/dashboard/padres/seleccionar-alumno"); return; }
    setReady(true);
  }, [router]);

  const { avisos: all, loading, error } = useRealtimeAvisos("padres");

  const lista    = filtro === "Todos" ? all : all.filter(a => a.tipo === filtro);
  const urgentes = all.filter(a => a.tipo === "urgente").length;

  // Mientras se verifica la sesión, mostrar spinner
  if (!ready) return <LoadingSpinner duration={3000} />;

  return (
    <>
      <DashboardTopbar userImageAlt="Padre de familia" activeTopLink="avisos" linkBase="/dashboard/padres" />
      <div className="flex pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
        <DashboardSidebar activeLink="avisos" headerVariant="simple" linkBase="/dashboard/padres" />

        <main className="flex-1 md:ml-64 overflow-x-hidden">
          <div className="max-w-2xl mx-auto px-4 py-8">

            {/* Cabecera */}
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Avisos del Plantel</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Comunicados y notificaciones de CBT Núm. 5
                </p>
              </div>
              {urgentes > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold border border-red-200 dark:border-red-800">
                  🚨 {urgentes} urgente{urgentes > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-6">
              {FILTROS.map(f => {
                const count = f.key === "Todos" ? all.length : all.filter(a => a.tipo === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFiltro(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      filtro === f.key
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                    }`}
                  >
                    {f.label} {f.key !== "Todos" && count > 0 && <span className="opacity-60">({count})</span>}
                  </button>
                );
              })}
            </div>

            {/* Contenido */}
            {loading && <Skeletons />}
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
            {!loading && !error && (
              lista.length === 0
                ? (
                  <div className="text-center py-20 text-slate-400 dark:text-slate-600">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-medium">No hay avisos en esta categoría</p>
                  </div>
                )
                : (
                  <div className="space-y-4">
                    {lista.map(a => <AvisoCard key={a.id} aviso={a} />)}
                  </div>
                )
            )}
          </div>
        </main>
      </div>
    </>
  );
}

