interface StudyHighlight {
  text: string;
}

interface CareerArticleProps {
  imagePosition: "left" | "right";
  imageSrc: string;
  imageAlt: string;
  icon: string;
  title: string;
  exitProfile: string;
  professionalField: string;
  studyHighlights: StudyHighlight[];
}

export default function CareerArticle({
  imagePosition,
  imageSrc,
  imageAlt,
  icon,
  title,
  exitProfile,
  professionalField,
  studyHighlights,
}: CareerArticleProps) {
  const imageCol = (
    <div
      className={`lg:col-span-5 relative h-64 lg:h-auto border-b lg:border-b-0 ${
        imagePosition === "left"
          ? "lg:border-r order-1"
          : "lg:border-l order-1 lg:order-2"
      } border-outline-variant`}
    >
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={imageSrc}
        alt={imageAlt}
      />
    </div>
  );

  const contentCol = (
    <div
      className={`lg:col-span-7 p-lg lg:p-xl flex flex-col justify-center ${
        imagePosition === "right" ? "order-2 lg:order-1" : ""
      }`}
    >
      <div className="flex items-center gap-sm mb-sm">
        <span className="material-symbols-outlined text-secondary">{icon}</span>
        <h2 className="font-headline-md text-headline-md text-primary">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mt-md">
        <div>
          <h3 className="font-title-sm text-title-sm text-on-surface mb-xs border-b border-surface-variant pb-xs">
            Perfil de Egreso
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{exitProfile}</p>
        </div>
        <div>
          <h3 className="font-title-sm text-title-sm text-on-surface mb-xs border-b border-surface-variant pb-xs">
            Campo Profesional
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{professionalField}</p>
        </div>
        <div className="md:col-span-2 bg-surface-container-low p-md rounded-lg mt-sm">
          <h3 className="font-title-sm text-title-sm text-primary mb-sm">
            Destacados del Plan de Estudios
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-xs gap-x-md font-body-sm text-body-sm text-on-surface-variant">
            {studyHighlights.map((item, i) => (
              <li key={i} className="flex items-center gap-xs">
                <span className="w-1 h-1 rounded-full bg-secondary"></span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      {imagePosition === "left" ? (
        <>
          {imageCol}
          {contentCol}
        </>
      ) : (
        <>
          {contentCol}
          {imageCol}
        </>
      )}
    </article>
  );
}
