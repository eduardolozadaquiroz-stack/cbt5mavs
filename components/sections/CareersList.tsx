"use client";

import CareerArticle from "./CareerArticle";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

export default function CareersList() {
  const { config } = useAdminConfig();
  const { carreras } = config.carreras;

  return (
    <div className="flex flex-col gap-xl">
      {carreras.map((carrera, idx) => (
        <CareerArticle
          key={carrera.id}
          imagePosition={idx % 2 === 0 ? "left" : "right"}
          imageSrc={carrera.imageSrc}
          imageAlt={carrera.imageAlt}
          icon={carrera.icon}
          title={carrera.titulo}
          exitProfile={carrera.perfilEgreso}
          professionalField={carrera.campoProfesional}
          studyHighlights={carrera.destacados}
        />
      ))}
    </div>
  );
}

