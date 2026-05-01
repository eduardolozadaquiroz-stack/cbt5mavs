"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cbt-tema", next ? "oscuro" : "claro");
    } catch (_) {}
  }

  // Durante SSR y primera hidratación renderiza un placeholder del mismo tamaño
  // para evitar el mismatch que causa el flash y el desajuste
  if (!mounted) {
    return <div className="w-8 h-8 flex-shrink-0" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
    >
      <span className="material-symbols-outlined text-[20px] leading-none select-none">
        {dark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
