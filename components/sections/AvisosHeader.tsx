export default function AvisosHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant pb-6">
      <div>
        <h1 className="font-display-lg text-display-lg text-primary mb-2">Avisos y Comunicados</h1>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
          Mantente informado sobre las últimas noticias, eventos académicos y avisos importantes de nuestra
          institución.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-primary text-on-primary rounded-full font-label-bold text-label-bold shadow-sm transition-colors">
          Todos
        </button>
        <button className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded-full font-label-bold text-label-bold hover:bg-surface-variant transition-colors">
          Urgentes
        </button>
        <button className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded-full font-label-bold text-label-bold hover:bg-surface-variant transition-colors">
          Académicos
        </button>
        <button className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded-full font-label-bold text-label-bold hover:bg-surface-variant transition-colors">
          Eventos
        </button>
      </div>
    </header>
  );
}
