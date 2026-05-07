"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/maestro";

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
    descripcion: "El administrador del plantel creará tu cuenta y te proporcionará tu correo y contraseña temporal para ingresar al sistema.",
    pasos: [
      "Abre el portal en tu navegador e ingresa a /login.",
      "Escribe tu correo institucional y la contraseña que te dieron.",
      'En tu primer ingreso, el sistema te pedirá cambiar tu contraseña a una personal y segura.',
      "Una vez dentro, verás tu panel de maestro con un resumen de tus grupos y horarios.",
    ],
    nota: "Si el administrador no te ha asignado grupos y materias aún, tu panel aparecerá vacío. Comunícate con la administración.",
  },
  {
    num: 2,
    titulo: "Panel Principal",
    icono: "🏠",
    color: "purple",
    descripcion: "Tu panel muestra un resumen de tus grupos asignados, próximas clases y los últimos avisos del plantel.",
    pasos: [
      "Al iniciar sesión llegas a tu panel principal.",
      "Verás tus grupos con el número de alumnos por cada uno.",
      "Los avisos más recientes del plantel se muestran en la parte inferior.",
      "Usa el menú lateral para navegar entre las distintas secciones.",
    ],
    enlace: { href: BASE, label: "Ir al Panel Principal" },
  },
  {
    num: 3,
    titulo: "Capturar Calificaciones",
    icono: "📊",
    color: "green",
    descripcion: "Ingresa las calificaciones de tus alumnos por parcial (1, 2 y 3). El sistema guarda todo automáticamente y permite editar en cualquier momento.",
    pasos: [
      'Ve al menú lateral → "Calificaciones".',
      "Selecciona el grupo y la materia del menú desplegable.",
      "Elige el parcial (1, 2 o 3) que quieres capturar.",
      "Ingresa la calificación de cada alumno en el campo correspondiente (0–10).",
      'Haz clic en "Guardar calificaciones". El sistema guarda en lote.',
      "Puedes volver a editar en cualquier momento; el último guardado reemplaza el anterior.",
    ],
    nota: "Si no ves grupos o materias, el administrador aún no te ha asignado grupo-materia. Ve a Grupos → Materias y pide al admin que te asigne.",
    enlace: { href: `${BASE}/calificaciones`, label: "Capturar Calificaciones" },
  },
  {
    num: 4,
    titulo: "Registrar Asistencias",
    icono: "✅",
    color: "teal",
    descripcion: "Registra la asistencia de tus alumnos para cada clase. El historial queda guardado y los alumnos pueden consultarlo desde su panel.",
    pasos: [
      'Ve al menú lateral → "Asistencias".',
      "Selecciona el grupo y la materia.",
      "El sistema mostrará la lista de alumnos del grupo.",
      "Marca a cada alumno como: Presente (P), Falta (F) o Retardo (R).",
      'Haz clic en "Guardar" para registrar la asistencia del día.',
      "Puedes consultar el historial de asistencias en días anteriores.",
    ],
    nota: "Las asistencias se registran por fecha. Asegúrate de seleccionar la fecha correcta antes de guardar.",
    enlace: { href: `${BASE}/asistencias`, label: "Registrar Asistencias" },
  },
  {
    num: 5,
    titulo: "Mis Grupos",
    icono: "👥",
    color: "indigo",
    descripcion: "Consulta la lista de alumnos de cada uno de tus grupos asignados.",
    pasos: [
      'Ve al menú lateral → "Grupos".',
      "Verás todos los grupos que el administrador te ha asignado con sus materias.",
      "Haz clic en un grupo para ver la lista completa de alumnos.",
      "Puedes buscar un alumno específico por nombre o matrícula.",
    ],
    nota: "No puedes agregar ni eliminar alumnos desde aquí; esa función es exclusiva del administrador.",
    enlace: { href: `${BASE}/grupos`, label: "Ver Mis Grupos" },
  },
  {
    num: 6,
    titulo: "Mi Horario",
    icono: "🕐",
    color: "amber",
    descripcion: "Consulta tu horario de clases semanal con el detalle de cada materia, grupo y aula.",
    pasos: [
      'Ve al menú lateral → "Horarios".',
      "Verás tu horario organizado por día y hora.",
      "Cada bloque muestra: grupo, materia y aula asignada.",
      "El horario lo gestiona el administrador desde el módulo de Horarios.",
    ],
    nota: "Si tu horario no es correcto, comunícalo al administrador para que lo actualice.",
    enlace: { href: `${BASE}/horarios`, label: "Ver Mi Horario" },
  },
  {
    num: 7,
    titulo: "Avisos del Plantel",
    icono: "📢",
    color: "orange",
    descripcion: "Mantente al día con los comunicados oficiales del plantel, eventos y avisos importantes para el personal docente.",
    pasos: [
      'Ve al menú lateral → "Avisos".',
      "Verás todos los avisos dirigidos a maestros y a todos los usuarios.",
      "Los avisos urgentes están destacados con un indicador rojo.",
      "Haz clic en un aviso para ver el contenido completo.",
    ],
    enlace: { href: `${BASE}/avisos`, label: "Ver Avisos" },
  },
  {
    num: 8,
    titulo: "Reportes",
    icono: "📈",
    color: "sky",
    descripcion: "Genera reportes de calificaciones y asistencias de tus grupos para el seguimiento académico.",
    pasos: [
      'Ve al menú lateral → "Reportes".',
      "Selecciona el tipo de reporte: Calificaciones o Asistencias.",
      "Filtra por grupo, materia y parcial según necesites.",
      "Descarga el reporte en el formato disponible.",
    ],
    nota: "Los reportes incluyen únicamente los grupos y materias que tienes asignados.",
    enlace: { href: `${BASE}/reportes`, label: "Ver Reportes" },
  },
  {
    num: 9,
    titulo: "Mi Perfil",
    icono: "👤",
    color: "rose",
    descripcion: "Actualiza tu información personal, foto de perfil y contraseña desde la configuración de tu cuenta.",
    pasos: [
      'Haz clic en tu nombre o foto arriba a la derecha → "Configuración".',
      "Puedes editar tu teléfono, especialidad y foto de perfil.",
      'Para cambiar tu contraseña, ve a "Cambiar contraseña".',
      "Guarda los cambios con el botón correspondiente.",
    ],
    enlace: { href: `${BASE}/configuracion`, label: "Ver Perfil" },
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; btn: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20",     border: "border-blue-200 dark:border-blue-800",     badge: "bg-blue-700 text-white",    btn: "bg-blue-700 hover:bg-blue-800 text-white" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200 dark:border-purple-800", badge: "bg-purple-700 text-white",  btn: "bg-purple-700 hover:bg-purple-800 text-white" },
  green:  { bg: "bg-green-50 dark:bg-green-950/20",   border: "border-green-200 dark:border-green-800",   badge: "bg-green-700 text-white",   btn: "bg-green-700 hover:bg-green-800 text-white" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/20",     border: "border-teal-200 dark:border-teal-800",     badge: "bg-teal-700 text-white",    btn: "bg-teal-700 hover:bg-teal-800 text-white" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/20", border: "border-indigo-200 dark:border-indigo-800", badge: "bg-indigo-700 text-white",  btn: "bg-indigo-700 hover:bg-indigo-800 text-white" },
  amber:  { bg: "bg-amber-50 dark:bg-amber-950/20",   border: "border-amber-200 dark:border-amber-800",   badge: "bg-amber-600 text-white",   btn: "bg-amber-600 hover:bg-amber-700 text-white" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-600 text-white",  btn: "bg-orange-600 hover:bg-orange-700 text-white" },
  sky:    { bg: "bg-sky-50 dark:bg-sky-950/20",       border: "border-sky-200 dark:border-sky-800",       badge: "bg-sky-700 text-white",     btn: "bg-sky-700 hover:bg-sky-800 text-white" },
  rose:   { bg: "bg-rose-50 dark:bg-rose-950/20",     border: "border-rose-200 dark:border-rose-800",     badge: "bg-rose-700 text-white",    btn: "bg-rose-700 hover:bg-rose-800 text-white" },
};

export default function TutorialMaestroPage() {
  const [abierto, setAbierto] = useState<number | null>(1);

  return (
    <>
      <DashboardTopbar userImageAlt="Maestro" activeTopLink="tutorial" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="tutorial" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[860px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Guía de uso — Maestro</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Todo lo que necesitas saber para capturar calificaciones, registrar asistencias y gestionar tus grupos.
            </p>
          </div>

          {/* Mapa rápido */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-8">
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
