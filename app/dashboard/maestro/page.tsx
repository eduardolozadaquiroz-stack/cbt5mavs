"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

interface HorarioSlot {
  grupo: { id: string; nombre: string; carrera: { nombre: string } | null } | null;
  materia: { nombre: string } | null;
}

interface GrupoStats {
  id: string;
  nombre: string;
  carrera: string;
  alumnos: number;
}

interface Aviso {
  id: string;
  titulo: string;
  tipo: string;
  fecha_publicacion: string;
}

export default function DashboardMaestroPage() {
  const { config } = useAdminConfig();
  const [grupos, setGrupos] = useState<GrupoStats[]>([]);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/avisos")
      .then((r) => r.json())
      .then((d) => setAvisos((d.avisos ?? []).slice(0, 4)));

    fetch("/api/horarios")
      .then((r) => r.json())
      .then((d) => {
        const slots: HorarioSlot[] = d.horarios ?? [];
        // Deduplicar grupos del horario del maestro
        const grupoMap = new Map<string, GrupoStats>();
        slots.forEach((s) => {
          if (!s.grupo) return;
          if (!grupoMap.has(s.grupo.id)) {
            grupoMap.set(s.grupo.id, {
              id: s.grupo.id,
              nombre: s.grupo.nombre,
              carrera: s.grupo.carrera?.nombre ?? "—",
              alumnos: 0,
            });
          }
        });
        setGrupos([...grupoMap.values()]);
        setLoading(false);
      });

    // Contar alumnos de grupos del maestro
    fetch("/api/grupos?rol=maestro")
      .then((r) => r.json())
      .then((d) => {
        const gs = d.grupos ?? [];
        const total = gs.reduce((a: number, g: { alumnos_count?: number }) => a + (g.alumnos_count ?? 0), 0);
        setTotalAlumnos(total);
      });
  }, []);

  if (config.siteConfig?.mantenimiento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="text-center max-w-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="CBT Núm. 5" className="h-20 w-auto mx-auto mb-6 opacity-70" />
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Sistema en mantenimiento
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Estamos mejorando el sistema
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            El sistema de gestión escolar se encuentra temporalmente en mantenimiento.
            Por favor, intenta acceder más tarde.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Si tienes dudas, contacta a la administración del plantel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && <LoadingSpinner duration={1500} />}
      <DashboardTopbar
        userImageAlt="Maestro"
        linkBase="/dashboard/maestro"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="inicio" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            <div className="mb-lg">
              <h1 className="font-display-lg text-display-lg text-on-background">Panel del Docente</h1>
              <p className="text-on-surface-variant mt-unit">Resumen de tu carga académica actual.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-md mb-xl">
              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-sm">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-primary bg-surface-container">
                  <span className="material-symbols-outlined text-sm">groups</span>
                </div>
                <span className="font-display-lg text-display-lg text-on-surface">{loading ? "…" : grupos.length}</span>
                <div>
                  <p className="font-label-bold text-label-bold text-on-surface text-xs">Grupos Asignados</p>
                  <p className="text-xs text-on-surface-variant">Ciclo actual</p>
                </div>
              </div>
              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-sm">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-secondary bg-surface-container-high">
                  <span className="material-symbols-outlined text-sm">person</span>
                </div>
                <span className="font-display-lg text-display-lg text-on-surface">{loading ? "…" : totalAlumnos || "—"}</span>
                <div>
                  <p className="font-label-bold text-label-bold text-on-surface text-xs">Alumnos Totales</p>
                  <p className="text-xs text-on-surface-variant">Entre todos los grupos</p>
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1 bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-sm">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-primary bg-surface-container">
                  <span className="material-symbols-outlined text-sm">grade</span>
                </div>
                <span className="font-display-lg text-display-lg text-on-surface">—</span>
                <div>
                  <p className="font-label-bold text-label-bold text-on-surface text-xs">Materias</p>
                  <p className="text-xs text-on-surface-variant">Ver horario para detalle</p>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mb-xl">
              <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-md border-b border-outline-variant">
                  <h2 className="font-title-sm text-title-sm text-on-surface">Acceso Rápido</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md p-md">
                  {[
                    { href: "/dashboard/maestro/calificaciones", icon: "grade", title: "Captura de Calificaciones", desc: "Ingresa las calificaciones por parcial", color: "bg-primary/5 border-primary/20 hover:border-primary/40" },
                    { href: "/dashboard/maestro/asistencias", icon: "rule", title: "Registro de Asistencia", desc: "Pasa lista a tus grupos del día de hoy", color: "bg-secondary/5 border-secondary/20 hover:border-secondary/40" },
                    { href: "/dashboard/maestro/grupos", icon: "groups", title: "Mis Grupos", desc: "Consulta los alumnos de cada grupo", color: "bg-surface-container border-outline-variant hover:border-primary/30" },
                    { href: "/dashboard/maestro/reportes", icon: "analytics", title: "Reportes", desc: "Índices de reprobación y asistencia", color: "bg-surface-container border-outline-variant hover:border-primary/30" },
                  ].map((item) => (
                    <a key={item.href} href={item.href} className={`flex items-start gap-sm p-md rounded-xl border transition-colors ${item.color}`}>
                      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 shadow-sm border border-outline-variant">
                        <span className="material-symbols-outlined text-primary text-sm">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-label-bold text-label-bold text-on-surface">{item.title}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Grupos del maestro */}
              <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-md border-b border-outline-variant flex justify-between items-center">
                  <h2 className="font-title-sm text-title-sm text-on-surface">Mis Grupos</h2>
                  <a href="/dashboard/maestro/grupos" className="text-sm text-primary hover:underline font-medium">Ver todos</a>
                </div>
                {loading ? (
                  <p className="p-md text-sm text-on-surface-variant">Cargando…</p>
                ) : grupos.length === 0 ? (
                  <p className="p-md text-sm text-on-surface-variant">Sin grupos asignados.</p>
                ) : (
                  <ul className="divide-y divide-outline-variant">
                    {grupos.map((g) => (
                      <li key={g.id}>
                        <a href="/dashboard/maestro/calificaciones" className="flex items-center justify-between px-md py-sm hover:bg-surface-variant/40 transition-colors">
                          <div>
                            <p className="font-label-bold text-label-bold text-on-surface">{g.nombre}</p>
                            <p className="text-xs text-on-surface-variant">{g.carrera}</p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
