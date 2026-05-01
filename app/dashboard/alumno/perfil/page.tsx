"use client";
import { useRef } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBJFu1eTFJVZnEIpf-KZZvSc_2ffZQGUirP05eqMK12TVBzwigT9EauHtrNVGTd-67_1LsY_0TUiZTt05HcyZXomBqsm1Kv6mJ9lOeQcUvsx9rZTLrY0ASxcVj2CMDkmyby29mUF551eD7wf5moJ9QLCBGlQObDInlM23i5b7BpfDkM3436o3JteJDAyE28ef_KoT1fTG6ZYBYE3KNLPUgFcRV7Y5IldhFMLtpChj4-jm42Hz2QxVhJU5Gbk1KUKsL6zRDWY4Uoiz6";

export default function PerfilAlumnoPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        linkBase="/dashboard/alumno"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="inicio" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[800px] mx-auto p-md lg:p-lg">

            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-background">Mi Perfil</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Información personal y datos de tu cuenta.
              </p>
            </div>

            {/* Avatar + name card */}
            <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-md">
              <div className="h-28 bg-gradient-to-r from-primary to-secondary" />
              <div className="px-lg pb-lg flex flex-col sm:flex-row sm:items-end gap-md" style={{ marginTop: "-2.5rem" }}>
                {/* Avatar with upload button */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md">
                    <img src={AVATAR} alt="Foto de perfil" className="w-full h-full object-cover" id="alumno-avatar-img" />
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
                      const img = document.getElementById("alumno-avatar-img") as HTMLImageElement;
                      if (img) img.src = url;
                    }}
                  />
                </div>
                <div className="pb-2 pt-10 sm:pt-0">
                  <h3 className="font-title-sm text-title-sm text-on-surface">García López, Valentina</h3>
                  <p className="text-xs text-on-surface-variant">No. Control: 220301 · 3°IM-A · Informática</p>
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
                  { label: "Nombre completo",   value: "García López, Valentina" },
                  { label: "No. de control",    value: "220301" },
                  { label: "Grupo",             value: "3° IM-A" },
                  { label: "Carrera",           value: "Informática" },
                  { label: "Semestre",          value: "3° Semestre" },
                  { label: "Turno",             value: "Matutino" },
                  { label: "Correo institucional", value: "v.garcia@cbt5chalco.edu.mx" },
                  { label: "Ciclo escolar",     value: "2023-2024" },
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
