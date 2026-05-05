"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRealtimeNotificaciones } from "@/hooks/useRealtimeNotificaciones";

const TIPO_COLOR: Record<string, string> = {
  Urgente:        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Académico:      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Administrativo: "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-100",
  Institucional:  "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  Sistema:        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

interface DashboardTopbarProps {
  userImageSrc?: string;
  userImageAlt: string;
  userName?: string;
  userRole?: string;
  activeTopLink?: "dashboard" | "horarios" | "avisos" | "asistencias" | "calificaciones" | "grupos" | "reportes" | "usuarios" | "configuracion" | "perfil" | "inicio" | "carreras" | "contacto" | "admision" | "nosotros" | string;
  showSearch?: boolean;
  linkBase?: string;
}

// ── íconos SVG inline ──────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
);

const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.989 6.989 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
);

const IconChevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M7 10l5 5 5-5z"/>
  </svg>
);

export default function DashboardTopbar({
  userImageSrc = "",
  userImageAlt,
  userName = "Administrador",
  userRole = "Admin",
  activeTopLink = "dashboard",
  showSearch = false,
  linkBase,
}: DashboardTopbarProps) {
  const [displayName, setDisplayName]     = useState(userName);
  const [displayRole, setDisplayRole]     = useState(userRole);
  const [displayImage, setDisplayImage]   = useState(userImageSrc);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      sessionStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    // Determinar el rol esperado según el dashboard actual
    const expectedRol =
      linkBase?.includes("/padres")        ? "padres"  :
      linkBase?.includes("/alumno")        ? "alumno"  :
      linkBase?.includes("/maestro")       ? "maestro" :
      linkBase?.includes("/administrador") ? "admin"   : null;

    fetch("/api/perfil")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.nombre) setDisplayName(data.nombre);
        if (data.rol) {
          // Si el rol real no coincide con el dashboard actual → redirigir al login
          if (expectedRol && data.rol !== expectedRol) {
            window.location.href = "/login";
            return;
          }
          const labels: Record<string, string> = {
            admin:   "Administrador",
            maestro: "Maestro",
            alumno:  "Alumno",
            padres:  "Padre de Familia",
          };
          setDisplayRole(labels[data.rol] ?? data.rol);
        }
        if (data.foto_url) setDisplayImage(data.foto_url);
      })
      .catch(() => undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeClass =
    "text-sm font-semibold text-blue-700 dark:text-blue-400 border-b-2 border-blue-700 dark:border-blue-400 pb-1 transition-all";
  const inactiveClass =
    "text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-1 py-1 transition-colors";

  const href = (page: "dashboard" | "horarios" | "avisos") => {
    if (!linkBase) return "#";
    return page === "dashboard" ? linkBase : `${linkBase}/${page}`;
  };

  // Notificaciones (tiempo real)
  const { notifs, unread, markRead, markAllRead } = useRealtimeNotificaciones();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef                  = useRef<HTMLDivElement>(null);

  // Dark mode
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("cbt-tema", "oscuro");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("cbt-tema", "claro");
    }
  }

  // Settings dropdown
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef                     = useRef<HTMLDivElement>(null);

  // User menu dropdown
  const [userOpen, setUserOpen]   = useState(false);
  const userRef                   = useRef<HTMLDivElement>(null);



  // Cerrar panels al clic fuera
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current    && !notifRef.current.contains(e.target as Node))    setNotifOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
      if (userRef.current     && !userRef.current.contains(e.target as Node))     setUserOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);



  // Iniciales del usuario para avatar fallback
  const initials = displayName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  // Mobile nav links
  const mobileRole = linkBase?.includes("/alumno") ? "alumno" :
    linkBase?.includes("/maestro") ? "maestro" :
    linkBase?.includes("/padres") ? "padres" : "admin";
  type MobileLink = { id: string; label: string; category?: string };
  const allSideLinks: MobileLink[] = [
    { id: "inicio",         label: "Inicio" },
    { id: "usuarios",       label: "Usuarios" },
    { id: "calificaciones", label: "Calificaciones" },
    { id: "asistencias",    label: "Asistencias" },
    { id: "grupos",         label: "Grupos" },
    { id: "reportes",       label: "Reportes" },
    { id: "audit-log",      label: "Audit Log" },
    { id: "configuracion",  label: "Configuración de Secciones", category: "contenido" },
    { id: "editar-inicio",  label: "Editar: Inicio",             category: "contenido" },
    { id: "admision",       label: "Editar: Admisión",           category: "contenido" },
    { id: "carreras",       label: "Editar: Carreras",           category: "contenido" },
    { id: "avisos",         label: "Editar: Avisos",             category: "contenido" },
    { id: "contacto",       label: "Editar: Contacto",           category: "contenido" },
    { id: "nosotros",       label: "Editar: Nosotros",           category: "contenido" },
  ];
  let mobileLinks: MobileLink[] = allSideLinks;
  if (mobileRole === "padres") {
    mobileLinks = [
      { id: "inicio",         label: "Inicio" },
      { id: "calificaciones", label: "Calificaciones" },
      { id: "asistencias",    label: "Asistencias" },
    ];
  } else if (mobileRole === "alumno" || mobileRole === "maestro") {
    mobileLinks = allSideLinks.filter((l) => l.id !== "usuarios" && l.id !== "audit-log" && !l.category);
  }
  const mobileSideHref = (id: string) => (!linkBase ? "#" : id === "inicio" ? linkBase : `${linkBase}/${id}`);

  return (
    <>
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-6 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* ── Izquierda: logo + nav ── */}
      <div className="flex items-center gap-2 md:gap-6 min-w-0">
        {linkBase && (
          <button
            className="flex md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2 whitespace-nowrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo CBT Núm. 5" className="h-9 w-auto object-contain" />
          <div className="leading-tight">
            <span className="hidden lg:block text-sm font-extrabold text-blue-900 dark:text-blue-200 leading-none">CBT Núm. 5</span>
            <span className="hidden lg:block text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none mt-0.5">María Amparo Viderique de Shein</span>
            <span className="hidden md:block lg:hidden text-sm font-extrabold text-blue-900 dark:text-blue-200 leading-none">CBT Núm. 5</span>
            <span className="md:block lg:hidden hidden text-[10px] font-medium text-slate-500 dark:text-slate-400">Chalco</span>
            <span className="md:hidden text-sm font-extrabold text-blue-900 dark:text-blue-200">CBT 5</span>
          </div>
        </div>
        <nav className="hidden md:flex gap-4 lg:gap-6">
          <a className={activeTopLink === "dashboard" ? activeClass : inactiveClass} href={href("dashboard")}>Dashboard</a>
          <a className={activeTopLink === "horarios"  ? activeClass : inactiveClass} href={href("horarios")}>Horarios</a>
          <a className={activeTopLink === "avisos"    ? activeClass : inactiveClass} href={href("avisos")}>Avisos</a>
        </nav>
      </div>

      {/* ── Derecha: búsqueda + acciones ── */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Búsqueda */}
        {showSearch && (
          <div className="hidden md:flex relative text-slate-500 dark:text-slate-400">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><IconSearch /></span>
            <input
              className="pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 w-44 lg:w-52 transition-all"
              placeholder="Buscar..."
              type="text"
            />
          </div>
        )}

        {/* ── Dark mode toggle ── */}
        <button
          onClick={toggleDark}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isDark ? (
            /* Sol — modo claro */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.41 0l1.06-1.06a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0zM7.05 18.36l-1.06-1.06a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41z"/>
            </svg>
          ) : (
            /* Luna — modo oscuro */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
          )}
        </button>

        {/* ── Notificaciones ── */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setSettingsOpen(false); setUserOpen(false); }}
            className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Notificaciones"
          >
            <IconBell />
            {unread > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  Notificaciones
                  {unread > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold">{unread} nuevas</span>
                  )}
                </span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">Marcar todas</button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                {notifs.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">Sin notificaciones</p>
                ) : notifs.map((n) => (
                  <a
                    key={n.id}
                    href={linkBase ? `${linkBase}/avisos` : "#"}
                    className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!n.leido ? "bg-blue-50/70 dark:bg-slate-800/60" : ""}`}
                    onClick={() => { markRead(n.id); setNotifOpen(false); }}
                  >
                    <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 whitespace-nowrap ${TIPO_COLOR[n.tipo]}`}>{n.tipo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">{n.titulo}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{n.tiempo}</p>
                    </div>
                    {!n.leido && (
                      <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </a>
                ))}
              </div>
              {linkBase && (
                <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-center">
                  <a href={`${linkBase}/avisos`} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">Ver todos los avisos →</a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Configuración ── */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => { setSettingsOpen((o) => !o); setNotifOpen(false); setUserOpen(false); }}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Configuración"
          >
            <IconSettings />
          </button>

          {settingsOpen && (
            <div className="absolute right-0 top-11 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Configuración</p>
              </div>
              {[
                { label: "Configuración del sistema",  icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",  path: "configuracion" },
                { label: "Periodos escolares",          icon: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z", path: "configuracion/periodos" },
                { label: "Roles y permisos",           icon: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z", path: "configuracion/roles" },
              ].filter((item) => {
                const isAdmin = !linkBase?.includes("/alumno") && !linkBase?.includes("/maestro");
                if (!isAdmin && (item.path === "configuracion/periodos" || item.path === "configuracion/roles")) return false;
                return true;
              }).map((item) => (
                <a
                  key={item.path}
                  href={linkBase ? `${linkBase}/${item.path}` : "#"}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setSettingsOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-500 flex-shrink-0">
                    <path d={item.icon}/>
                  </svg>
                  {item.label}
                </a>
              ))}
              <div className="border-t border-slate-100 dark:border-slate-700">
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={(e) => { e.preventDefault(); setSettingsOpen(false); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-500 flex-shrink-0">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                  </svg>
                  Ayuda y soporte
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ── Usuario / Perfil ── */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserOpen((o) => !o); setNotifOpen(false); setSettingsOpen(false); }}
            className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Mi perfil"
          >
            {displayImage ? (
              <img src={displayImage} alt={userImageAlt} className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {initials || "A"}
              </div>
            )}
            <span className="hidden lg:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">{displayName}</span>
            <span className="hidden lg:block text-slate-400"><IconChevron /></span>
          </button>

          {userOpen && (
            <div className="absolute right-0 top-11 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              {/* Info usuario */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                {displayImage ? (
                  <img src={displayImage} alt={userImageAlt} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center flex-shrink-0">
                    {initials || "A"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{displayRole}</p>
                </div>
              </div>

              {/* Opciones */}
              {[
                { label: "Mi perfil",           icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", path: "perfil" },
                { label: "Cambiar contraseña",  icon: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z", path: "perfil/contrasena" },
              ].map((item) => (
                <a
                  key={item.path}
                  href={linkBase ? `${linkBase}/${item.path}` : "#"}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setUserOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-500 flex-shrink-0">
                    <path d={item.icon}/>
                  </svg>
                  {item.label}
                </a>
              ))}
              <div className="border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => { setUserOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* ── Mobile drawer ── */}
      {mobileMenuOpen && linkBase && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col md:hidden overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="CBT Núm. 5" className="h-10 w-auto object-contain" />
                <div>
                  <div className="text-sm font-black text-blue-900 dark:text-white leading-tight">CBT Núm. 5</div>
                  <div className="text-[10px] text-slate-400">Gestión Escolar</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                aria-label="Cerrar menú"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2 px-3">
              <ul className="flex flex-col gap-1">
                {mobileLinks.map((link, idx) => {
                  const showSep = link.category === "contenido" && idx > 0 && mobileLinks[idx - 1]?.category !== "contenido";
                  return (
                    <div key={link.id}>
                      {showSep && (
                        <div className="my-2 border-t border-slate-200 dark:border-slate-700 pt-2">
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 px-4 uppercase tracking-widest mb-1">Edición de Contenido</p>
                        </div>
                      )}
                      <li>
                        <a
                          href={mobileSideHref(link.id)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    </div>
                  );
                })}
              </ul>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
