"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/padres";

interface Paso {
  num: number;
  titulo: string;
  icono: string;
  color: string;
  descripcion: string;
  pasos: string[];
  nota?: string;
  enlace?: { href: string; label: string };
}

const GUIA: Paso[] = [
  {
    num: 1,
    titulo: "Primer Acceso",
    icono: "🔑",
    color: "blue",
    descripcion: "El administrador del plantel registrará tu cuenta y te enviará tu correo y contraseña para acceder al portal de padres de familia.",
    pasos: [
      "Abre el portal en tu navegador e ingresa a /login.",
      "Escribe el correo y la contraseña que te proporcionó el plantel.",
      "En tu primer acceso, el sistema te pedirá cambiar tu contraseña a una personal.",
      "Al entrar, el sistema te pedirá seleccionar cuál de tus hijos deseas consultar.",
    ],
    nota: "Si tienes más de un hijo inscrito, podrás cambiar entre sus perfiles desde el portal sin cerrar sesión.",
  },
  {
    num: 2,
    titulo: "Seleccionar Alumno",
    icono: "👦",
    color: "sky",
    descripcion: "Antes de ver información, debes seleccionar qué alumno quieres consultar. Si tienes varios hijos, puedes cambiar de perfil en cualquier momento.",
    pasos: [
      "Al iniciar sesión, el sistema muestra la lista de tus hijos registrados.",
      "Haz clic en el nombre del hijo que deseas consultar.",
      "Se cargará su panel con toda su información académica.",
      'Para cambiar a otro hijo, haz clic en "Cambiar alumno" en la parte superior del portal.',
    ],
    enlace: { href: `${BASE}/seleccionar-alumno`, label: "Seleccionar Alumno" },
  },
  {
    num: 3,
    titulo: "Panel Principal",
    icono: "🏠",
    color: "purple",
    descripcion: "El panel muestra un resumen del desempeño académico de tu hijo: calificaciones, asistencias y avisos recientes del plantel.",
    pasos: [
      "Al seleccionar a tu hijo llegas a su panel principal.",
      "Verás su promedio general del ciclo y sus calificaciones por materia.",
      "También se muestra el porcentaje de asistencia.",
      "Los avisos más recientes del plantel aparecen en la parte inferior.",
      "Usa el menú lateral para explorar cada sección en detalle.",
    ],
    enlace: { href: BASE, label: "Ir al Panel" },
  },
  {
    num: 4,
    titulo: "Calificaciones",
    icono: "📊",
    color: "green",
    descripcion: "Consulta las calificaciones de tu hijo por materia y parcial. Puedes ver en tiempo real cómo va su desempeño académico.",
    pasos: [
      'Ve al menú lateral → "Calificaciones".',
      "Verás una tabla con todas las materias del ciclo actual.",
      "Cada materia muestra las notas del Parcial 1, 2 y 3.",
      "El promedio por materia se calcula automáticamente.",
      "Las materias con promedio menor a 6 aparecen resaltadas como en riesgo.",
    ],
    nota: "Si alguna calificación aparece vacía, el maestro aún no la ha capturado. Puede consultarlo con el docente correspondiente.",
    enlace: { href: `${BASE}/calificaciones`, label: "Ver Calificaciones" },
  },
  {
    num: 5,
    titulo: "Asistencias",
    icono: "✅",
    color: "teal",
    descripcion: "Revisa el historial de asistencias de tu hijo para detectar faltas y tomar medidas a tiempo.",
    pasos: [
      'Ve al menú lateral → "Asistencias".',
      "Verás las asistencias registradas por materia: presentes, faltas y retardos.",
      "El porcentaje de asistencia se muestra por materia.",
      "Si el porcentaje baja del 80%, tu hijo podría perder el derecho a examen.",
      "Comunícate con el plantel si hay faltas que necesitan justificación.",
    ],
    nota: "El sistema registra las asistencias conforme el maestro las captura. Puede haber un pequeño retraso respecto al día actual.",
    enlace: { href: `${BASE}/asistencias`, label: "Ver Asistencias" },
  },
  {
    num: 6,
    titulo: "Horario de Clases",
    icono: "🕐",
    color: "amber",
    descripcion: "Consulta el horario semanal de clases de tu hijo con el nombre del maestro y el aula correspondiente.",
    pasos: [
      'Ve al menú lateral → "Horarios".',
      "Verás el horario organizado por día de la semana.",
      "Cada bloque muestra: materia, maestro y aula.",
      "El horario lo actualiza el administrador al inicio del ciclo.",
    ],
    enlace: { href: `${BASE}/horarios`, label: "Ver Horario" },
  },
  {
    num: 7,
    titulo: "Avisos del Plantel",
    icono: "📢",
    color: "orange",
    descripcion: "Mantente informado con los comunicados oficiales: eventos escolares, fechas importantes, convocatorias y más.",
    pasos: [
      'Ve al menú lateral → "Avisos".',
      "Verás todos los avisos publicados del plantel.",
      "Los avisos urgentes están destacados con un badge rojo.",
      "Haz clic en cualquier aviso para leer el contenido completo.",
      "Los eventos muestran fecha, lugar y horario del acto.",
    ],
    nota: "Activa las notificaciones de tu navegador para recibir alertas cuando el plantel publique un aviso urgente.",
    enlace: { href: `${BASE}/avisos`, label: "Ver Avisos" },
  },
  {
    num: 8,
    titulo: "Reinscripción",
    icono: "📋",
    color: "violet",
    descripcion: "Cuando llegue el periodo de reinscripción, aquí encontrarás los requisitos, documentos necesarios y el estado del trámite de tu hijo.",
    pasos: [
      'Ve al menú lateral → "Reinscripción".',
      "Si el proceso está activo, verás las instrucciones y los documentos que debes entregar.",
      "Revisa las fechas de inicio y cierre del proceso.",
      "Sigue los pasos indicados por la administración del plantel.",
      "El estado de la reinscripción (Pendiente / Aceptada) se actualiza en tiempo real.",
    ],
    nota: "El módulo de reinscripción solo está visible cuando la administración lo activa en las fechas del proceso.",
    enlace: { href: `${BASE}/reinscripcion`, label: "Ver Reinscripción" },
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; btn: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20",     border: "border-blue-200 dark:border-blue-800",     badge: "bg-blue-700 text-white",   btn: "bg-blue-700 hover:bg-blue-800 text-white" },
  sky:    { bg: "bg-sky-50 dark:bg-sky-950/20",       border: "border-sky-200 dark:border-sky-800",       badge: "bg-sky-700 text-white",    btn: "bg-sky-700 hover:bg-sky-800 text-white" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200 dark:border-purple-800", badge: "bg-purple-700 text-white", btn: "bg-purple-700 hover:bg-purple-800 text-white" },
  green:  { bg: "bg-green-50 dark:bg-green-950/20",   border: "border-green-200 dark:border-green-800",   badge: "bg-green-700 text-white",  btn: "bg-green-700 hover:bg-green-800 text-white" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/20",     border: "border-teal-200 dark:border-teal-800",     badge: "bg-teal-700 text-white",   btn: "bg-teal-700 hover:bg-teal-800 text-white" },
  amber:  { bg: "bg-amber-50 dark:bg-amber-950/20",   border: "border-amber-200 dark:border-amber-800",   badge: "bg-amber-600 text-white",  btn: "bg-amber-600 hover:bg-amber-700 text-white" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-600 text-white", btn: "bg-orange-600 hover:bg-orange-700 text-white" },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/20", border: "border-violet-200 dark:border-violet-800", badge: "bg-violet-700 text-white", btn: "bg-violet-700 hover:bg-violet-800 text-white" },
};

export default function TutorialPadresPage() {
  const [abierto, setAbierto] = useState<number | null>(1);

  return (
    <>
      <DashboardTopbar userImageAlt="Padre/Tutor" activeTopLink="tutorial" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="tutorial" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[860px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Guía de uso — Padres de Familia</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Todo lo que necesitas saber para consultar el desempeño académico de tu hijo desde el portal de padres.
            </p>
          </div>

          {/* Mapa rápido */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-8">
            {GUIA.map(p => (
              <button key={p.num} onClick={() => setAbierto(p.num)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${abierto === p.num ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-sm" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                <span className="text-xl">{p.icono}</span>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 leading-tight">{p.num}. {p.titulo.split(" ").slice(0, 2).join(" ")}</span>
              </button>
            ))}
          </div>

          {/* Acordeón */}
          <div className="space-y-3">
            {GUIA.map(p => {
              const c = colorMap[p.color];
              const open = abierto === p.num;
              return (
                <div key={p.num} className={`rounded-xl border ${c.border} overflow-hidden shadow-sm`}>
                  <button
                    onClick={() => setAbierto(open ? null : p.num)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${open ? c.bg : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${c.badge}`}>
                      {p.num}
                    </span>
                    <span className="text-lg mr-1">{p.icono}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 flex-1">{p.titulo}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>

                  {open && (
                    <div className={`px-5 pb-5 pt-1 ${c.bg}`}>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{p.descripcion}</p>
                      <ol className="space-y-2">
                        {p.pasos.map((paso, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-200">
                            <span className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${c.badge}`}>
                              {i + 1}
                            </span>
                            <span>{paso}</span>
                          </li>
                        ))}
                      </ol>
                      {p.nota && (
                        <div className="mt-4 flex gap-2 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3">
                          <span className="text-base flex-shrink-0">💡</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{p.nota}</p>
                        </div>
                      )}
                      {p.enlace && (
                        <div className="mt-4">
                          <a href={p.enlace.href}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${c.btn}`}>
                            {p.enlace.label}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </>
  );
}
