"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

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
    titulo: "Crear el Ciclo Escolar",
    icono: "📅",
    color: "blue",
    descripcion: "Antes de registrar cualquier cosa, el sistema necesita saber en qué ciclo escolar estamos trabajando.",
    pasos: [
      'Ve al menú lateral → "Configuración de Secciones".',
      'Haz clic en la tarjeta "Periodos escolares".',
      'Haz clic en "Nuevo Ciclo" (botón azul arriba a la derecha).',
      'Ingresa el nombre (ej: "2025-2026 Sem. 1"), la clave del periodo (ej: "2025-1"), y las fechas de inicio y fin.',
      'Haz clic en "Crear Ciclo". Aparecerá en la lista.',
      'Actívalo con el botón "Activar" — solo puede haber un ciclo activo a la vez.',
    ],
    nota: "Sin un ciclo activo, los grupos, calificaciones y reinscripciones no funcionarán correctamente.",
    enlace: { href: `${BASE}/configuracion/periodos`, label: "Ir a Periodos Escolares" },
  },
  {
    num: 2,
    titulo: "Crear los Grupos",
    icono: "👥",
    color: "purple",
    descripcion: 'Los grupos son la forma en que se organizan los alumnos. Cada grupo pertenece a una carrera, semestre, turno y ciclo escolar.',
    pasos: [
      'Ve al menú lateral → "Grupos".',
      'Haz clic en "Nuevo Grupo" (botón azul arriba a la derecha).',
      'Ingresa el nombre del grupo (ej: "1° A Matutino").',
      'Selecciona la carrera (Gastronomía, Informática o DAC).',
      'Selecciona el semestre (1° al 6°) y el turno (Matutino o Vespertino).',
      'Selecciona el ciclo escolar activo.',
      'Haz clic en "Crear Grupo".',
    ],
    nota: "Crea todos los grupos que necesites antes de registrar alumnos. Ejemplo: 1°A Mat, 1°B Mat, 1°A Vesp, etc.",
    enlace: { href: `${BASE}/grupos`, label: "Ir a Grupos" },
  },
  {
    num: 3,
    titulo: "Registrar Administradores",
    icono: "🔑",
    color: "orange",
    descripcion: "Los administradores tienen acceso total al sistema. Regístralos primero para que puedan apoyar.",
    pasos: [
      'Ve al menú lateral → "Usuarios".',
      'Haz clic en "Nuevo Usuario" (botón verde arriba a la derecha).',
      'Selecciona el rol "Admin".',
      'Llena nombre, apellidos, correo electrónico y contraseña.',
      'Haz clic en "Siguiente" para revisar y luego confirma con "Crear Usuario".',
      'El administrador recibirá sus credenciales para iniciar sesión en /login.',
    ],
    nota: "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial.",
    enlace: { href: `${BASE}/usuarios`, label: "Ir a Usuarios" },
  },
  {
    num: 4,
    titulo: "Registrar Maestros",
    icono: "📚",
    color: "green",
    descripcion: "Los maestros pueden registrar asistencias, ingresar calificaciones y ver sus grupos asignados.",
    pasos: [
      'Ve a "Usuarios" → "Nuevo Usuario".',
      'Selecciona el rol "Maestro".',
      'Llena nombre, apellidos, correo y contraseña.',
      'Ingresa el RFC (opcional), especialidad y tipo de contrato (Base / Horas / Interino).',
      'Confirma con "Crear Usuario".',
    ],
    nota: "Los maestros se asignan a grupos desde el módulo de Horarios. Primero crea el maestro, luego asígnalo.",
    enlace: { href: `${BASE}/usuarios`, label: "Ir a Usuarios" },
  },
  {
    num: 5,
    titulo: "Registrar Alumnos",
    icono: "🎓",
    color: "sky",
    descripcion: "Los alumnos son el centro del sistema. Cada alumno tiene matrícula, carrera y grupo asignado.",
    pasos: [
      'Ve a "Usuarios" → "Nuevo Usuario".',
      'Selecciona el rol "Alumno".',
      'Llena nombre completo, correo y contraseña.',
      'Ingresa matrícula, CURP, fecha de nacimiento, sexo y semestre actual.',
      'Selecciona la carrera y el grupo correspondiente.',
      'Confirma con "Crear Usuario".',
    ],
    nota: "Si el alumno no tiene correo institucional aún, puedes usar uno temporal. Lo podrá cambiar desde su perfil.",
    enlace: { href: `${BASE}/usuarios`, label: "Ir a Usuarios" },
  },
  {
    num: 6,
    titulo: "Registrar Padres de Familia",
    icono: "👨‍👩‍👧",
    color: "teal",
    descripcion: "Los padres pueden ver calificaciones, asistencias, avisos y el estado de reinscripción de sus hijos.",
    pasos: [
      'Ve a "Usuarios" → "Nuevo Usuario".',
      'Selecciona el rol "Padres".',
      'Llena nombre completo, correo y contraseña.',
      'Ingresa CURP del tutor y tipo de parentesco (Padre, Madre, Tutor Legal, Otro).',
      'Haz clic en "Siguiente" y confirma con "Crear Usuario".',
      'Una vez creado, ve al perfil del alumno (en la lista de usuarios) y vincúlalo al padre/tutor desde ahí.',
    ],
    nota: "Un padre puede estar vinculado a varios alumnos (hermanos). Un alumno también puede tener más de un tutor vinculado.",
    enlace: { href: `${BASE}/usuarios`, label: "Ir a Usuarios" },
  },
  {
    num: 7,
    titulo: "Configurar Reinscripción",
    icono: "📋",
    color: "violet",
    descripcion: "Cuando llegue el periodo de reinscripción, actívalo desde el panel de administración.",
    pasos: [
      'Ve al menú lateral → "Editar: Reinscripción".',
      'Activa el switch "Proceso de reinscripción habilitado".',
      'Ingresa el ciclo escolar objetivo, las fechas de inicio y cierre.',
      'Define los documentos requeridos (separados por coma, ej: "CURP, Acta de nacimiento, Comprobante de pago").',
      'Sube la imagen del comprobante de pago y el link a los formatos si aplica.',
      'Guarda los cambios. Los alumnos verán el proceso automáticamente en su dashboard.',
      'Para revisar solicitudes, ve a "Editar: Reinscripción" y baja al panel "Solicitudes Recibidas".',
    ],
    nota: "Los padres verán el estado de la reinscripción de sus hijos en tiempo real desde su dashboard.",
    enlace: { href: `${BASE}/reinscripcion`, label: "Ir a Reinscripción" },
  },
  {
    num: 8,
    titulo: "Gestionar Horarios",
    icono: "🕐",
    color: "amber",
    descripcion: "Asigna maestros a grupos y materias para construir el horario escolar.",
    pasos: [
      'Ve al menú lateral → "Horarios".',
      'Selecciona el grupo al que quieres asignar clases.',
      'Agrega bloques de horario: elige el maestro, la materia, el día y el horario.',
      'Los alumnos del grupo verán su horario automáticamente en su dashboard.',
      'Los maestros también verán sus horarios en su propio dashboard.',
    ],
    nota: "Primero crea los maestros y grupos antes de configurar horarios.",
    enlace: { href: `${BASE}/horarios`, label: "Ir a Horarios" },
  },
  {
    num: 9,
    titulo: "Publicar Avisos",
    icono: "📢",
    color: "red",
    descripcion: "Los avisos llegan a todos los usuarios según el destinatario configurado.",
    pasos: [
      'Ve al menú lateral → "Editar: Avisos".',
      'Haz clic en "Nuevo Aviso".',
      'Escribe el título, tipo (Urgente, Académico, Administrativo, etc.) y el contenido.',
      'Selecciona el destinatario (Todos, Alumnos, Maestros, Padres o Admins).',
      'Puedes subir fotos o imágenes al aviso.',
      'Cambia el estado a "Publicado" para que sea visible.',
    ],
    nota: "Los avisos en estado Borrador no son visibles para los usuarios, úsalos para preparar comunicados.",
    enlace: { href: `${BASE}/avisos`, label: "Ir a Avisos" },
  },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; btn: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20",   border: "border-blue-200 dark:border-blue-800",   badge: "bg-blue-700 text-white",   btn: "bg-blue-700 hover:bg-blue-800 text-white" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-200 dark:border-purple-800", badge: "bg-purple-700 text-white", btn: "bg-purple-700 hover:bg-purple-800 text-white" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-600 text-white", btn: "bg-orange-600 hover:bg-orange-700 text-white" },
  green:  { bg: "bg-green-50 dark:bg-green-950/20",  border: "border-green-200 dark:border-green-800",  badge: "bg-green-700 text-white",  btn: "bg-green-700 hover:bg-green-800 text-white" },
  sky:    { bg: "bg-sky-50 dark:bg-sky-950/20",      border: "border-sky-200 dark:border-sky-800",      badge: "bg-sky-700 text-white",    btn: "bg-sky-700 hover:bg-sky-800 text-white" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/20",    border: "border-teal-200 dark:border-teal-800",    badge: "bg-teal-700 text-white",   btn: "bg-teal-700 hover:bg-teal-800 text-white" },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/20", border: "border-violet-200 dark:border-violet-800", badge: "bg-violet-700 text-white", btn: "bg-violet-700 hover:bg-violet-800 text-white" },
  amber:  { bg: "bg-amber-50 dark:bg-amber-950/20",  border: "border-amber-200 dark:border-amber-800",  badge: "bg-amber-600 text-white",  btn: "bg-amber-600 hover:bg-amber-700 text-white" },
  red:    { bg: "bg-red-50 dark:bg-red-950/20",      border: "border-red-200 dark:border-red-800",      badge: "bg-red-700 text-white",    btn: "bg-red-700 hover:bg-red-800 text-white" },
};

