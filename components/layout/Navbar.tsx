"use client";

import { useEffect, useState, useRef } from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";

type NavPage = "inicio" | "carreras" | "admision" | "avisos" | "contacto" | "nosotros";

interface NavbarProps {
  activePage?: NavPage;
}

interface SectionsConfig {
  [key: string]: { enabled: boolean };
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
  const [sectionsConfig, setSectionsConfig] = useState<SectionsConfig>({});
  const [loading, setLoading] = useState(true);
  const navVisible = useSmartNavbar(80);

  useEffect(() => {
    const fetchSectionsConfig = async () => {
      try {
        const response = await fetch("/api/admin/admision-config");
        const data: SectionsConfig = await response.json();
        setSectionsConfig(data);
      } catch (error) {
        console.error("Error fetching sections config:", error);
        // Por defecto mostrar todas las secciones si hay error
        const defaultConfig: SectionsConfig = {};
        navLinks.forEach(link => {
          defaultConfig[link.page] = { enabled: true };
        });
        setSectionsConfig(defaultConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionsConfig();
  }, []);

  // Filtrar links según la configuración
  const filteredNavLinks = navLinks.filter(
    (link) => sectionsConfig[link.page]?.enabled !== false
  );

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
          <button className="text-slate-600 dark:text-slate-400 p-1">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

      </div>
    </header>
  );
}
