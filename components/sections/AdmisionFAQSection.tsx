export default function AdmisionFAQSection() {
  return (
    <section className="max-w-container-max mx-auto w-full px-lg py-[64px]">
      <div className="flex flex-col items-center text-center gap-sm mb-xl">
        <h2 className="font-headline-md text-headline-md text-on-surface">Preguntas Frecuentes</h2>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-[600px]">
          Información útil para padres de familia y aspirantes sobre el proceso administrativo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">

        {/* FAQ 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md">
          <h3 className="font-title-sm text-title-sm text-on-surface flex items-start gap-xs mb-xs">
            <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">help</span>
            ¿Qué pasa si me equivoco al ingresar mi CURP?
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant pl-[28px]">
            Es vital verificar los datos antes de finalizar. Si hay un error, el sistema podría rechazar tu
            registro o asignar la ficha a otra identidad. Contacta soporte técnico de ECOEMS inmediatamente.
          </p>
        </div>

        {/* FAQ 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md">
          <h3 className="font-title-sm text-title-sm text-on-surface flex items-start gap-xs mb-xs">
            <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">help</span>
            ¿Dónde realizo el pago de derechos?
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant pl-[28px]">
            Al finalizar el paso 1, el sistema te generará una &ldquo;Línea de Captura&rdquo; (formato universal).
            Puedes pagarlo en ventanillas bancarias autorizadas o tiendas de conveniencia especificadas en el
            documento.
          </p>
        </div>

        {/* FAQ 3 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md">
          <h3 className="font-title-sm text-title-sm text-on-surface flex items-start gap-xs mb-xs">
            <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">help</span>
            ¿El examen es presencial o en línea?
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant pl-[28px]">
            El examen de asignación se aplica de manera presencial. La fecha, hora y sede exacta vendrán
            impresas en tu Pase de Ingreso al Examen, que descargarás posteriormente en la plataforma.
          </p>
        </div>

        {/* FAQ 4 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md">
          <h3 className="font-title-sm text-title-sm text-on-surface flex items-start gap-xs mb-xs">
            <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">help</span>
            ¿Hay guías de estudio disponibles?
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant pl-[28px]">
            Sí, al concluir tu registro y pago, podrás descargar la guía de estudio oficial EXANI-I de
            CENEVAL desde el portal estatal para prepararte adecuadamente.
          </p>
        </div>

      </div>
    </section>
  );
}
