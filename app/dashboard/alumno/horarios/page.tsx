"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const COLORS = [
  "bg-blue-50 border-blue-300 text-blue-800",
  "bg-purple-50 border-purple-300 text-purple-800",
  "bg-green-50 border-green-300 text-green-800",
  "bg-yellow-50 border-yellow-300 text-yellow-800",
  "bg-rose-50 border-rose-300 text-rose-800",
  "bg-orange-50 border-orange-300 text-orange-800",
  "bg-teal-50 border-teal-300 text-teal-800",
  "bg-indigo-50 border-indigo-300 text-indigo-800",
];

interface HorarioSlot {
  id: string;
  dia_semana: number;   // 1=Lun … 5=Vie
  hora_inicio: string;
  hora_fin: string;
  aula: string | null;
  materia: { nombre: string };
  maestro: { usuarios: { nombre: string } } | null;
  grupo: { nombre: string; semestre: number; turno: string; carrera: { nombre: string } } | null;
}

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<HorarioSlot[]>([]);
  const [loading, setLoading]   = useState(true);
  const [estatusEspecial, setEstatusEspecial] = useState<string | null>(null);
  const [actividad, setActividad] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/horarios")
      .then((r) => r.json())
      .then((d) => {
        setHorarios(d.horarios ?? []);
        setEstatusEspecial(d.estatus_especial ?? null);
        setActividad(d.actividad ?? null);
        setLoading(false);
      });
  }, []);

  // Filas de horas únicas ordenadas
  const horas = [...new Map(
    horarios.map((h) => [h.hora_inicio, { inicio: h.hora_inicio, fin: h.hora_fin }])
  ).values()].sort((a, b) => a.inicio.localeCompare(b.inicio));

  // Color fijo por materia
  const colorMap = new Map<string, string>();
  [...new Set(horarios.map((h) => h.materia.nombre))].forEach((m, i) => {
    colorMap.set(m, COLORS[i % COLORS.length]);
  });

  const grupoInfo = horarios[0]?.grupo ?? null;

  return (
    <>
      <DashboardTopbar
        userImageAlt="Estudiante"
        activeTopLink="horarios"
        linkBase="/dashboard/alumno"
      />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="inicio" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full overflow-x-auto">

          <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background">Horario Semanal</h1>
              {grupoInfo && (
                <p className="text-on-surface-variant mt-unit">
                  Grupo: <strong>{grupoInfo.nombre}</strong> &nbsp;·&nbsp; Turno: {grupoInfo.turno} &nbsp;·&nbsp; {grupoInfo.carrera.nombre}
                </p>
              )}
            </div>
          </div>

          {/* Estado especial */}
          {estatusEspecial && (
            <div className="bg-primary-container border border-primary/20 rounded-xl p-md mb-lg">
              <p className="font-semibold text-on-primary-container">
                {estatusEspecial === "practicas" ? "📋 Actualmente en Prácticas Profesionales" : "📋 Actualmente en Servicio Social"}
              </p>
              {actividad && (
                <p className="text-sm text-on-primary-container/80 mt-1">
                  {String(actividad.empresa ?? "")} — desde {String(actividad.fecha_inicio ?? "")}
                </p>
              )}
              <p className="text-xs text-on-primary-container/60 mt-1">No tienes clases regulares durante este periodo.</p>
            </div>
          )}

          {loading ? (
            <p className="text-sm text-on-surface-variant">Cargando horario…</p>
          ) : horarios.length === 0 && !estatusEspecial ? (
            <div className="bg-surface-container-high border border-outline-variant rounded-xl p-lg text-center">
              <p className="text-on-surface-variant">No tienes horario asignado en este ciclo.</p>
            </div>
          ) : !estatusEspecial && (
            <>
              <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full min-w-[700px] text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high">
                      <th className="p-sm px-md border-b border-outline-variant text-label-bold font-label-bold text-on-surface-variant w-32">Hora</th>
                      {DIAS.map((day) => (
                        <th key={day} className="p-sm px-md border-b border-outline-variant text-label-bold font-label-bold text-on-surface-variant text-center">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {horas.map(({ inicio, fin }) => (
                      <tr key={inicio} className="border-b border-outline-variant last:border-0">
                        <td className="p-sm px-md text-body-sm font-body-sm text-on-surface-variant align-top whitespace-nowrap">
                          {inicio.slice(0, 5)} – {fin.slice(0, 5)}
                        </td>
                        {[1, 2, 3, 4, 5].map((dia) => {
                          const slot = horarios.find((h) => h.dia_semana === dia && h.hora_inicio === inicio);
                          return (
                            <td key={dia} className="p-unit align-top">
                              {slot ? (
                                <div className={`rounded border px-2 py-1.5 h-full ${colorMap.get(slot.materia.nombre) ?? COLORS[0]}`}>
                                  <p className="font-semibold text-xs leading-snug">{slot.materia.nombre}</p>
                                  {slot.maestro && (
                                    <p className="text-[11px] mt-0.5 opacity-70">{slot.maestro.usuarios.nombre}</p>
                                  )}
                                  {slot.aula && (
                                    <p className="text-[10px] mt-0.5 opacity-60 flex items-center gap-0.5">
                                      <span className="material-symbols-outlined" style={{ fontSize: "11px" }}>door_open</span>
                                      {slot.aula}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="rounded border border-dashed border-outline-variant bg-surface-variant/30 h-full min-h-[60px] flex items-center justify-center text-[11px] text-on-surface-variant/40 select-none">—</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Leyenda */}
              <div className="mt-md flex flex-wrap gap-sm">
                {[...colorMap.entries()].map(([nombre, color]) => (
                  <span key={nombre} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${color}`}>
                    {nombre}
                  </span>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
