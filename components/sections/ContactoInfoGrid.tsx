export default function ContactoInfoGrid() {
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
          <span className="font-body-base text-body-base text-on-surface">Rio La Compañía Mz. 79-Lt. 1, Sección VI</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Conjunto Hab. Los Héroes Chalco, 56644 Chalco de Díaz Covarrubias, Méx.</span>
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
          <a href="tel:+525551240355" className="font-body-base text-body-base text-on-surface hover:text-primary transition-colors">+52 (55) 5124 0355</a>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Lunes a Viernes en horario escolar</span>
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
          <span className="font-body-base text-body-base text-on-surface">contacto@cbt5chalco.edu.mx</span>
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
          <span className="font-body-base text-body-base text-on-surface">Matutino: 07:00 AM – 01:00 PM</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Vespertino: 01:00 PM – 07:00 PM</span>
        </div>
      </div>

    </div>
  );
}
