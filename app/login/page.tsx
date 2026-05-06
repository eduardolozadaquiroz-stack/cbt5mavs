"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle";

type Role = "alumno" | "maestro" | "admin" | "padres";

const roles: { id: Role; label: string; icon: string }[] = [
  {
    id: "alumno",
    label: "Alumno",
    icon: "/icons/alumno.svg",
  },
  {
    id: "maestro",
    label: "Maestro",
    icon: "/icons/maestro.svg",
  },
  {
    id: "admin",
    label: "Admin",
    icon: "/icons/admin.svg",
  },
  {
    id: "padres",
    label: "Padres",
    icon: "/icons/padres.svg",
  },
];

const dashboardRoutes: Record<Role, string> = {
  alumno: "/dashboard/alumno",
  maestro: "/dashboard/maestro",
  admin: "/dashboard/administrador",
  padres: "/dashboard/padres",
};


export default function LoginPage() {
  const [activeRole, setActiveRole] = useState<Role>("alumno");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alumnoInputType, setAlumnoInputType] = useState<"matricula" | "correo">("matricula");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = (formData.get("matricula") as string).trim();
    const pass = (formData.get("password") as string);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: pass, rol: activeRole }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Error al iniciar sesión. Intenta de nuevo.");
        return;
      }

      // Redirigir al dashboard correspondiente
      router.push(json.redirect ?? dashboardRoutes[activeRole]);
    } catch {
      setError("Error de red. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botón flotante de tema — esquina superior derecha */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-sm border border-outline-variant/30">
          <ThemeToggle />
        </div>
      </div>

      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-container-low dark:bg-slate-950 font-public-sans">

      {/* Brand header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo CBT Núm. 5" className="w-16 h-16 object-contain" />
        </div>
        <h2 className="font-title-sm text-title-sm text-primary dark:text-blue-400 tracking-tight">CBT Núm. 5 Chalco</h2>
      </div>

      {/* Card */}
      <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">

        {/* Card header */}
        <div className="px-10 pt-10 pb-4">
          <div className="flex items-center gap-2 mb-3">
            {/* Icon del rol activo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={roles.find(r => r.id === activeRole)?.icon} 
              alt={activeRole} 
              className="w-6 h-6 dark:brightness-0 dark:invert transition-all" 
            />
            <span className="font-label-bold text-label-bold text-primary capitalize">
              {activeRole === "padres" ? "Padres" : activeRole === "admin" ? "Administrador" : activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Portal Escolar</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Ingresa para acceder a tus servicios académicos</p>
        </div>

        <div className="px-10 pb-10">

          {/* Role tabs */}
          <div className="bg-surface-container rounded-lg p-1 flex gap-1 mb-6 border border-outline-variant/30">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => { setActiveRole(role.id); setError(""); }}
                className={`flex-1 py-2 px-1 rounded text-xs font-bold tracking-wide transition-all flex justify-center items-center gap-1.5 ${
                  activeRole === role.id
                    ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-outline-variant/50"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/50"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={role.icon} alt={role.label} className="w-4 h-4 dark:brightness-0 dark:invert transition-all" />
                {role.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Campo dinámico - Matrícula (solo alumno) o Usuario/Correo (otros roles) */}
            <div className="flex flex-col gap-1">
              {/* Toggle Matrícula/Correo solo para Alumno */}
              {activeRole === "alumno" && (
                <div className="bg-surface-container rounded-lg p-1 flex gap-1 mb-2 border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setAlumnoInputType("matricula")}
                    className={`flex-1 py-1.5 rounded text-xs font-bold tracking-wide transition-all ${
                      alumnoInputType === "matricula"
                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-outline-variant/50"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Matrícula
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlumnoInputType("correo")}
                    className={`flex-1 py-1.5 rounded text-xs font-bold tracking-wide transition-all ${
                      alumnoInputType === "correo"
                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-outline-variant/50"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Correo
                  </button>
                </div>
              )}

              <label htmlFor="matricula" className="font-label-bold text-label-bold text-on-surface">
                {activeRole === "alumno" 
                  ? (alumnoInputType === "matricula" ? "Matrícula" : "Correo electrónico")
                  : activeRole === "padres"
                  ? "Correo electrónico"
                  : "Usuario o Correo"
                }
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  {(activeRole === "padres" || (activeRole === "alumno" && alumnoInputType === "correo")) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9 10.76 6.75 12 6.75zM17 17H7v-.75c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z"/>
                    </svg>
                  )}
                </div>
                <input
                  id="matricula"
                  name="matricula"
                  type={
                    activeRole === "padres" 
                      ? "email" 
                      : activeRole === "alumno" && alumnoInputType === "correo"
                      ? "email"
                      : "text"
                  }
                  required
                  autoComplete={
                    activeRole === "padres" || (activeRole === "alumno" && alumnoInputType === "correo")
                      ? "email"
                      : "username"
                  }
                  placeholder={
                    activeRole === "alumno" 
                      ? (alumnoInputType === "matricula" ? "Ej. 192039402" : "Ej. nombre@correo.com")
                      : activeRole === "padres"
                      ? "Ej. correo@ejemplo.com"
                      : "Ej. jperez"
                  }
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-outline-variant rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline-variant"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-label-bold text-label-bold text-on-surface">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-800 border border-outline-variant rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary transition-colors placeholder:text-outline-variant"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>


            {/* Olvidaste contraseña */}
            <div className="flex justify-end -mt-1">
              <Link href="/recuperar-contrasena" className="font-body-sm text-body-sm text-primary hover:underline transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Error de credenciales */}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 bg-primary text-white font-label-bold text-label-bold py-3 px-4 rounded-lg shadow-sm hover:shadow-md hover:bg-on-primary-fixed-variant transition-all flex justify-center items-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Footer del card */}
        <div className="bg-surface-container-low px-10 py-4 border-t border-outline-variant/50 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            ¿Problemas de acceso?{" "}
            <Link href="/contacto" className="text-primary font-medium hover:underline">
              Contactar a soporte
            </Link>
          </p>
        </div>
      </div>

      {/* Link regresar */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-surface-container"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Regresar al Inicio
        </Link>
      </div>

    </main>
    </>
  );
}
