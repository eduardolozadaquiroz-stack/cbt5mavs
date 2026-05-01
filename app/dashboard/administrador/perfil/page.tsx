"use client";

import { useState, useRef } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";

const BASE = "/dashboard/administrador";

export default function PerfilPage() {
  const [form, setForm] = useState({
    nombre: "María Amparo Viderique de Shein",
    email: "viderique@cbt5.edu.mx",
    telefono: "55 1234 5678",
    cargo: "Directora General",
    carrera: "Administración Educativa",
  });
  const [saved, setSaved] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result as string);
    reader.readAsDataURL(f);
  }

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); setSaved(false); }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  const initials = form.nombre.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const inputBase =
    "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora"
        activeTopLink="perfil" showSearch linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mi perfil</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Información personal y datos de la cuenta</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tarjeta de avatar */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5 flex flex-col items-center gap-3">
                {imgSrc ? (
                  <img src={imgSrc} alt="Foto de perfil" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold select-none">
                    {initials}
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{form.nombre}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{form.cargo}</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                  </svg>
                  Cambiar foto
                </button>
                <div className="w-full border-t border-slate-100 dark:border-slate-700 pt-3">
                  <Link
                    href={`${BASE}/perfil/contrasena`}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-400">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    Cambiar contraseña
                  </Link>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="md:col-span-2">
              <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-4">Datos personales</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelBase}>Nombre completo</label>
                    <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Correo institucional</label>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Teléfono</label>
                    <input type="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Cargo</label>
                    <input value={form.cargo} onChange={(e) => set("cargo", e.target.value)} className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Carrera / Especialidad</label>
                    <input value={form.carrera} onChange={(e) => set("carrera", e.target.value)} className={inputBase} />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  {saved && (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Cambios guardados
                    </span>
                  )}
                  <div className="ml-auto">
                    <button type="submit" className="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors">
                      Guardar cambios
                    </button>
                  </div>
                </div>
              </form>

              {/* Info de sesión */}
              <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-3">Información de sesión</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: "Rol",           val: "Administrador" },
                    { label: "Último acceso", val: "Hoy, 08:15 a.m." },
                    { label: "IP de acceso",  val: "192.168.1.10" },
                    { label: "Ciclo activo",  val: "2023-2024" },
                    { label: "Institución",   val: "CBT Núm. 5, Chalco" },
                    { label: "Sistema",       val: "v1.0.0" },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5">
                      <p className="text-slate-400 mb-0.5">{label}</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
