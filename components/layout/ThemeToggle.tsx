"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("cbt-tema") : null;
    if (stored) {
      setDark(stored === "oscuro");
    } else {
      setDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cbt-tema", next ? "oscuro" : "claro");
    } catch (_) {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={dark}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 inline-flex items-center justify-center w-8 h-8"
    >
      <span className="material-symbols-outlined text-[20px] leading-none select-none">
        {dark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
