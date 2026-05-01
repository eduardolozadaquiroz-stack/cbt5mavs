"use client";

import { useAdminConfig } from "@/app/context/AdminConfigContext";

export default function CarrerasHeroSection() {
  const { config } = useAdminConfig();
  const { heroTitulo, heroDescripcion } = config.carreras;

  return (
    <div className="mb-xl text-center">
      <h1 className="font-display-lg text-display-lg text-primary mb-md">
        {heroTitulo}
      </h1>
      <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto">
        {heroDescripcion}
      </p>
    </div>
  );
}
