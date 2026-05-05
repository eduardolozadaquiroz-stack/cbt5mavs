"use client";

import { useAdminConfig } from "@/app/context/AdminConfigContext";

export default function ContactoInfoGrid() {
  const { config } = useAdminConfig();
  const c = config.contacto;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">

      {/* Dirección */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-start gap-md hover:shadow-md transition-shadow">
        <div className="bg-surface-container-low p-sm rounded text-primary">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_on
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-1">Dirección</span>
          <span className="font-body-base text-body-base text-on-surface">{c.direccion}</span>
        </div>
      </div>

      {/* Teléfono */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-start gap-md hover:shadow-md transition-shadow">
        <div className="bg-surface-container-low p-sm rounded text-primary">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            call
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-1">Teléfono Institucional</span>
          <a href={`tel:${c.telefono.replace(/\s|\(|\)|-/g, "")}`} className="font-body-base text-body-base text-on-surface hover:text-primary transition-colors">{c.telefono}</a>
          {c.telefono2 && (
            <a href={`tel:${c.telefono2.replace(/\s|\(|\)|-/g, "")}`} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">{c.telefono2}</a>
          )}
        </div>
      </div>

      {/* Correo */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-start gap-md hover:shadow-md transition-shadow">
        <div className="bg-surface-container-low p-sm rounded text-primary">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mail
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-1">Correo Electrónico</span>
          <a href={`mailto:${c.email}`} className="font-body-base text-body-base text-on-surface hover:text-primary transition-colors">{c.email}</a>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Respuesta en 24-48 hrs</span>
        </div>
      </div>

      {/* Horario */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-md shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-start gap-md hover:shadow-md transition-shadow">
        <div className="bg-surface-container-low p-sm rounded text-primary">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            schedule
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-1">Horarios de Turno</span>
          <span className="font-body-base text-body-base text-on-surface">Matutino: {c.horarioMatutino}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Vespertino: {c.horarioVespertino}</span>
        </div>
      </div>

    </div>
  );
}

