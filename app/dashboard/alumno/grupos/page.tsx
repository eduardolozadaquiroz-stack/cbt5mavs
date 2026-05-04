"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface GrupoInfo {
  id: string;
  nombre: string;
  semestre: number;
  turno: string;
  carrera: { nombre: string; clave: string };
  ciclo: { nombre: string };
}

interface Companero {
  alumno_id: string;
  matricula: string;
  nombre: string;
}

interface MateriaGrupo {
  nombre: string;
  maestro: string;
  aula: string | null;
}

export default function GruposPage() {
  const [grupo, setGrupo] = useState<GrupoInfo | null>(null);
  const [companeros, setCompaneros] = useState<Companero[]>([]);
  const [materias, setMaterias] = useState<MateriaGrupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("/api/alumno/mi-grupo")
      .then((r) => r.json())
      .then((d) => {
        setGrupo(d.grupo ?? null);
        setCompaneros(d.companeros ?? []);
        setMaterias(d.materias ?? []);
        setLoading(false);
      });
  }, []);

  const compFiltrados = companeros.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.matricula.includes(busqueda)
  );

  return (
    <>
      <DashboardTopbar
        userImageAlt="Estudiante"
        activeTopLink="dashboard"
        linkBase="/dashboard/alumno"
      />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="grupos" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          <div className="mb-lg">
            <h1 className="font-display-lg text-display-lg text-on-background">Mi Grupo</h1>
            <p className="text-on-surface-variant mt-unit">Información de tu grupo asignado en el ciclo actual.</p>
          </div>

          {loading ? (
            <p className="text-sm text-on-surface-variant">Cargando información del grupo…</p>
          ) : !grupo ? (
            <div className="bg-surface-container-high border border-outline-variant rounded-xl p-lg text-center">
              <p className="text-on-surface-variant">No tienes grupo asignado en este ciclo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mb-xl">
              <div className="lg:col-span-1 bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="bg-primary px-md py-lg flex flex-col items-center text-on-primary gap-sm">
                  <div className="w-16 h-16 rounded-full bg-on-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                  </div>
                  <h2 className="font-display-lg text-display-lg">{grupo.nombre}</h2>
                  <p className="text-on-primary/80 text-sm">{grupo.carrera.clave} · Turno {grupo.turno}</p>
                </div>
                <ul className="divide-y divide-outline-variant">
                  {[
                    { icon: "calendar_month", label: "Ciclo Escolar", value: grupo.ciclo?.nombre ?? "—" },
                    { icon: "school", label: "Carrera", value: grupo.carrera.nombre },
                    { icon: "access_time", label: "Turno", value: grupo.turno },
                    { icon: "grade", label: "Semestre", value: `${grupo.semestre}° Semestre` },
                    { icon: "group", label: "Compañeros", value: `${companeros.length} alumnos` },
                  ].map(({ icon, label, value }) => (
                    <li key={label} className="flex items-center gap-sm px-md py-sm">
                      <span className="material-symbols-outlined text-on-surface-variant text-sm">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-on-surface-variant">{label}</p>
                        <p className="text-sm font-medium text-on-surface truncate">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-md border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Lista de Compañeros</h3>
                  <span className="text-body-sm font-body-sm text-on-surface-variant">{companeros.length} alumnos</span>
                </div>

                <div className="px-md py-sm border-b border-outline-variant">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                    <input
                      className="w-full pl-9 pr-md py-sm border border-outline-variant rounded bg-surface text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                      placeholder="Buscar por nombre o matrícula…"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-y-auto flex-1" style={{ maxHeight: "400px" }}>
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-high sticky top-0 z-10">
                      <tr>
                        <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">#</th>
                        <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Matrícula</th>
                        <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Nombre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compFiltrados.map((c, i) => (
                        <tr key={c.alumno_id} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors border-b border-outline-variant last:border-0">
                          <td className="p-sm px-md text-on-surface-variant text-xs">{i + 1}</td>
                          <td className="p-sm px-md text-on-surface-variant font-mono text-sm">{c.matricula}</td>
                          <td className="p-sm px-md text-on-surface font-medium">{c.nombre}</td>
                        </tr>
                      ))}
                      {compFiltrados.length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-md text-center text-sm text-on-surface-variant">Sin resultados.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Materias del grupo */}
          {materias.length > 0 && (
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="p-md border-b border-outline-variant">
                <h3 className="font-title-sm text-title-sm text-on-surface">Materias del Grupo</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md p-md">
                {materias.map((s) => (
                  <div key={s.nombre} className="flex items-center gap-sm p-sm border border-outline-variant rounded-lg hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center bg-primary-container text-on-primary-container">
                      <span className="material-symbols-outlined text-sm">menu_book</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-on-surface truncate">{s.nombre}</p>
                      <p className="text-xs text-on-surface-variant truncate">{s.maestro}</p>
                      {s.aula && (
                        <p className="text-xs text-on-surface-variant flex items-center gap-0.5 mt-0.5">
                          <span className="material-symbols-outlined" style={{ fontSize: "11px" }}>door_open</span>
                          {s.aula}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
