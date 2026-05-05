"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Asistencia {
  id: string;
  fecha: string;
  estatus: string;
  justificacion: string | null;
  materia: { id: string; nombre: string } | null;
  grupo: { id: string; nombre: string; semestre: number } | null;
}

const ESTATUS_LABEL: Record<string, string> = {
  P: "Presente", presente: "Presente",
  F: "Falta",    ausente: "Falta",
  J: "Justificado", justificado: "Justificado",
  tardanza: "Tardanza",
};
const ESTATUS_CLASS: Record<string, string> = {
  P: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  presente: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  F: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  ausente: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  J: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  justificado: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  tardanza: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

export default function PadresAsistenciasPage() {
  const [alumnoId, setAlumnoId]   = useState<string>("");
  const [matricula, setMatricula] = useState<string>("");
  const [nombre, setNombre]       = useState<string>("");
  const [semestre, setSemestre]   = useState<string>("");
  const [asistencias, setAsist]   = useState<Asistencia[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [filtroMateria, setFiltroMateria] = useState("");
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

    fetch(`/api/padres/asistencias?alumno_id=${id}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401 || r.status === 403) { router.replace("/login"); return null; }
        return r.json();
      })
      .then((json) => {
        if (!json) return;
        if (!json.asistencias) { setError(json.error ?? "Error al cargar asistencias"); return; }
        setAsist(json.asistencias);
      })
      .catch(() => setError("Error de red"))
      .finally(() => setLoading(false));
  }, [router]);

  // Estadísticas
  const total     = asistencias.length;
  const presentes = asistencias.filter((a) => a.estatus === "P" || a.estatus === "presente").length;
  const faltas    = asistencias.filter((a) => a.estatus === "F" || a.estatus === "ausente").length;
  const justifs   = asistencias.filter((a) => a.estatus === "J" || a.estatus === "justificado").length;
  const pct       = total > 0 ? ((presentes / total) * 100).toFixed(1) : null;

  // Materias únicas para filtro
  const materias = [...new Map(
    asistencias.filter((a) => a.materia).map((a) => [a.materia!.id, a.materia!.nombre])
  ).entries()];

  const lista = filtroMateria
    ? asistencias.filter((a) => a.materia?.id === filtroMateria)
    : asistencias;

  if (loading) return <LoadingSpinner duration={3000} />;

  return (
    <>
      <DashboardTopbar userImageAlt="Padre de familia" activeTopLink="asistencias" linkBase="/dashboard/padres" />
      <div className="flex flex-1 pt-16">
        <DashboardSidebar activeLink="asistencias" headerVariant="simple" linkBase="/dashboard/padres" />
        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Header */}
          <div className="mb-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background mb-1">Asistencias</h1>
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

          {/* Estadísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-md mb-lg">
            {[
              { label: "Asistencia", val: pct ? `${pct}%` : "—", cls: pct && parseFloat(pct) < 80 ? "text-error" : "text-primary" },
              { label: "Presentes",  val: presentes, cls: "text-green-600 dark:text-green-400" },
              { label: "Faltas",     val: faltas,    cls: "text-error" },
              { label: "Justificados", val: justifs, cls: "text-yellow-700 dark:text-yellow-400" },
            ].map((s) => (
              <div key={s.label} className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
                <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-xs mb-2">{s.label}</h3>
                <span className={`text-3xl font-display-lg leading-none ${s.cls}`}>{s.val}</span>
              </div>
            ))}
          </div>

          {/* Filtro por materia */}
          {materias.length > 1 && (
            <div className="mb-md">
              <select
                value={filtroMateria}
                onChange={(e) => setFiltroMateria(e.target.value)}
                className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="">Todas las materias</option>
                {materias.map(([id, nom]) => (
                  <option key={id} value={id}>{nom}</option>
                ))}
              </select>
            </div>
          )}

          {/* Tabla */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="px-md py-md border-b border-outline-variant">
              <h2 className="font-title-sm text-title-sm text-on-surface">
                Historial de Asistencias {filtroMateria && `— ${materias.find(([id]) => id === filtroMateria)?.[1]}`}
              </h2>
            </div>

            {lista.length === 0 ? (
              <div className="px-md py-xl text-center text-on-surface-variant font-body-base text-body-base">
                Sin registros de asistencia.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-low">
                    <tr>
                      <th className="text-left px-md py-sm font-semibold text-on-surface">Fecha</th>
                      <th className="text-left px-md py-sm font-semibold text-on-surface">Materia</th>
                      <th className="text-center px-md py-sm font-semibold text-on-surface">Estatus</th>
                      <th className="text-left px-md py-sm font-semibold text-on-surface">Justificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((a) => (
                      <tr key={a.id} className="border-t border-outline-variant hover:bg-surface-container-low/60 transition-colors">
                        <td className="px-md py-sm text-on-surface">
                          {new Date(a.fecha + "T12:00:00").toLocaleDateString("es-MX", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                        </td>
                        <td className="px-md py-sm text-on-surface">{a.materia?.nombre ?? "—"}</td>
                        <td className="text-center px-md py-sm">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${ESTATUS_CLASS[a.estatus] ?? "bg-surface-container text-on-surface"}`}>
                            {ESTATUS_LABEL[a.estatus] ?? a.estatus}
                          </span>
                        </td>
                        <td className="px-md py-sm text-on-surface-variant text-xs">{a.justificacion ?? "—"}</td>
                      </tr>
                    ))}
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
