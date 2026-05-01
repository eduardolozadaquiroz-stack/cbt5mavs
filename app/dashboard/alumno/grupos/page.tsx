import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBJFu1eTFJVZnEIpf-KZZvSc_2ffZQGUirP05eqMK12TVBzwigT9EauHtrNVGTd-67_1LsY_0TUiZTt05HcyZXomBqsm1Kv6mJ9lOeQcUvsx9rZTLrY0ASxcVj2CMDkmyby29mUF551eD7wf5moJ9QLCBGlQObDInlM23i5b7BpfDkM3436o3JteJDAyE28ef_KoT1fTG6ZYBYE3KNLPUgFcRV7Y5IldhFMLtpChj4-jm42Hz2QxVhJU5Gbk1KUKsL6zRDWY4Uoiz6";

const COMPAÑEROS = [
  { id: "230101", nombre: "Aguilar Medina, Sofía" },
  { id: "230112", nombre: "Castro Ríos, Emilio" },
  { id: "230145", nombre: "Díaz Ortega, Valentina" },
  { id: "230158", nombre: "Espinoza Lara, Rodrigo" },
  { id: "230170", nombre: "Flores Cruz, Camila" },
  { id: "230183", nombre: "González Vega, Adrián" },
  { id: "230196", nombre: "Hernández Mora, Daniela" },
  { id: "230210", nombre: "Jiménez Ruiz, Fernando" },
  { id: "230224", nombre: "López Soto, Isabella" },
  { id: "230237", nombre: "Martínez Peña, Miguel" },
  { id: "230251", nombre: "Núñez Torres, Gabriela" },
  { id: "230264", nombre: "Ortega Lima, Samuel" },
  { id: "230278", nombre: "Pacheco Díaz, Valeria" },
  { id: "230291", nombre: "Quiroz Sánchez, Javier" },
  { id: "230305", nombre: "Ramírez Herrera, Lucía" },
];

export default function GruposPage() {
  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        activeTopLink="dashboard"
        linkBase="/dashboard/alumno"
      />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="grupos" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Page Header */}
          <div className="mb-lg">
            <h1 className="font-display-lg text-display-lg text-on-background">Mi Grupo</h1>
            <p className="text-on-surface-variant mt-unit">Información de tu grupo asignado en el ciclo actual.</p>
          </div>

          {/* Group Info Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mb-xl">
            <div className="lg:col-span-1 bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              {/* Color header */}
              <div className="bg-primary px-md py-lg flex flex-col items-center text-on-primary gap-sm">
                <div className="w-16 h-16 rounded-full bg-on-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    groups
                  </span>
                </div>
                <h2 className="font-display-lg text-display-lg">3° IM-A</h2>
                <p className="text-on-primary/80 text-sm">Informática · Turno Matutino</p>
              </div>

              {/* Info list */}
              <ul className="divide-y divide-outline-variant">
                {[
                  { icon: "calendar_month", label: "Ciclo Escolar", value: "2023-2024" },
                  { icon: "school", label: "Carrera", value: "Técnico en Informática" },
                  { icon: "access_time", label: "Turno", value: "Matutino (7:00 – 14:00)" },
                  { icon: "location_on", label: "Sede", value: "CBT Núm. 5, Chalco" },
                  { icon: "person", label: "Tutor del Grupo", value: "Prof. Arturo Ramos" },
                  { icon: "group", label: "Alumnos Inscritos", value: `${COMPAÑEROS.length} alumnos` },
                ].map(({ icon, label, value }) => (
                  <li key={label} className="flex items-center gap-sm px-md py-sm">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface-variant">{label}</p>
                      <p className="text-sm font-medium text-on-surface truncate">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Classmates list */}
            <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-md border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-title-sm text-title-sm text-on-surface">Lista de Compañeros</h3>
                <span className="text-body-sm font-body-sm text-on-surface-variant">{COMPAÑEROS.length} alumnos</span>
              </div>

              {/* Search */}
              <div className="px-md py-sm border-b border-outline-variant">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                    search
                  </span>
                  <input
                    className="w-full pl-9 pr-md py-sm border border-outline-variant rounded bg-surface text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                    placeholder="Buscar compañero..."
                    type="text"
                    readOnly
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1" style={{ maxHeight: "400px" }}>
                <table className="w-full text-left font-data-tabular text-data-tabular border-collapse">
                  <thead className="bg-surface-container-high sticky top-0 z-10">
                    <tr>
                      <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">#</th>
                      <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">No. Control</th>
                      <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPAÑEROS.map((c, i) => (
                      <tr key={c.id} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors border-b border-outline-variant last:border-0">
                        <td className="p-sm px-md text-on-surface-variant text-xs">{i + 1}</td>
                        <td className="p-sm px-md text-on-surface-variant font-mono text-sm">{c.id}</td>
                        <td className="p-sm px-md text-on-surface font-medium">{c.nombre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Subjects assigned to group */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="p-md border-b border-outline-variant">
              <h3 className="font-title-sm text-title-sm text-on-surface">Materias del Grupo</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md p-md">
              {[
                { materia: "Matemáticas Aplicadas", maestro: "Prof. Arturo Ramos", aula: "A-101", icon: "calculate", color: "text-blue-700 bg-blue-50" },
                { materia: "Física II", maestro: "Prof. Elena Mendoza", aula: "Lab-F", icon: "science", color: "text-purple-700 bg-purple-50" },
                { materia: "Química Orgánica", maestro: "Prof. Luis Salinas", aula: "Lab-Q", icon: "biotech", color: "text-yellow-700 bg-yellow-50" },
                { materia: "Historia de México", maestro: "Prof. Ana Guerrero", aula: "C-305", icon: "history_edu", color: "text-rose-700 bg-rose-50" },
                { materia: "Inglés IV", maestro: "Prof. Mark Torres", aula: "B-203", icon: "language", color: "text-green-700 bg-green-50" },
              ].map((s) => (
                <div key={s.materia} className="flex items-center gap-sm p-sm border border-outline-variant rounded-lg hover:border-primary/30 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${s.color}`}>
                    <span className="material-symbols-outlined text-sm">{s.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-on-surface truncate">{s.materia}</p>
                    <p className="text-xs text-on-surface-variant truncate">{s.maestro}</p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined" style={{ fontSize: "11px" }}>door_open</span>
                      {s.aula}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
