export default function ContactoForm() {
  return (
    <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded p-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col gap-lg">
      <div className="border-b border-outline-variant pb-sm">
        <h2 className="font-title-sm text-title-sm text-on-surface">Envíenos un mensaje</h2>
      </div>

      <form className="flex flex-col gap-md">
        {/* Nombre */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="name">
            Nombre Completo
          </label>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            id="name"
            name="name"
            placeholder="Ej. Juan Pérez"
            type="text"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            id="email"
            name="email"
            placeholder="correo@ejemplo.com"
            type="email"
          />
        </div>

        {/* Asunto */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="subject">
            Asunto
          </label>
          <select
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            id="subject"
            name="subject"
          >
            <option value="">Seleccione un área...</option>
            <option value="admision">Admisión e Inscripciones</option>
            <option value="control_escolar">Control Escolar</option>
            <option value="informacion">Información General</option>
            <option value="soporte">Soporte Técnico (Portal)</option>
          </select>
        </div>

        {/* Mensaje */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="message">
            Mensaje
          </label>
          <textarea
            className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            id="message"
            name="message"
            placeholder="Describa su consulta de manera detallada..."
            rows={4}
          />
        </div>

        {/* Submit */}
        <div className="pt-sm">
          <button
            className="w-full bg-primary text-on-primary font-label-bold text-label-bold uppercase py-md px-lg rounded hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200 shadow-sm hover:shadow-md flex justify-center items-center gap-sm"
            type="submit"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
            >
              send
            </span>
            Enviar Mensaje
          </button>
        </div>
      </form>
    </div>
  );
}
