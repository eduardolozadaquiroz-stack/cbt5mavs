"use client";

import { useEffect, useState, useRef } from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

type NavPage = "inicio" | "carreras" | "admision" | "avisos" | "contacto" | "nosotros";

interface NavbarProps {
  activePage?: NavPage;
}

const navLinks: { label: string; page: NavPage; href: string }[] = [
  { label: "Inicio",    page: "inicio",    href: "/" },
  { label: "Carreras",  page: "carreras",  href: "/carreras" },
  { label: "Admisión",  page: "admision",  href: "/admision" },
  { label: "Nosotros",  page: "nosotros",  href: "/nosotros" },
  { label: "Avisos",    page: "avisos",    href: "/avisos" },
  { label: "Contacto",  page: "contacto",  href: "/contacto" },
];

// ── Hook: smart navbar — oculta al bajar, reaparece al subir ─────────────────
function useSmartNavbar(threshold = 80) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (currentY < threshold) {
        // Siempre visible cuando estamos cerca del top
        setVisible(true);
      } else if (diff > 4) {
        // Scrolleando hacia abajo más de 4px → ocultar
        setVisible(false);
      } else if (diff < -4) {
        // Scrolleando hacia arriba más de 4px → mostrar
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return visible;
}

export default function Navbar({ activePage }: NavbarProps) {
  const { config } = useAdminConfig();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navVisible = useSmartNavbar(80);

  // Filtrar links según la configuración del contexto (incluye secciones y admision.habilitada)
  const filteredNavLinks = navLinks.filter(({ page }) => {
    const sectionEnabled = config.secciones?.[page]?.enabled;
    if (sectionEnabled !== undefined) return sectionEnabled;
    // Fallback específico para admisión: usar admision.habilitada
    if (page === "admision") return config.admision?.habilitada !== false;
    return true;
  });

  return (
    <header
      style={{
        transform: navVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className="bg-[#eef2f8] dark:bg-slate-950 font-public-sans text-sm tracking-tight w-full fixed top-0 left-0 right-0 z-50 border-b border-[#d8e2f0] dark:border-slate-800 shadow-sm"
    >
      <div className="flex justify-between items-center w-full px-8 py-3 max-w-[1280px] mx-auto">

        {/* Logo + Nombre */}
        <a href="/" className="flex items-center gap-2.5 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Logo CBT Núm. 5"
            className="h-12 w-auto flex-shrink-0"
          />
          <div className="font-extrabold text-blue-900 dark:text-blue-50 leading-tight">
            <span className="hidden lg:inline text-[15px]">CBT Núm. 5 – María Amparo Viderique de Shein</span>
            <span className="hidden sm:inline lg:hidden text-[15px]">CBT Núm. 5 Chalco</span>
            {/* En móvil solo se muestra el logo */}
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {filteredNavLinks.map(({ label, page, href }) =>
            activePage === page ? (
              <a
                key={page}
                className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 pb-1 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-[#e4eaf3] dark:hover:bg-slate-900 transition-all active:scale-95 duration-150 px-2 rounded-t"
                href={href}
              >
                {label}
              </a>
            ) : (
              <a
                key={page}
                className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 hover:bg-[#e4eaf3] dark:hover:bg-slate-900 transition-all active:scale-95 duration-150 px-2 py-1 rounded"
                href={href}
              >
                {label}
              </a>
            )
          )}
        </nav>

        {/* Acciones — escritorio */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <a
            className="text-blue-700 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-all active:scale-95 duration-150 ml-2"
            href="/login"
          >
            Portal Escolar
          </a>
        </div>

        {/* Acciones — móvil */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="text-slate-600 dark:text-slate-400 p-1"
          >
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>

      </div>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#d8e2f0] dark:border-slate-800 bg-[#eef2f8] dark:bg-slate-950 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {filteredNavLinks.map(({ label, page, href }) => (
              <a
                key={page}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activePage === page
                    ? "text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/30"
                    : "text-slate-700 dark:text-slate-300 hover:bg-[#e4eaf3] dark:hover:bg-slate-900"
                }`}
              >
                {label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
            >
              Portal Escolar
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
