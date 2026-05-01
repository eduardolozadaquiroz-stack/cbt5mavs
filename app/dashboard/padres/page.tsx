"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

interface StudentData {
  studentId: string;
  studentName: string;
  grado: string;
  grupo: string;
}

export default function PadresDashboard() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Leer selección de la sesión actual del navegador (sessionStorage se borra al cerrar pestaña)
    const alumnoId    = sessionStorage.getItem("selectedAlumnoId");
    const alumnoNombre = sessionStorage.getItem("selectedAlumnoNombre");
    const semestre    = sessionStorage.getItem("selectedAlumnoSemestre");
    const grupo       = sessionStorage.getItem("selectedAlumnoGrupo");

    if (!alumnoId || !alumnoNombre) {
      router.replace("/dashboard/padres/seleccionar-alumno");
      return;
    }

    // Verificar server-side que este alumno realmente pertenece al padre autenticado
    fetch("/api/padres/mis-alumnos", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) { router.replace("/login"); return null; }
        return r.json();
      })
      .then((json) => {
        if (!json) return;
        const vinculados: { alumno_id: string; nombre: string; semestre: number; grupo: string }[] =
          json.alumnos ?? [];
        const alumno = vinculados.find((a) => a.alumno_id === alumnoId);
        if (!alumno) {
          // El alumnoId en sessionStorage no pertenece a este padre → redirigir
          sessionStorage.removeItem("selectedAlumnoId");
          sessionStorage.removeItem("selectedAlumnoNombre");
          router.replace("/dashboard/padres/seleccionar-alumno");
          return;
        }
        setStudent({
          studentId: alumnoId,
          studentName: alumno.nombre,
          grado: `${alumno.semestre}°`,
          grupo: alumno.grupo,
        });
        setLoading(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  if (loading) {
    return <LoadingSpinner duration={3000} />;
  }

  if (!student) return null;

  return (
    <>
      <DashboardTopbar
        userImageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDBJFu1eTFJVZnEIpf-KZZvSc_2ffZQGUirP05eqMK12TVBzwigT9EauHtrNVGTd-67_1LsY_0TUiZTt05HcyZXomBqsm1Kv6mJ9lOeQcUvsx9rZTLrY0ASxcVj2CMDkmyby29mUF551eD7wf5moJ9QLCBGlQObDInlM23i5b7BpfDkM3436o3JteJDAyE28ef_KoT1fTG6ZYBYE3KNLPUgFcRV7Y5IldhFMLtpChj4-jm42Hz2QxVhJU5Gbk1KUKsL6zRDWY4Uoiz6"
        userImageAlt="Padre de familia"
        activeTopLink="dashboard"
        linkBase="/dashboard/padres"
      />

      <div className="flex flex-1 pt-16">
        <DashboardSidebar activeLink="inicio" headerVariant="simple" linkBase="/dashboard/padres" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Page Header */}
          <div className="mb-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background mb-1">Seguimiento de {student.studentName}</h1>
              <p className="font-body-base text-body-base text-on-surface-variant">
                Grado {student.grado} Grupo {student.grupo} · Matrícula {student.studentId}
              </p>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem("selectedAlumnoId");
                sessionStorage.removeItem("selectedAlumnoNombre");
                sessionStorage.removeItem("selectedAlumnoSemestre");
                sessionStorage.removeItem("selectedAlumnoGrupo");
                router.push("/dashboard/padres/seleccionar-alumno");
              }}
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-lg py-sm rounded-lg font-label-bold text-label-bold transition-colors border border-transparent shadow-sm"
            >
              <span className="text-[18px]">👤</span>
              Cambiar Estudiante
            </button>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-xl">

            {/* Left column - Alerts */}
            <div className="md:col-span-4 flex flex-col gap-md">
              {/* Alert aviso */}
              <div className="bg-surface-container-high border border-outline-variant rounded-xl p-md flex flex-col gap-sm shadow-sm">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-[18px]">📌</span>
                  <h3 className="font-title-sm text-title-sm text-on-surface">Información del Estudiante</h3>
                </div>
                <div className="space-y-2 text-sm text-on-surface-variant">
                  <p><strong>Nombre:</strong> {student.studentName}</p>
                  <p><strong>Grado:</strong> {student.grado}</p>
                  <p><strong>Grupo:</strong> {student.grupo}</p>
                  <p><strong>Matrícula:</strong> {student.studentId}</p>
                </div>
              </div>

              {/* Alert urgente */}
              <div className="bg-error-container border border-error/20 rounded-xl p-md flex flex-col gap-sm shadow-sm">
                <div className="flex items-center gap-2 text-on-error-container">
                  <span className="text-[18px]">⚠️</span>
                  <h3 className="font-title-sm text-title-sm">Avisos Urgentes</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-error-container/80">
                  Se suspenden actividades presenciales el día 15 de Mayo por conmemoración del Día del Maestro.
                </p>
                <a className="mt-2 font-label-bold text-label-bold text-error underline underline-offset-2 self-start" href="#avisos">
                  Ver Avisos
                </a>
              </div>
            </div>

            {/* Right column */}
            <div className="md:col-span-8 flex flex-col gap-lg">

              {/* Mini stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between min-h-[120px]">
                  <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase">
                    Promedio General
                  </h3>
                  <div className="flex items-end gap-3 mt-auto">
                    <span className="text-4xl font-display-lg text-primary leading-none">8.6</span>
                    <span className="font-body-sm text-body-sm text-tertiary-fixed-dim pb-1">
                      Ciclo actual
                    </span>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between min-h-[120px]">
                  <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase">
                    Asistencia
                  </h3>
                  <div className="flex items-end gap-3 mt-auto">
                    <span className="text-4xl font-display-lg text-primary leading-none">97.5%</span>
                    <span className="font-body-sm text-body-sm text-tertiary-fixed-dim pb-1">
                      Muy bueno
                    </span>
                  </div>
                </div>
              </div>

              {/* Calificaciones por materia */}
              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
                <div className="mb-md pb-md border-b border-outline-variant">
                  <h2 className="font-title-sm text-title-sm text-on-surface">Calificaciones por Bimestre</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant">
                        <th className="text-left px-md py-sm font-semibold text-on-surface">Materia</th>
                        <th className="text-center px-md py-sm font-semibold text-on-surface">B1</th>
                        <th className="text-center px-md py-sm font-semibold text-on-surface">B2</th>
                        <th className="text-center px-md py-sm font-semibold text-on-surface">B3</th>
                        <th className="text-center px-md py-sm font-semibold text-on-surface">Promedio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { materia: "Matemáticas", b1: 8.5, b2: 9.0, b3: 8.8 },
                        { materia: "Español", b1: 9.2, b2: 9.5, b3: 9.3 },
                        { materia: "Inglés", b1: 7.8, b2: 8.2, b3: 8.5 },
                        { materia: "Física", b1: 8.0, b2: 8.5, b3: 9.0 },
                      ].map((row, idx) => {
                        const promedio = ((row.b1 + row.b2 + row.b3) / 3).toFixed(1);
                        return (
                          <tr key={idx} className="border-b border-outline-variant hover:bg-surface-variant/40">
                            <td className="px-md py-sm text-on-surface">{row.materia}</td>
                            <td className="text-center px-md py-sm text-on-surface">{row.b1}</td>
                            <td className="text-center px-md py-sm text-on-surface">{row.b2}</td>
                            <td className="text-center px-md py-sm text-on-surface">{row.b3}</td>
                            <td className="text-center px-md py-sm font-semibold text-primary">{promedio}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Lower section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-xl">

            {/* Asistencias */}
            <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
              <div className="mb-md pb-md border-b border-outline-variant">
                <h2 className="font-title-sm text-title-sm text-on-surface">📅 Registro de Asistencia</h2>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="flex flex-col items-center justify-center p-md rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <p className="text-2xl font-display-md text-green-700 dark:text-green-300">156</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Presente</p>
                </div>
                <div className="flex flex-col items-center justify-center p-md rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-2xl font-display-md text-yellow-700 dark:text-yellow-300">8</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Retardos</p>
                </div>
                <div className="flex flex-col items-center justify-center p-md rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <p className="text-2xl font-display-md text-red-700 dark:text-red-300">2</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">Faltas</p>
                </div>
                <div className="flex flex-col items-center justify-center p-md rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <p className="text-2xl font-display-md text-blue-700 dark:text-blue-300">97.5%</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Porcentaje</p>
                </div>
              </div>
            </div>

            {/* Avisos */}
            <div id="avisos" className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
              <div className="mb-md pb-md border-b border-outline-variant">
                <h2 className="font-title-sm text-title-sm text-on-surface">📢 Avisos Institucionales</h2>
              </div>
              <ul className="divide-y divide-outline-variant space-y-md">
                {[
                  { fecha: "30 Abr", titulo: "Entrega de calificaciones", tipo: "académico", tipoClass: "bg-primary-fixed text-on-primary-fixed" },
                  { fecha: "1 May", titulo: "Torneo intergrupal de voleibol", tipo: "evento", tipoClass: "bg-secondary-fixed text-on-secondary-fixed" },
                  { fecha: "15 May", titulo: "Suspensión — Día del Maestro", tipo: "institucional", tipoClass: "bg-error-container text-on-error-container" },
                ].map((e, idx) => (
                  <li key={idx} className="flex items-start gap-md py-sm">
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-surface-container flex flex-col items-center justify-center text-center border border-outline-variant">
                      <span className="text-[10px] font-bold text-primary leading-none">{e.fecha.split(" ")[1]}</span>
                      <span className="text-[11px] text-on-surface-variant leading-none">{e.fecha.split(" ")[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface">{e.titulo}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium mt-1 ${e.tipoClass}`}>
                        {e.tipo}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}
