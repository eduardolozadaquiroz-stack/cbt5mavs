"use client";

import React, { useCallback } from "react";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

type ActiveLink =
  | "inicio"
  | "usuarios"
  | "calificaciones"
  | "asistencias"
  | "horarios"
  | "grupos"
  | "materias"
  | "reportes"
  | "configuracion"
  | "admision"
  | "reinscripcion"
  | "carreras"
  | "avisos"
  | "contacto"
  | "nosotros"
  | "editar-inicio"
  | "audit-log"
  | "tutorial";

type HeaderVariant = "simple" | "cbt-circle" | "school-icon";

interface DashboardSidebarProps {
  activeLink: ActiveLink;
  headerVariant?: HeaderVariant;
  linkBase?: string;
  role?: "admin" | "maestro" | "alumno" | "padres";
}

// SVGs inline — sin dependencia de Material Symbols
const icons: Record<ActiveLink | "logout", React.ReactNode> = {
  inicio: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1l-9-9-9 9zm7 7v-5h4v5h-4z"/></svg>,
  usuarios: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  calificaciones: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>,
  asistencias: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>,
  horarios: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>,
  grupos: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1C4.76 14.04 4.39 14 4 14c-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>,
  materias: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>,
  reportes: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>,
  configuracion: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.64l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.25-.41-.5-.41h-3.84c-.25 0-.46.17-.49.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.22-.07.49.12.64l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.64l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.25.41.5.41h3.84c.25 0 .46-.17.49-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.64l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
  admision: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>,
  reinscripcion: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>,
  carreras: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>,
  avisos: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M18 17H6v-2h12v2zm0-5H6v-2h12v2zm0-5H6V5h12v2zM3 21h18V3H3v18z"/></svg>,
  contacto: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
  nosotros: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  "editar-inicio": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>,
  "audit-log": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>,
  tutorial: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>,
};

const navLinks: { id: ActiveLink; label: string; category?: string }[] = [
  { id: "inicio",          label: "Inicio" },
  { id: "usuarios",        label: "Usuarios" },
  { id: "calificaciones",  label: "Calificaciones" },
  { id: "asistencias",     label: "Asistencias" },
  { id: "horarios",        label: "Horarios por Grupo" },
  { id: "grupos",          label: "Gestión de Grupos" },
  { id: "materias",        label: "Catálogo de Materias" },
  { id: "reportes",        label: "Reportes" },
  { id: "audit-log",       label: "Audit Log" },
  { id: "tutorial",        label: "Guía de uso" },
  // Separador lógico: Edición de Contenido
  { id: "configuracion",   label: "Configuración de Secciones", category: "contenido" },
  { id: "editar-inicio",   label: "Editar: Inicio", category: "contenido" },
  { id: "admision",        label: "Editar: Admisión", category: "contenido" },
  { id: "reinscripcion",   label: "Editar: Reinscripción", category: "contenido" },
  { id: "carreras",        label: "Editar: Carreras", category: "contenido" },
  { id: "avisos",          label: "Editar: Avisos", category: "contenido" },
  { id: "contacto",        label: "Editar: Contacto", category: "contenido" },
  { id: "nosotros",        label: "Editar: Nosotros", category: "contenido" },
];

export default function DashboardSidebar({
  activeLink,
  headerVariant = "simple",
  linkBase,
  role,
}: DashboardSidebarProps) {
  // Detectar rol basado en linkBase si no se pasa explícitamente
  const detectedRole = role ||
    (linkBase?.includes("/alumno") ? "alumno" :
     linkBase?.includes("/maestro") ? "maestro" :
     linkBase?.includes("/padres") ? "padres" :
     "admin");

  const { config } = useAdminConfig();
  const ciclo = config.siteConfig?.ciclo ?? "2025-2026";

  // Logout seguro: invalida el JWT en el servidor
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      // Limpiar sessionStorage y redirigir siempre
      sessionStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  // Filtrar links según el rol
  let visibleLinks: { id: ActiveLink; label: string; category?: string }[] = [];

  if (detectedRole === "padres") {
    // Padres solo ven: inicio, calificaciones, asistencias, horarios, avisos, reinscripcion
    visibleLinks = [
      { id: "inicio",           label: "Inicio" },
      { id: "calificaciones",   label: "Calificaciones" },
      { id: "asistencias",      label: "Asistencias" },
      { id: "horarios",         label: "Horarios" },
      { id: "avisos",           label: "Avisos" },
      { id: "reinscripcion",    label: "Reinscripción" },
    ];
  } else if (detectedRole === "alumno") {
    // Alumnos ven los links básicos sin usuarios, audit-log ni edición de contenido
    // Añade "reinscripcion" explícitamente (ya que category contenido lo excluiría)
    visibleLinks = [
      ...navLinks.filter((l) => l.id !== "usuarios" && l.id !== "audit-log" && l.category !== "contenido"),
      { id: "reinscripcion", label: "Reinscripción" },
    ];
  } else if (detectedRole === "maestro") {
    // Maestros ven los links sin usuarios ni audit-log ni edición de contenido
    visibleLinks = navLinks.filter((l) => l.id !== "usuarios" && l.id !== "audit-log" && l.category !== "contenido");
  } else {
    // Admin ve todos
    visibleLinks = navLinks;
  }

  const sidebarHref = (id: ActiveLink) => {
    if (!linkBase) return "#";
    return id === "inicio" ? linkBase : `${linkBase}/${id}`;
  };

  const activeClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold border-r-4 border-blue-700 font-public-sans text-sm transition-all duration-200";
  const inactiveClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-public-sans text-sm transition-all duration-200";

  return (
    <nav className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 z-40 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">

      {/* Header */}
      {headerVariant === "simple" && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo CBT Núm. 5" className="h-12 w-auto object-contain flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-black text-blue-900 dark:text-white leading-tight">CBT Núm. 5</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Gestión Escolar</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">Ciclo {ciclo}</div>
          </div>
        </div>
      )}

      {headerVariant === "cbt-circle" && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo CBT Núm. 5" className="h-12 w-auto object-contain flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="text-sm font-black text-blue-900 dark:text-white leading-tight">CBT Núm. 5</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Gestión Escolar</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Ciclo {ciclo}</p>
          </div>
        </div>
      )}

      {headerVariant === "school-icon" && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo CBT Núm. 5" className="h-12 w-auto object-contain flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="text-sm font-black text-blue-900 dark:text-white leading-tight">CBT Núm. 5</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Gestión Escolar</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Ciclo {ciclo}</p>
          </div>
        </div>
      )}

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto py-2">
        <ul className="flex flex-col gap-1 px-3">
          {visibleLinks.map((link, idx) => {
            // Agregar separador antes de la sección "contenido"
            const showSeparator = link.category === "contenido" && idx > 0 && visibleLinks[idx - 1].category !== "contenido";
            
            return (
              <div key={link.id}>
                {showSeparator && (
                  <div className="my-2 border-t border-slate-200 dark:border-slate-700 pt-2">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 px-4 uppercase tracking-widest mb-1">
                      Edición de Contenido
                    </p>
                  </div>
                )}
                <li>
                  <a 
                    className={activeLink === link.id ? activeClass : inactiveClass} 
                    href={sidebarHref(link.id)}
                  >
                    {icons[link.id]}
                    <span className="truncate">{link.label}</span>
                  </a>
                </li>
              </div>
            );
          })}
        </ul>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-public-sans text-sm transition-all duration-200"
        >
          {icons.logout}
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}


