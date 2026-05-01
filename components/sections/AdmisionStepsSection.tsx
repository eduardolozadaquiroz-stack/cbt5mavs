export default function AdmisionStepsSection() {
  return (
    <section className="max-w-container-max mx-auto w-full px-lg py-[64px]" id="registro">
      <div className="flex flex-col gap-sm mb-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Fases del Proceso</h2>
        <p className="font-body-base text-body-base text-on-surface-variant">
          Sigue estos cuatro pasos obligatorios para completar tu admisión.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">

        {/* Step 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-md opacity-10 group-hover:opacity-20 transition-opacity">
            <span
              className="material-symbols-outlined text-[80px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              app_registration
            </span>
          </div>
          <div className="flex flex-col h-full relative z-10">
            <span className="font-display-lg text-display-lg text-secondary-container mb-sm">1</span>
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">Registro en línea</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">
              Captura de datos en la plataforma oficial del estado.
            </p>
            <div className="mt-md bg-surface-container py-xs px-sm rounded-DEFAULT inline-flex items-center gap-xs w-fit">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">calendar_today</span>
              <span className="font-data-tabular text-data-tabular text-on-surface">17 Mar - 14 Abr</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-md opacity-10 group-hover:opacity-20 transition-opacity">
            <span
              className="material-symbols-outlined text-[80px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              payments
            </span>
          </div>
          <div className="flex flex-col h-full relative z-10">
            <span className="font-display-lg text-display-lg text-secondary-container mb-sm">2</span>
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">Pago de derechos</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">
              Generación de formato y pago en instituciones autorizadas.
            </p>
            <div className="mt-md bg-surface-container py-xs px-sm rounded-DEFAULT inline-flex items-center gap-xs w-fit">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">receipt_long</span>
              <span className="font-data-tabular text-data-tabular text-on-surface">Conserva el voucher</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-md opacity-10 group-hover:opacity-20 transition-opacity">
            <span
              className="material-symbols-outlined text-[80px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              quiz
            </span>
          </div>
          <div className="flex flex-col h-full relative z-10">
            <span className="font-display-lg text-display-lg text-secondary-container mb-sm">3</span>
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">Examen de asignación</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">
              Presentación de la evaluación en la sede indicada en tu comprobante.
            </p>
            <div className="mt-md bg-surface-container py-xs px-sm rounded-DEFAULT inline-flex items-center gap-xs w-fit">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">location_on</span>
              <span className="font-data-tabular text-data-tabular text-on-surface">Sede presencial</span>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-md opacity-10 group-hover:opacity-20 transition-opacity">
            <span
              className="material-symbols-outlined text-[80px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              assignment_turned_in
            </span>
          </div>
          <div className="flex flex-col h-full relative z-10">
            <span className="font-display-lg text-display-lg text-secondary-container mb-sm">4</span>
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">Resultados</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">
              Consulta de plantel asignado e inicio de inscripciones.
            </p>
            <div className="mt-md bg-surface-container py-xs px-sm rounded-DEFAULT inline-flex items-center gap-xs w-fit">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">publish</span>
              <span className="font-data-tabular text-data-tabular text-on-surface">Plataforma oficial</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
