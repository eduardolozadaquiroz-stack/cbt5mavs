"use client";
import { useRef } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEzpJcll0X5d9jtID0KZQY9DQZRRq2urTYr7OTdd5wbN3bwTITJS_udArelmyFwKHp52jZMTZigPK27koZBzrOk8apUTBoENBTNSQ_9UV341OiiIG2ayvR2P6RSKF_-zlJhwraxvKTWP30vx0XqFtP3QHDJZtZ5q0FsLnV0k_-5Y9u3x3nfcJe2qD7R3eQk7iDmNl6Al0VZjLNgQ06SdDzzwjB1yyZU_u4Aiu24ZTFsCj_CbalIFeIYzf8-mCoS4Y8hn9Ux-Vpjacf";

export default function PerfilMaestroPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        linkBase="/dashboard/maestro"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="inicio" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[800px] mx-auto p-md lg:p-lg">

            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-background">Mi Perfil</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Información personal y datos de tu cuenta docente.
              </p>
            </div>

            {/* Avatar + name */}
            <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-md">
              <div className="h-28 bg-gradient-to-r from-primary to-secondary" />
              <div className="px-lg pb-lg flex flex-col sm:flex-row sm:items-end gap-md" style={{ marginTop: "-2.5rem" }}>
                {/* Avatar with upload button */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md">
                    <img src={AVATAR} alt="Foto de perfil" className="w-full h-full object-cover" id="maestro-avatar-img" />
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow border-2 border-white hover:bg-primary/90 transition-colors"
                    title="Cambiar foto"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>photo_camera</span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      const img = document.getElementById("maestro-avatar-img") as HTMLImageElement;
                      if (img) img.src = url;
                    }}
                  />
                </div>
                <div className="pb-2 pt-10 sm:pt-0">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Prof. Ramos Hernández, Miguel</h3>
                  <p className="text-xs text-on-surface-variant">RFC: RAHM780415 · Turno Matutino · Matemáticas / Ciencias</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="p-md border-b border-outline-variant bg-surface-bright">
                <h3 className="font-title-sm text-title-sm text-on-surface">Datos Generales</h3>
              </div>
              <div className="divide-y divide-outline-variant">
                {[
                  { label: "Nombre completo",      value: "Ramos Hernández, Miguel" },
                  { label: "RFC",                   value: "RAHM780415XXX" },
                  { label: "No. de empleado",       value: "EMP-2041" },
                  { label: "Área académica",        value: "Ciencias Básicas y Matemáticas" },
                  { label: "Turno",                 value: "Matutino" },
                  { label: "Grupos asignados",      value: "301-G · 302-G · 301-I" },
                  { label: "Correo institucional",  value: "m.ramos@cbt5chalco.edu.mx" },
                  { label: "Ciclo escolar",         value: "2023-2024" },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col sm:flex-row sm:items-center px-md py-sm gap-1 sm:gap-0">
                    <span className="text-xs text-on-surface-variant font-medium sm:w-48 flex-shrink-0">{row.label}</span>
                    <span className="text-sm text-on-surface">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
