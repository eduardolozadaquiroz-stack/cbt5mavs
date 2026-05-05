"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

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
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  aula: string | null;
  materia: { nombre: string };
  maestro: { usuarios: { nombre: string } } | null;
  grupo: { nombre: string; semestre: number; turno: string; carrera: { nombre: string } } | null;
}

export default function PadresHorariosPage() {
  const [alumnoId, setAlumnoId]   = useState<string>("");
  const [nombre, setNombre]       = useState<string>("");
  const [horarios, setHorarios]   = useState<HorarioSlot[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const router = useRouter();

  useEffect(() => {
    const id  = sessionStorage.getItem("selectedAlumnoId") ?? "";
    const nom = sessionStorage.getItem("selectedAlumnoNombre") ?? "";

    if (!id) { router.replace("/dashboard/padres/seleccionar-alumno"); return; }

    setAlumnoId(id);
    setNombre(nom);

    fetch(`/api/padres/horarios?alumno_id=${id}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401 || r.status === 403) { router.replace("/login"); return null; }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        if (d.error) { setError(d.error); return; }
        setHorarios(d.horarios ?? []);
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false));
  }, [router]);

  const horas = [...new Map(
    horarios.map((h) => [h.hora_inicio, { inicio: h.hora_inicio, fin: h.hora_fin }])
  ).values()].sort((a, b) => a.inicio.localeCompare(b.inicio));

  const colorMap = new Map<string, string>();
  [...new Set(horarios.map((h) => h.materia.nombre))].forEach((m, i) => {
    colorMap.set(m, COLORS[i % COLORS.length]);
  });

  const grupoInfo = horarios[0]?.grupo ?? null;

  return (
    <>
      {loading && <LoadingSpinner duration={1500} />}
      <DashboardTopbar
        userImageAlt="Padre de familia"
        activeTopLink="horarios"
        linkBase="/dashboard/padres"
      />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="horarios" headerVariant="simple" linkBase="/dashboard/padres" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full overflow-x-auto">

          <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background">Horario de {nombre || "Estudiante"}</h1>
              {grupoInfo && (
                <p className="text-on-surface-variant mt-1">
                  Grupo: <strong>{grupoInfo.nombre}</strong>&nbsp;·&nbsp;
                  Semestre {grupoInfo.semestre}&nbsp;·&nbsp;
                  Turno {grupoInfo.turno}&nbsp;·&nbsp;
                  {grupoInfo.carrera.nombre}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-error-container border border-error/20 rounded-xl p-md mb-lg">
              <p className="text-on-error-container text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && horarios.length === 0 && (
            <div className="bg-surface-container-high border border-outline-variant rounded-xl p-lg text-center">
              <p className="text-on-surface-variant">No hay horario asignado para este ciclo.</p>
            </div>
          )}

          {!loading && horarios.length > 0 && (
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
