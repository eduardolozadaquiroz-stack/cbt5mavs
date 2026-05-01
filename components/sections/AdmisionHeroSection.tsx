"use client";

import { useAdminConfig } from "@/app/context/AdminConfigContext";

export default function AdmisionHeroSection() {
  const { config } = useAdminConfig();
  const admision = config.admision;

  if (!admision.habilitada) {
    return (
      <section className="w-full bg-surface-container-low border-b border-outline-variant py-20">
        <div className="max-w-container-max mx-auto px-lg text-center">
          <p className="text-on-surface-variant font-body-base text-body-base">
            La sección de admisión se encuentra deshabilitada.
          </p>
        </div>
      </section>
    );
  }

  const fechaInicio = new Date(admision.fechaInicio);
  const fechaCierre = new Date(admision.fechaCierre);

  return (
    <section className="w-full bg-surface-container-low border-b border-outline-variant relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-surface-container-high to-transparent opacity-50 pointer-events-none"></div>

      <div className="max-w-container-max mx-auto px-lg py-[80px] flex flex-col md:flex-row items-center gap-xl relative z-10">
        {/* Left: Text content */}
        <div className="flex-1 flex flex-col gap-md">
          <span className="font-label-bold text-label-bold uppercase tracking-widest inline-block w-fit px-sm py-xs rounded-DEFAULT bg-blue-100 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200">
            Convocatoria 2024
          </span>
          <h1 className="font-display-lg text-display-lg text-on-surface">
            Proceso de Admisión ECOEMS
          </h1>
          <p className="font-body-base text-body-base text-on-surface-variant max-w-[600px]">
            Asegura tu lugar en nuestra institución de excelencia técnica. Sigue cuidadosamente los pasos
            del proceso estatal de asignación para la educación media superior.
          </p>

          {/* Fechas importantes */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-2 mb-4">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">📅 Fechas Importantes:</p>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p>
                <strong>Inicio:</strong> {fechaInicio.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p>
                <strong>Cierre:</strong> {fechaCierre.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p>
                <strong>Cupo:</strong> {admision.cupoActual} lugares disponibles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-md mt-sm">
            <a
              className="bg-primary text-on-primary font-label-bold text-label-bold px-lg py-md rounded-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm flex items-center gap-sm"
              href="#registro"
            >
              Iniciar Registro
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </a>
            <a
              className="bg-surface-container-lowest text-on-surface font-label-bold text-label-bold px-lg py-md rounded-lg hover:bg-surface transition-colors border border-outline-variant shadow-sm flex items-center gap-sm"
              href="#requisitos"
            >
              Ver Requisitos
              <span className="material-symbols-outlined text-[18px]">list_alt</span>
            </a>
          </div>
        </div>

        {/* Right: Image */}
        <div className="flex-1 w-full flex justify-end">
          <div
            className="w-full max-w-[500px] aspect-video bg-surface-container-highest rounded-xl shadow-sm border border-outline-variant overflow-hidden relative"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDe1IlOYHKzQFedx3130dL8ETAdLjc-WZn32Jjih3UDKgF1Alse9yxwiUd2hD3vsgwKTAIgLTgBLMOKMtI53_ZtBwOVLdeanWrl-n3lGs1gYVcNjNhPHIxjTSEE-binAdw1GobDsXU-IAcrb7gLFue00PL68Xgz1lCzYDPOqwqxjr9-MC9rCMhrmdWUNPafpuiCT8r2bGHYtI5oYpLe9zHU8oA0yZusJbKgERiJm36yxTVMyYUrEpWAQ6rryoPv9qFHbD6Vy4Fx6c6l')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-primary opacity-10 mix-blend-multiply"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

