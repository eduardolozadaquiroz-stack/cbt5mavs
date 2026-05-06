"use client";

interface Props {
  tipo: string;
  onTipoChange: (tipo: string) => void;
}

const FILTROS = [
  { key: "",               label: "Todos" },
  { key: "urgente",        label: "Urgentes" },
  { key: "academico",      label: "Académicos" },
  { key: "administrativo", label: "Administrativos" },
  { key: "institucional",  label: "Institucionales" },
];

export default function AvisosHeader({ tipo, onTipoChange }: Props) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant pb-6">
      <div>
        <h1 className="font-display-lg text-display-lg text-primary mb-2">Avisos y Comunicados</h1>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
          Manténte informado sobre las últimas noticias, eventos académicos y avisos importantes de nuestra
          institución.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map(f => (
          <button
            key={f.key}
            onClick={() => onTipoChange(f.key)}
            className={`px-4 py-2 rounded-full font-label-bold text-label-bold transition-colors ${
              tipo === f.key
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface text-on-surface border border-outline-variant hover:bg-surface-variant"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </header>
  );
}
