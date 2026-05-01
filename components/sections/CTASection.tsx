export default function CTASection() {
  return (
    <section className="py-16 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Notice Banner */}
          <div className="bg-primary-container text-on-primary-container p-8 rounded-xl flex flex-col justify-between border border-primary-fixed">
            <div>
              <div className="inline-block bg-primary text-on-primary px-3 py-1 rounded-full font-label-bold text-label-bold mb-4">
                Aviso Importante
              </div>
              <h3 className="font-headline-md text-headline-md mb-2">
                Inscripciones abiertas ciclo escolar 2024
              </h3>
              <p className="font-body-base text-body-base text-primary-fixed-dim mb-6">
                Asegura tu lugar en nuestra institución. Consulta las fechas y requisitos para el proceso de admisión del nuevo ciclo.
              </p>
            </div>
            <div>
              <a href="/admision" className="inline-block bg-on-primary text-primary px-6 py-2 rounded font-label-bold text-label-bold hover:bg-surface transition-colors">
                Ver detalles
              </a>
            </div>
          </div>

          {/* Admission CTA */}
          <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary">verified</span>
                <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wide">
                  Plataforma Oficial Estatal
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                Regístrate ahora en la plataforma oficial
              </h3>
              <p className="font-body-base text-body-base text-on-surface-variant mb-6">
                El registro para aspirantes se realiza exclusivamente a través del portal gubernamental &ldquo;Mi Derecho, Mi Lugar&rdquo;.
              </p>
            </div>
            <div>
              <a
                className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-6 py-2 rounded font-label-bold text-label-bold hover:bg-on-secondary-fixed transition-colors"
                href="https://www.miderechomilugar.gob.mx"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Ir a miderechomilugar.gob.mx</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