export default function TutorialPage() {
  const [abierto, setAbierto] = useState<number | null>(1);

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" activeTopLink="tutorial" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="tutorial" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[860px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Guía de uso del sistema</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sigue estos pasos en orden para configurar el sistema desde cero. Cada sección te lleva directamente al módulo correspondiente.
            </p>
          </div>

          {/* Mapa rápido */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-8">
            {GUIA.map(p => (
              <button key={p.num} onClick={() => setAbierto(p.num)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${abierto === p.num ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-sm" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                <span className="text-xl">{p.icono}</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-tight">{p.num}. {p.titulo.split(" ").slice(0, 2).join(" ")}</span>
              </button>
            ))}
          </div>

          {/* Pasos acordeón */}
          <div className="space-y-3">
            {GUIA.map(p => {
              const c = colorMap[p.color];
              const open = abierto === p.num;
              return (
                <div key={p.num} className={`rounded-xl border ${c.border} overflow-hidden shadow-sm`}>
                  {/* Header */}
                  <button
                    onClick={() => setAbierto(open ? null : p.num)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${open ? c.bg : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${c.badge}`}>
                      {p.num}
                    </span>
                    <span className="text-lg mr-1">{p.icono}</span>
                    <span className="flex-1 font-semibold text-slate-800 dark:text-slate-100">{p.titulo}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                      className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                    >
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>

                  {/* Contenido */}
                  {open && (
                    <div className={`px-5 py-4 border-t ${c.border} ${c.bg}`}>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{p.descripcion}</p>

                      <ol className="space-y-2 mb-4">
                        {p.pasos.map((paso, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-bold flex items-center justify-center text-slate-600 dark:text-slate-400">
                              {i + 1}
                            </span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{paso}</span>
                          </li>
                        ))}
                      </ol>

                      {p.nota && (
                        <div className="flex gap-2 items-start bg-white/70 dark:bg-slate-800/70 rounded-lg px-3 py-2 mb-4 border border-slate-200 dark:border-slate-700">
                          <span className="text-base">💡</span>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{p.nota}</p>
                        </div>
                      )}

                      {p.enlace && (
                        <Link href={p.enlace.href}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${c.btn}`}>
                          {p.enlace.label}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                          </svg>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ¿Tienes dudas? Contacta al soporte técnico o revisa el{" "}
              <Link href={`${BASE}/audit-log`} className="text-blue-600 hover:underline">Audit Log</Link>{" "}
              para ver todos los cambios realizados en el sistema.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
