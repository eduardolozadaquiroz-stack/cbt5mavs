"use client";

import Link from "next/link";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

export default function CareersSection() {
  const { config } = useAdminConfig();
  const { carreras } = config.carreras;

  if (carreras.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-container-max mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="font-display-lg text-display-lg text-on-surface mb-4">Nuestras Carreras</h2>
          <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto">
            Programas diseñados para brindarte habilidades prácticas y conocimientos teóricos, preparándote para el entorno laboral real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {carreras.map((carrera) => (
            <div key={carrera.id} className="bg-white rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <img
                  className="w-full h-full object-cover"
                  alt={carrera.imageAlt}
                  src={carrera.imageSrc}
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{carrera.titulo}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                  {carrera.perfilEgreso}
                </p>
                <div className="mb-4">
                  <h4 className="font-label-bold text-label-bold text-primary mb-1 uppercase">Aprenderás</h4>
                  <ul className="font-body-sm text-body-sm text-on-surface-variant list-disc pl-4 space-y-1">
                    {carrera.destacados.slice(0, 3).map((h, i) => (
                      <li key={i}>{h.text}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6 flex-grow">
                  <h4 className="font-label-bold text-label-bold text-secondary mb-1 uppercase">Campo Laboral</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {carrera.campoProfesional}
                  </p>
                </div>
                <Link
                  href="/carreras"
                  className="inline-flex items-center justify-center bg-surface-container text-primary font-label-bold text-label-bold py-2 px-4 rounded hover:bg-surface-container-high transition-colors w-full"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
