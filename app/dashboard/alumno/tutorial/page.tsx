"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/alumno";

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
    descripcion: "La primera vez que entras al sistema, recibirás tus credenciales de acceso (correo y contraseña temporal) de parte del administrador de tu plantel.",
    pasos: [
      "Abre el portal en tu navegador e ingresa a /login.",
      "Escribe tu correo institucional y la contraseña que te dieron.",
      'Si es tu primera vez, el sistema te pedirá cambiar tu contraseña. Elige una segura (mínimo 8 caracteres, mayúscula, número y símbolo).',
      "Una vez dentro, llegarás a tu panel principal (dashboard).",
    ],
    nota: "Si olvidaste tu contraseña, usa el enlace '¿Olvidaste tu contraseña?' en la pantalla de login.",
  },
  {
    num: 2,
    titulo: "Panel Principal",
    icono: "🏠",
    color: "purple",
    descripcion: "Tu panel de inicio muestra un resumen de tus calificaciones, asistencias y los últimos avisos del plantel. Todo en un solo lugar.",
    pasos: [
      "Al iniciar sesión llegas automáticamente a tu panel.",
      "Verás tus calificaciones por materia con los 3 parciales.",
      "Un indicador de promedio general te dice cómo vas en el ciclo.",
      "Los avisos más recientes del plantel aparecen en la parte inferior.",
      "Usa el menú lateral izquierdo para navegar a cualquier sección.",
    ],
    enlace: { href: BASE, label: "Ir al Panel Principal" },
  },
  {
    num: 3,
    titulo: "Mis Calificaciones",
    icono: "📊",
    color: "green",
    descripcion: "Consulta tus calificaciones de todos los parciales y materias del ciclo escolar actual.",
    pasos: [
      'Ve al menú lateral → "Calificaciones".',
      "Verás una tabla con tus materias y las notas de cada parcial (1, 2 y 3).",
      "El promedio se calcula automáticamente.",
      "Las materias reprobadas (promedio < 6) aparecen resaltadas.",
      "Puedes ver el historial de ciclos anteriores si el administrador tiene registros previos.",
    ],
    nota: "Si una calificación aparece vacía, significa que el maestro aún no la ha capturado. Consulta directamente con él.",
    enlace: { href: `${BASE}/calificaciones`, label: "Ver Calificaciones" },
  },
  {
    num: 4,
    titulo: "Mis Asistencias",
    icono: "✅",
    color: "teal",
    descripcion: "Revisa tu historial de asistencias por materia y controla tus faltas para evitar perder el derecho a examen.",
    pasos: [
      'Ve al menú lateral → "Asistencias".',
      "Verás el registro de presencias, faltas y retardos por materia.",
      "El porcentaje de asistencia se muestra por materia.",
      "El mínimo requerido es generalmente del 80% para tener derecho a examen.",
      "Si tienes una justificación, comunícala directamente con el maestro.",
    ],
    nota: "Las faltas injustificadas acumuladas pueden afectar tu derecho a presentar examen. Consulta el reglamento.",
    enlace: { href: `${BASE}/asistencias`, label: "Ver Asistencias" },
  },
  {
    num: 5,
    titulo: "Mi Horario",
    icono: "🕐",
    color: "amber",
    descripcion: "Consulta tu horario de clases semanal con los datos de cada materia, maestro y aula.",
    pasos: [
      'Ve al menú lateral → "Horarios".',
      "Verás tu horario semanal organizado por día y hora.",
      "Cada bloque muestra: materia, maestro y aula.",
      "El horario lo configura el administrador y se actualiza automáticamente.",
    ],
    enlace: { href: `${BASE}/horarios`, label: "Ver Horario" },
  },
  {
    num: 6,
    titulo: "Avisos del Plantel",
    icono: "📢",
    color: "orange",
    descripcion: "Mantente informado con los comunicados oficiales del plantel: eventos, fechas importantes, convocatorias y más.",
    pasos: [
      'Ve al menú lateral → "Avisos".',
      "Verás todos los avisos publicados ordenados del más reciente al más antiguo.",
      "Los avisos urgentes aparecen destacados con un badge rojo.",
      "Haz clic en cualquier aviso para leer el contenido completo.",
    ],
    nota: "Solo se muestran los avisos publicados y vigentes. Los eventos con fecha aparecen con los datos del lugar y horario.",
    enlace: { href: `${BASE}/avisos`, label: "Ver Avisos" },
  },
  {
    num: 7,
    titulo: "Reinscripción",
    icono: "📋",
    color: "violet",
    descripcion: "Cuando llegue el periodo de reinscripción, aquí encontrarás toda la información y podrás ver el estado de tu trámite.",
    pasos: [
      'Ve al menú lateral → "Reinscripción".',
      "Si el proceso está activo, verás las instrucciones, documentos requeridos y fechas.",
      "Sigue los pasos indicados y asegúrate de entregar los documentos en tiempo.",
      "Podrás ver en tiempo real si tu reinscripción fue aceptada o está pendiente.",
    ],
    nota: "El proceso de reinscripción solo aparece visible cuando el administrador lo activa en las fechas correspondientes.",
    enlace: { href: `${BASE}/reinscripcion`, label: "Ver Reinscripción" },
  },
  {
    num: 8,
    titulo: "Mi Perfil",
    icono: "👤",
    color: "sky",
    descripcion: "Actualiza tu información personal y cambia tu contraseña desde la configuración de tu cuenta.",
    pasos: [
      'Haz clic en tu nombre o foto en la parte superior derecha → "Configuración".',
      "Puedes actualizar tu foto de perfil, teléfono y datos personales.",
      'Para cambiar contraseña, ve a "Cambiar contraseña" e ingresa la actual y la nueva.',
      "Guarda los cambios con el botón correspondiente.",
    ],
    nota: "Mantén tu información actualizada para que el plantel pueda contactarte correctamente.",
    enlace: { href: `${BASE}/configuracion`, label: "Ver Perfil" },
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; btn: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20",     border: "border-blue-200 dark:border-blue-800",     badge: "bg-blue-700 text-white",    btn: "bg-blue-700 hover:bg-blue-800 text-white" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200 dark:border-purple-800", badge: "bg-purple-700 text-white",  btn: "bg-purple-700 hover:bg-purple-800 text-white" },
  green:  { bg: "bg-green-50 dark:bg-green-950/20",   border: "border-green-200 dark:border-green-800",   badge: "bg-green-700 text-white",   btn: "bg-green-700 hover:bg-green-800 text-white" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/20",     border: "border-teal-200 dark:border-teal-800",     badge: "bg-teal-700 text-white",    btn: "bg-teal-700 hover:bg-teal-800 text-white" },
  amber:  { bg: "bg-amber-50 dark:bg-amber-950/20",   border: "border-amber-200 dark:border-amber-800",   badge: "bg-amber-600 text-white",   btn: "bg-amber-600 hover:bg-amber-700 text-white" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-600 text-white",  btn: "bg-orange-600 hover:bg-orange-700 text-white" },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/20", border: "border-violet-200 dark:border-violet-800", badge: "bg-violet-700 text-white",  btn: "bg-violet-700 hover:bg-violet-800 text-white" },
  sky:    { bg: "bg-sky-50 dark:bg-sky-950/20",       border: "border-sky-200 dark:border-sky-800",       badge: "bg-sky-700 text-white",     btn: "bg-sky-700 hover:bg-sky-800 text-white" },
};

export default function TutorialAlumnoPage() {
  const [abierto, setAbierto] = useState<number | null>(1);

  return (
    <>
      <DashboardTopbar userImageAlt="Alumno" activeTopLink="tutorial" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="tutorial" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[860px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Guía de uso — Alumno</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Todo lo que necesitas saber para usar el portal escolar desde tu cuenta de alumno.
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
