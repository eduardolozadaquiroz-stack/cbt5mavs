"use client";

import { useAdminConfig } from "@/app/context/AdminConfigContext";

const DEFAULT_ICONS: Record<string, string> = {
  alumnos: "groups",
  egresados: "school",
  docentes: "person",
  carreras: "menu_book",
  antiguedad: "history",
  promedio: "trending_up",
  eficiencia: "speed",
};

const DEFAULT_COLORS: Record<string, string> = {
  alumnos: "text-primary",
  egresados: "text-secondary",
  docentes: "text-primary",
  carreras: "text-secondary",
  antiguedad: "text-primary",
  promedio: "text-secondary",
  eficiencia: "text-primary",
};

export default function MetricsSection() {
  const { config } = useAdminConfig();
  const { metricas } = config.inicio;

  if (metricas.length === 0) {
    return (
      <section className="py-16 bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-8">
          <p className="text-center text-on-surface-variant">No hay métricas configuradas.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-surface-container-lowest border-b border-outline-variant">
      <div className="max-w-container-max mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricas.map((m, i) => {
            const slug = (m.etiqueta ?? "").toLowerCase().replace(/\s+/g, "_");
            const icon = DEFAULT_ICONS[slug] ?? DEFAULT_ICONS.alumnos;
            const color = DEFAULT_COLORS[slug] ?? DEFAULT_COLORS.alumnos;
            return (
              <div key={`${m.etiqueta}-${i}`} className="bg-surface p-6 rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
                <div className={`${color} mb-2`}>
                  <span className="material-symbols-outlined text-[32px]">{icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{m.valor}</h3>
                <p className="font-title-sm text-title-sm text-on-surface-variant mb-2">{m.etiqueta}</p>
                <p className="font-body-sm text-body-sm text-outline">{m.descripcion}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
