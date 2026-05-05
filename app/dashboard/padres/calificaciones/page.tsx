"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Calificacion {
  id: string;
  parcial: number;
  calificacion: number;
  fecha_registro: string;
  observaciones: string | null;
  materia: { id: string; nombre: string; clave: string } | null;
  grupo: { id: string; nombre: string; semestre: number } | null;
}

function Badge({ val }: { val: number | null }) {
  if (val === null) return <span className="text-on-surface-variant">—</span>;
  const cls =
    val < 6
      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-bold"
      : val >= 9
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 font-semibold"
      : "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${cls}`}>
      {val.toFixed(1)}
    </span>
  );
}

export default function PadresCalificacionesPage() {
  const [alumnoId, setAlumnoId]       = useState<string>("");
  const [matricula, setMatricula]     = useState<string>("");
  const [nombre, setNombre]           = useState<string>("");
  const [semestre, setSemestre]       = useState<string>("");
  const [calificaciones, setCalif]    = useState<Calificacion[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const router = useRouter();

  useEffect(() => {
    const id  = sessionStorage.getItem("selectedAlumnoId") ?? "";
    const mat = sessionStorage.getItem("selectedAlumnoMatricula") ?? "";
    const nom = sessionStorage.getItem("selectedAlumnoNombre") ?? "";
    const sem = sessionStorage.getItem("selectedAlumnoSemestre") ?? "";

    if (!id) { router.replace("/dashboard/padres/seleccionar-alumno"); return; }

    setAlumnoId(id);
    setMatricula(mat);
    setNombre(nom);
    setSemestre(sem);

    fetch(`/api/padres/calificaciones?alumno_id=${id}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401 || r.status === 403) { router.replace("/login"); return null; }
        return r.json();
      })
      .then((json) => {
        if (!json) return;
        if (!json.calificaciones) { setError(json.error ?? "Error al cargar calificaciones"); return; }
        setCalif(json.calificaciones);
      })
      .catch(() => setError("Error de red"))
      .finally(() => setLoading(false));
  }, [router]);

  // Agrupar por materia
  const materiasMap = new Map<string, { nombre: string; clave: string; parciales: Record<number, number> }>();
  calificaciones.forEach((c) => {
    if (!c.materia) return;
    if (!materiasMap.has(c.materia.id)) {
      materiasMap.set(c.materia.id, { nombre: c.materia.nombre, clave: c.materia.clave, parciales: {} });
    }
    materiasMap.get(c.materia.id)!.parciales[c.parcial] = c.calificacion;
  });
  const materias = [...materiasMap.values()];

  const promedioGeneral =
    materias.length > 0
      ? (
          materias.reduce((sum, m) => {
            const vals = Object.values(m.parciales);
            return sum + (vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0);
          }, 0) / materias.length
        ).toFixed(1)
      : null;

  if (loading) return <LoadingSpinner duration={3000} />;

  return (
    <>
      <DashboardTopbar userImageAlt="Padre de familia" activeTopLink="calificaciones" linkBase="/dashboard/padres" />
      <div className="flex flex-1 pt-16">
        <DashboardSidebar activeLink="calificaciones" headerVariant="simple" linkBase="/dashboard/padres" />
        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Header */}
          <div className="mb-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background mb-1">Calificaciones</h1>
              <p className="font-body-base text-body-base text-on-surface-variant">
                {nombre} · {semestre}° semestre · Matrícula {matricula || alumnoId}
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/padres")}
              className="inline-flex items-center gap-2 border border-outline-variant text-on-surface hover:bg-surface-container px-lg py-sm rounded-lg font-label-bold text-label-bold transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-red-700 dark:text-red-300 text-sm mb-lg">
              {error}
            </div>
          )}

          {/* Tarjeta promedio */}
          {promedioGeneral && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between">
                <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-xs mb-2">Promedio General</h3>
                <span className={`text-4xl font-display-lg leading-none ${parseFloat(promedioGeneral) < 6 ? "text-error" : "text-primary"}`}>
                  {promedioGeneral}
                </span>
              </div>
              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between">
                <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-xs mb-2">Materias</h3>
                <span className="text-4xl font-display-lg leading-none text-on-surface">{materias.length}</span>
              </div>
              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between">
                <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-xs mb-2">En Riesgo ({"<"}6)</h3>
                <span className="text-4xl font-display-lg leading-none text-error">
                  {materias.filter((m) => {
                    const vals = Object.values(m.parciales);
                    return vals.length > 0 && vals.some((v) => v < 6);
                  }).length}
                </span>
              </div>
            </div>
          )}

          {/* Tabla */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="px-md py-md border-b border-outline-variant">
              <h2 className="font-title-sm text-title-sm text-on-surface">Calificaciones por Materia</h2>
            </div>

            {materias.length === 0 ? (
              <div className="px-md py-xl text-center text-on-surface-variant font-body-base text-body-base">
                Sin calificaciones registradas para este semestre.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-low">
                    <tr>
                      <th className="text-left px-md py-sm font-semibold text-on-surface">Materia</th>
                      <th className="text-left px-md py-sm font-semibold text-on-surface text-xs text-on-surface-variant">Clave</th>
                      <th className="text-center px-md py-sm font-semibold text-on-surface">Parcial 1</th>
                      <th className="text-center px-md py-sm font-semibold text-on-surface">Parcial 2</th>
                      <th className="text-center px-md py-sm font-semibold text-on-surface">Parcial 3</th>
                      <th className="text-center px-md py-sm font-semibold text-on-surface">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materias.map((m, i) => {
                      const vals = Object.values(m.parciales);
                      const prom = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
                      return (
                        <tr key={i} className="border-t border-outline-variant hover:bg-surface-container-low/60 transition-colors">
                          <td className="px-md py-sm text-on-surface font-medium">{m.nombre}</td>
                          <td className="px-md py-sm text-on-surface-variant text-xs">{m.clave}</td>
                          <td className="text-center px-md py-sm"><Badge val={m.parciales[1] ?? null} /></td>
                          <td className="text-center px-md py-sm"><Badge val={m.parciales[2] ?? null} /></td>
                          <td className="text-center px-md py-sm"><Badge val={m.parciales[3] ?? null} /></td>
                          <td className="text-center px-md py-sm"><Badge val={prom} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
