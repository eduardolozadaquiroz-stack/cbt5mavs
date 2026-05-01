"use client";

import HeroCarousel from "@/components/sections/HeroCarousel";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

export default function HeroSection() {
  const { config } = useAdminConfig();
  const { hero, carousel } = config.inicio;

  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Carrusel de fondo */}
      <HeroCarousel slides={carousel} />

      {/* Contenido sobre el carrusel */}
      <div className="relative z-10 max-w-container-max mx-auto px-8 py-24 md:py-32 flex flex-col md:w-2/3">
        <span className="text-secondary-fixed font-label-bold text-label-bold uppercase tracking-widest mb-4 inline-block">
          {hero.subtitulo}
        </span>
        <h1 className="font-display-lg text-display-lg text-on-primary mb-6">
          {hero.titulo}
        </h1>
        <p className="font-body-base text-body-base text-surface-container-highest mb-10 max-w-xl">
          {hero.descripcion}
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            className="bg-on-primary text-primary px-6 py-3 rounded-lg font-label-bold text-label-bold hover:bg-surface-container-low transition-colors shadow-sm"
            href={hero.boton1Href}
          >
            {hero.boton1Texto}
          </a>
          <a
            className="bg-transparent border border-secondary-fixed text-secondary-fixed px-6 py-3 rounded-lg font-label-bold text-label-bold hover:bg-primary-container transition-colors"
            href={hero.boton2Href}
          >
            {hero.boton2Texto}
          </a>
        </div>
      </div>
    </section>
  );
}
