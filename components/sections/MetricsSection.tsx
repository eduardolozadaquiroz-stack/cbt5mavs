"use client";

import { useAdminConfig } from "@/app/context/AdminConfigContext";

const ICONS = ["groups", "school", "menu_book", "history"];
const COLORS = ["text-primary", "text-secondary", "text-primary", "text-secondary"];

export default function MetricsSection() {
  const { config } = useAdminConfig();
  const { metricas } = config.inicio;

  return (
    <section className="py-16 bg-surface-container-lowest border-b border-outline-variant">
      <div className="max-w-container-max mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricas.map((m, i) => (
            <div key={i} className="bg-surface p-6 rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div className={`${COLORS[i % COLORS.length]} mb-2`}>
                <span className="material-symbols-outlined text-[32px]">{ICONS[i % ICONS.length]}</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{m.valor}</h3>
              <p className="font-title-sm text-title-sm text-on-surface-variant mb-2">{m.etiqueta}</p>
              <p className="font-body-sm text-body-sm text-outline">{m.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
