export default function AdmisionRequirementsSection() {
  return (
    <section className="w-full bg-surface-container py-[64px]" id="requisitos">
      <div className="max-w-container-max mx-auto px-lg flex flex-col lg:flex-row gap-xl">

        {/* Document Checklist */}
        <div className="flex-1 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm">
          <div className="flex items-center gap-sm mb-md border-b border-outline-variant pb-sm">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              folder_open
            </span>
            <h2 className="font-title-sm text-title-sm text-on-surface">Documentación Requerida</h2>
          </div>
          <ul className="flex flex-col gap-md">
            <li className="flex items-start gap-sm">
              <span
                className="material-symbols-outlined text-primary mt-[2px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <div>
                <h4 className="font-data-tabular text-data-tabular text-on-surface">CURP Certificada</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Descargada recientemente del portal RENAPO, formato PDF.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-sm">
              <span
                className="material-symbols-outlined text-primary mt-[2px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <div>
                <h4 className="font-data-tabular text-data-tabular text-on-surface">Certificado de Secundaria</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  O constancia de estudios original si aún estás cursando el 3er grado.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-sm">
              <span
                className="material-symbols-outlined text-primary mt-[2px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <div>
                <h4 className="font-data-tabular text-data-tabular text-on-surface">Acta de Nacimiento</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Formato actualizado, copia legible.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-sm">
              <span
                className="material-symbols-outlined text-primary mt-[2px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <div>
                <h4 className="font-data-tabular text-data-tabular text-on-surface">Comprobante de Domicilio</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  No mayor a 3 meses de antigüedad (agua, luz o teléfono).
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Major CTA Panel */}
        <div className="flex-1 bg-primary text-on-primary rounded-xl p-xl shadow-md flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <span
              className="material-symbols-outlined text-[200px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              touch_app
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-md">
            <span className="font-label-bold text-label-bold text-inverse-primary uppercase tracking-widest">
              Plataforma Externa
            </span>
            <h2 className="font-headline-md text-headline-md text-on-primary">
              Registrarse en plataforma oficial (ECOEMS)
            </h2>
            <p className="font-body-base text-body-base text-primary-fixed-dim mb-md">
              El registro formal y la generación de tu folio se realiza exclusivamente a través del portal
              estatal Mi Derecho Mi Lugar. Asegúrate de tener tus documentos a la mano antes de iniciar.
            </p>
            <a
              className="bg-surface-container-lowest text-primary font-label-bold text-label-bold px-lg py-md rounded-lg hover:bg-surface transition-colors shadow-sm inline-flex items-center justify-center gap-sm w-fit"
              href="https://www.miderechomilugar.gob.mx"
              rel="noopener noreferrer"
              target="_blank"
            >
              Ir a miderechomilugar.gob.mx
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
