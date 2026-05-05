"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAdminConfig } from "@/app/context/AdminConfigContext";
import ReinscripcionCard from "@/components/dashboard/ReinscripcionCard";

interface StudentData {
  studentId: string;      // UUID interno (para llamadas a API)
  matricula: string;      // matrícula real ej. "201724408"
  studentName: string;
  grado: string;
  grupo: string;
}

interface Calificacion {
  materia: { id: string; nombre: string };
  parcial: number;
  calificacion: number;
}

interface Asistencia {
  estatus: "P" | "F" | "J";
}

interface Aviso {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string;
  fecha_publicacion: string;
}

function CalBadge({ val }: { val: number | null }) {
  if (val === null) return <span className="text-on-surface-variant">—</span>;
  const cls = val < 6 ? "text-error font-bold" : val >= 9 ? "text-primary font-semibold" : "text-on-surface";
  return <span className={cls}>{val.toFixed(1)}</span>;
}

export default function PadresDashboard() {
  const { config } = useAdminConfig();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const alumnoId = sessionStorage.getItem("selectedAlumnoId");
    const alumnoMatricula = sessionStorage.getItem("selectedAlumnoMatricula") ?? "";
    const alumnoNombre = sessionStorage.getItem("selectedAlumnoNombre");
    const semestre = sessionStorage.getItem("selectedAlumnoSemestre");
    const grupo = sessionStorage.getItem("selectedAlumnoGrupo");

    if (!alumnoId || !alumnoNombre) {
      router.replace("/dashboard/padres/seleccionar-alumno");
      return;
    }

    // Verificar que el alumno pertenece al padre
    fetch("/api/padres/mis-alumnos", { credentials: "include" })
      .then((r) => {
        if (r.status === 401 || r.status === 403) { router.replace("/login"); return null; }
        return r.json();
      })
      .then((json) => {
        if (!json) return;
        const vinculados: { alumno_id: string; nombre: string; semestre: number; grupo: string }[] = json.alumnos ?? [];
        const alumno = vinculados.find((a) => a.alumno_id === alumnoId);
        if (!alumno) {
          sessionStorage.removeItem("selectedAlumnoId");
          sessionStorage.removeItem("selectedAlumnoNombre");
          router.replace("/dashboard/padres/seleccionar-alumno");
          return;
        }
        setStudent({
          studentId: alumnoId,
          matricula: alumnoMatricula,
          studentName: alumno.nombre,
          grado: `${alumno.semestre}°`,
          grupo: alumno.grupo,
        });

        // Cargar calificaciones, asistencias y avisos en paralelo
        return Promise.all([
          fetch(`/api/padres/calificaciones?alumno_id=${alumnoId}`).then((r) => r.json()),
          fetch(`/api/asistencias?alumno_id=${alumnoId}`).then((r) => r.json()),
          fetch("/api/avisos").then((r) => r.json()),
        ]);
      })
      .then((results) => {
        if (!results) return;
        const [cData, aData, avData] = results;
        setCalificaciones(cData.calificaciones ?? []);
        setAsistencias(aData.asistencias ?? []);
        setAvisos((avData.avisos ?? []).slice(0, 3));
        setLoading(false);
      })
      .catch(() => { router.replace("/login"); });
  }, [router]);

  if (loading) return <LoadingSpinner duration={3000} />;
  if (!student) return null;

  // Agrupar calificaciones por materia
  const materiasMap = new Map<string, { nombre: string; parciales: Record<number, number> }>();
  calificaciones.forEach((c) => {
    const key = c.materia.id;
    if (!materiasMap.has(key)) materiasMap.set(key, { nombre: c.materia.nombre, parciales: {} });
    materiasMap.get(key)!.parciales[c.parcial] = c.calificacion;
  });
  const materias = [...materiasMap.values()];

  const promedioGeneral = materias.length > 0
    ? (materias.reduce((sum, m) => {
        const vals = Object.values(m.parciales);
        return sum + (vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0);
      }, 0) / materias.length).toFixed(1)
    : "—";

  const pctAsistencia = asistencias.length > 0
    ? ((asistencias.filter((a) => a.estatus === "P").length / asistencias.length) * 100).toFixed(1)
    : "—";

  const avisosUrgentes = avisos.filter((a) => a.tipo === "urgente");

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
      <DashboardTopbar userImageAlt="Padre de familia" activeTopLink="dashboard" linkBase="/dashboard/padres" />

      <div className="flex flex-1 pt-16">
        <DashboardSidebar activeLink="inicio" headerVariant="simple" linkBase="/dashboard/padres" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          <div className="mb-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background mb-1">Seguimiento de {student.studentName}</h1>
              <p className="font-body-base text-body-base text-on-surface-variant">
                Grado {student.grado} · Grupo {student.grupo} · Matrícula {student.matricula || student.studentId}
              </p>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem("selectedAlumnoId");
                sessionStorage.removeItem("selectedAlumnoMatricula");
                sessionStorage.removeItem("selectedAlumnoNombre");
                sessionStorage.removeItem("selectedAlumnoSemestre");
                sessionStorage.removeItem("selectedAlumnoGrupo");
                router.push("/dashboard/padres/seleccionar-alumno");
              }}
              className="inline-flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-lg py-sm rounded-lg font-label-bold text-label-bold transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">swap_horiz</span>
              Cambiar Estudiante
            </button>
          </div>

          <ReinscripcionCard role="padres" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-xl">

            {/* Columna izquierda */}
            <div className="md:col-span-4 flex flex-col gap-md">
              <div className="bg-surface-container-high border border-outline-variant rounded-xl p-md flex flex-col gap-sm shadow-sm">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-sm">person</span>
                  <h3 className="font-title-sm text-title-sm text-on-surface">Información del Estudiante</h3>
                </div>
                <div className="space-y-2 text-sm text-on-surface-variant">
                  <p><strong>Nombre:</strong> {student.studentName}</p>
                  <p><strong>Grado:</strong> {student.grado}</p>
                  <p><strong>Grupo:</strong> {student.grupo}</p>
                  <p><strong>Matrícula:</strong> {student.matricula || student.studentId}</p>
                </div>
              </div>

              {avisosUrgentes.length > 0 && (
                <div className="bg-error-container border border-error/20 rounded-xl p-md flex flex-col gap-sm shadow-sm">
                  <div className="flex items-center gap-2 text-on-error-container">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <h3 className="font-title-sm text-title-sm">Avisos Urgentes</h3>
                  </div>
                  {avisosUrgentes.slice(0, 2).map((a) => (
                    <p key={a.id} className="font-body-sm text-body-sm text-on-error-container/80">{a.titulo}</p>
                  ))}
                </div>
              )}

              {avisos.length > 0 && (
                <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
                  <h3 className="font-title-sm text-title-sm text-on-surface mb-3">Últimos Avisos</h3>
                  <ul className="space-y-2">
                    {avisos.map((a) => (
                      <li key={a.id} className="text-sm">
                        <p className="font-medium text-on-surface">{a.titulo}</p>
                        <p className="text-xs text-on-surface-variant">{new Date(a.fecha_publicacion).toLocaleDateString("es-MX")}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Columna derecha */}
            <div className="md:col-span-8 flex flex-col gap-lg">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between min-h-[120px]">
                  <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase">Promedio General</h3>
                  <div className="flex items-end gap-3 mt-auto">
                    <span className="text-4xl font-display-lg text-primary leading-none">{promedioGeneral}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant pb-1">Ciclo actual</span>
                  </div>
                </div>
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between min-h-[120px]">
                  <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase">Asistencia</h3>
                  <div className="flex items-end gap-3 mt-auto">
                    <span className="text-4xl font-display-lg text-primary leading-none">{pctAsistencia !== "—" ? `${pctAsistencia}%` : "—"}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant pb-1">{asistencias.length} registros</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
                <div className="mb-md pb-md border-b border-outline-variant">
                  <h2 className="font-title-sm text-title-sm text-on-surface">Calificaciones por Materia</h2>
                </div>
                {materias.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">Sin calificaciones registradas.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-outline-variant">
                          <th className="text-left px-md py-sm font-semibold text-on-surface">Materia</th>
                          <th className="text-center px-md py-sm font-semibold text-on-surface">P1</th>
                          <th className="text-center px-md py-sm font-semibold text-on-surface">P2</th>
                          <th className="text-center px-md py-sm font-semibold text-on-surface">P3</th>
                          <th className="text-center px-md py-sm font-semibold text-on-surface">Promedio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materias.map((m, i) => {
                          const vals = Object.values(m.parciales);
                          const prom = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
                          return (
                            <tr key={i} className="border-b border-outline-variant hover:bg-surface-variant/40">
                              <td className="px-md py-sm text-on-surface font-medium">{m.nombre}</td>
                              <td className="text-center px-md py-sm"><CalBadge val={m.parciales[1] ?? null} /></td>
                              <td className="text-center px-md py-sm"><CalBadge val={m.parciales[2] ?? null} /></td>
                              <td className="text-center px-md py-sm"><CalBadge val={m.parciales[3] ?? null} /></td>
                              <td className="text-center px-md py-sm"><CalBadge val={prom} /></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

