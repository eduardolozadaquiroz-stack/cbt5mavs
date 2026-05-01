import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEzpJcll0X5d9jtID0KZQY9DQZRRq2urTYr7OTdd5wbN3bwTITJS_udArelmyFwKHp52jZMTZigPK27koZBzrOk8apUTBoENBTNSQ_9UV341OiiIG2ayvR2P6RSKF_-zlJhwraxvKTWP30vx0XqFtP3QHDJZtZ5q0FsLnV0k_-5Y9u3x3nfcJe2qD7R3eQk7iDmNl6Al0VZjLNgQ06SdDzzwjB1yyZU_u4Aiu24ZTFsCj_CbalIFeIYzf8-mCoS4Y8hn9Ux-Vpjacf";

const GRUPOS = [
  {
    id: "301-G",
    carrera: "Gastronomía",
    semestre: "3°",
    turno: "Matutino",
    materia: "Matemáticas Aplicadas III",
    promedio: "7.9",
    reprobados: 4,
    alumnos: [
      { id: "220101", nombre: "Aguilar Martínez, Carlos", promedio: "8.8", estatus: "Regular" },
      { id: "220115", nombre: "Bautista López, María", promedio: "5.3", estatus: "Reprobado" },
      { id: "220128", nombre: "Cruz Hernández, Jorge", promedio: "—", estatus: "Pendiente" },
      { id: "220142", nombre: "Díaz Sánchez, Ana Paola", promedio: "9.8", estatus: "Regular" },
      { id: "220156", nombre: "Espinoza Ríos, Luis", promedio: "7.2", estatus: "Regular" },
      { id: "220169", nombre: "Flores Vega, Sofía", promedio: "8.0", estatus: "Regular" },
    ],
  },
  {
    id: "302-G",
    carrera: "Gastronomía",
    semestre: "3°",
    turno: "Matutino",
    materia: "Biología Contemporánea",
    promedio: "8.3",
    reprobados: 2,
    alumnos: [
      { id: "220201", nombre: "González Cruz, Emilio", promedio: "9.0", estatus: "Regular" },
      { id: "220214", nombre: "Herrera Lima, Valeria", promedio: "5.8", estatus: "Reprobado" },
      { id: "220228", nombre: "Jiménez Mora, Andrés", promedio: "8.5", estatus: "Regular" },
      { id: "220241", nombre: "López Torres, Gabriela", promedio: "9.2", estatus: "Regular" },
      { id: "220255", nombre: "Martínez Ruiz, Daniel", promedio: "5.0", estatus: "Reprobado" },
    ],
  },
  {
    id: "301-I",
    carrera: "Informática",
    semestre: "3°",
    turno: "Matutino",
    materia: "Inglés V",
    promedio: "8.6",
    reprobados: 1,
    alumnos: [
      { id: "220301", nombre: "Núñez Castro, Fernanda", promedio: "8.8", estatus: "Regular" },
      { id: "220315", nombre: "Ortega Lima, Samuel", promedio: "5.5", estatus: "Reprobado" },
      { id: "220329", nombre: "Pacheco Díaz, Valeria", promedio: "9.5", estatus: "Regular" },
      { id: "220342", nombre: "Quiroz Sánchez, Javier", promedio: "8.1", estatus: "Regular" },
      { id: "220356", nombre: "Ramírez Herrera, Lucía", promedio: "8.9", estatus: "Regular" },
    ],
  },
];

function estatusChip(est: string) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold";
  if (est === "Regular") return `${base} bg-surface-container-high text-on-surface`;
  if (est === "Reprobado") return `${base} bg-error-container text-on-error-container`;
  return `${base} bg-tertiary-fixed text-on-tertiary-fixed`;
}

export default function GruposMaestroPage() {
  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        linkBase="/dashboard/maestro"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="grupos" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            {/* Page Header */}
            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-background">Mis Grupos</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Grupos asignados en el ciclo 2023-2024. Haz clic en un grupo para ver su lista completa.
              </p>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-3 gap-md mb-xl">
              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm text-center">
                <p className="font-display-lg text-display-lg text-on-surface">3</p>
                <p className="text-xs text-on-surface-variant mt-unit">Grupos asignados</p>
              </div>
              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm text-center">
                <p className="font-display-lg text-display-lg text-on-surface">
                  {GRUPOS.reduce((acc, g) => acc + g.alumnos.length, 0)}
                </p>
                <p className="text-xs text-on-surface-variant mt-unit">Alumnos totales</p>
              </div>
              <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm text-center">
                <p className="font-display-lg text-display-lg text-error">
                  {GRUPOS.reduce((acc, g) => acc + g.reprobados, 0)}
                </p>
                <p className="text-xs text-on-surface-variant mt-unit">Alumnos reprobados</p>
              </div>
            </div>

            {/* Groups */}
            <div className="flex flex-col gap-xl">
              {GRUPOS.map((grupo) => (
                <div key={grupo.id} className="bg-white border border-outline-variant rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">

                  {/* Group Header */}
                  <div className="p-md border-b border-outline-variant bg-surface-bright flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-lg flex-shrink-0">
                        {grupo.id}
                      </div>
                      <div>
                        <h3 className="font-title-sm text-title-sm text-on-surface">Grupo {grupo.id}</h3>
                        <p className="text-xs text-on-surface-variant">{grupo.semestre} Semestre · {grupo.carrera} · {grupo.turno}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          <span className="material-symbols-outlined" style={{ fontSize: "11px", verticalAlign: "text-bottom" }}>book</span>
                          {" "}{grupo.materia}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="text-center">
                        <p className="text-xs text-on-surface-variant">Promedio</p>
                        <p className="font-semibold text-on-surface">{grupo.promedio}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-on-surface-variant">Alumnos</p>
                        <p className="font-semibold text-on-surface">{grupo.alumnos.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-on-surface-variant">Reprobados</p>
                        <p className={`font-semibold ${grupo.reprobados > 2 ? "text-error" : "text-on-surface"}`}>{grupo.reprobados}</p>
                      </div>
                      <a
                        href="/dashboard/maestro/calificaciones"
                        className="ml-sm inline-flex items-center gap-1 px-md py-unit border border-primary text-primary rounded font-label-bold text-label-bold text-sm hover:bg-primary/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">grade</span>
                        Capturar
                      </a>
                    </div>
                  </div>

                  {/* Students table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-lowest border-b border-outline-variant">
                          <th className="py-2 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">No. Control</th>
                          <th className="py-2 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">Nombre</th>
                          <th className="py-2 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs text-center">Promedio</th>
                          <th className="py-2 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs text-center">Estatus</th>
                        </tr>
                      </thead>
                      <tbody className="font-data-tabular text-data-tabular">
                        {grupo.alumnos.map((a, i) => (
                          <tr key={a.id} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? "bg-surface-container-lowest" : "bg-white"}`}>
                            <td className="py-2 px-4 text-on-surface-variant font-mono text-sm">{a.id}</td>
                            <td className="py-2 px-4 text-on-surface font-medium">{a.nombre}</td>
                            <td className={`py-2 px-4 text-center font-bold ${a.estatus === "Reprobado" ? "text-error" : "text-on-surface"}`}>{a.promedio}</td>
                            <td className="py-2 px-4 text-center">
                              <span className={estatusChip(a.estatus)}>{a.estatus}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
