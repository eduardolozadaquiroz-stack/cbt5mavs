"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
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

function useSmartNavbar(threshold = 80) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (prefersReducedMotion) {
        setVisible(currentY < threshold + 200);
      } else if (currentY < threshold) {
        setVisible(true);
      } else if (diff > 4) {
        setVisible(false);
      } else if (diff < -4) {
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navVisible = useSmartNavbar(80);
  const mobileMenuId = "mobile-nav-menu";

  useEffect(() => {
    const fetchSectionsConfig = async () => {
      try {
        const response = await fetch("/api/admin/admision-config");
        const data: SectionsConfig = await response.json();
        setSectionsConfig(data);
      } catch {
        const defaultConfig: SectionsConfig = {};
        navLinks.forEach(link => {
          defaultConfig[link.page] = { enabled: true };
        });
        setSectionsConfig(defaultConfig);
      }
    };

    fetchSectionsConfig();
  }, []);

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
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <img
            src="/logo.png"
            alt="Logo CBT Núm. 5"
            className="h-12 w-auto flex-shrink-0"
            width={48}
            height={48}
          />
          <div className="font-extrabold text-blue-900 dark:text-blue-50 leading-tight">
            <span className="hidden lg:inline text-[15px]">CBT Núm. 5 – María Amparo Viderique de Shein</span>
            <span className="hidden sm:inline lg:hidden text-[15px]">CBT Núm. 5 Chalco</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Navegación principal">
          {filteredNavLinks.map(({ label, page, href }) =>
            activePage === page ? (
              <Link
                key={page}
                href={href}
                aria-current="page"
                className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 pb-1 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-[#e4eaf3] dark:hover:bg-slate-900 transition-all active:scale-95 duration-150 px-2 rounded-t"
              >
                {label}
              </Link>
            ) : (
              <Link
                key={page}
                href={href}
                className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 hover:bg-[#e4eaf3] dark:hover:bg-slate-900 transition-all active:scale-95 duration-150 px-2 py-1 rounded"
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* Acciones — escritorio */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-blue-700 dark:text-blue-500 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-all active:scale-95 duration-150 ml-2"
          >
            Portal Escolar
          </Link>
        </div>

        {/* Acciones — móvil */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="text-slate-600 dark:text-slate-400 p-1"
          >
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>

      </div>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <div
          id={mobileMenuId}
          className="md:hidden border-t border-[#d8e2f0] dark:border-slate-800 bg-[#eef2f8] dark:bg-slate-950 px-4 pb-4"
        >
          <nav className="flex flex-col gap-1 pt-2" role="navigation" aria-label="Menú móvil">
            {filteredNavLinks.map(({ label, page, href }) => (
              <Link
                key={page}
                href={href}
                onClick={() => setMobileOpen(false)}
                aria-current={activePage === page ? "page" : undefined}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activePage === page
                    ? "text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/30"
                    : "text-slate-700 dark:text-slate-300 hover:bg-[#e4eaf3] dark:hover:bg-slate-900"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
            >
              Portal Escolar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
