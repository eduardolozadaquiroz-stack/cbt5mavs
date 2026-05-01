import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBJFu1eTFJVZnEIpf-KZZvSc_2ffZQGUirP05eqMK12TVBzwigT9EauHtrNVGTd-67_1LsY_0TUiZTt05HcyZXomBqsm1Kv6mJ9lOeQcUvsx9rZTLrY0ASxcVj2CMDkmyby29mUF551eD7wf5moJ9QLCBGlQObDInlM23i5b7BpfDkM3436o3JteJDAyE28ef_KoT1fTG6ZYBYE3KNLPUgFcRV7Y5IldhFMLtpChj4-jm42Hz2QxVhJU5Gbk1KUKsL6zRDWY4Uoiz6";

type Semestre = {
  label: string;
  periodo: string;
  promedio: string;
  aprobadas: number;
  total: number;
  materias: { nombre: string; calificacion: number; estatus: string }[];
};

const SEMESTRES: Semestre[] = [
  {
    label: "1° Semestre",
    periodo: "Agosto 2022 – Enero 2023",
    promedio: "8.90",
    aprobadas: 5,
    total: 5,
    materias: [
      { nombre: "Matemáticas I", calificacion: 9.0, estatus: "Aprobado" },
      { nombre: "Física I", calificacion: 8.5, estatus: "Aprobado" },
      { nombre: "Química I", calificacion: 9.5, estatus: "Aprobado" },
      { nombre: "Inglés I", calificacion: 9.0, estatus: "Aprobado" },
      { nombre: "Introducción a la Informática", calificacion: 8.5, estatus: "Aprobado" },
    ],
  },
  {
    label: "2° Semestre",
    periodo: "Febrero 2023 – Julio 2023",
    promedio: "8.40",
    aprobadas: 5,
    total: 5,
    materias: [
      { nombre: "Matemáticas II", calificacion: 8.0, estatus: "Aprobado" },
      { nombre: "Física II", calificacion: 7.5, estatus: "Aprobado" },
      { nombre: "Química II", calificacion: 9.0, estatus: "Aprobado" },
      { nombre: "Inglés II", calificacion: 9.0, estatus: "Aprobado" },
      { nombre: "Programación Básica", calificacion: 8.5, estatus: "Aprobado" },
    ],
  },
  {
    label: "3° Semestre (Actual)",
    periodo: "Agosto 2023 – Enero 2024",
    promedio: "—",
    aprobadas: 0,
    total: 5,
    materias: [
      { nombre: "Matemáticas Aplicadas", calificacion: 0, estatus: "En curso" },
      { nombre: "Física III", calificacion: 0, estatus: "En curso" },
      { nombre: "Química Orgánica", calificacion: 0, estatus: "En curso" },
      { nombre: "Inglés IV", calificacion: 0, estatus: "En curso" },
      { nombre: "Historia de México", calificacion: 0, estatus: "En curso" },
    ],
  },
];

function estatusChip(estatus: string) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  if (estatus === "Aprobado") return `${base} bg-surface-container-high text-primary`;
  if (estatus === "En curso") return `${base} bg-surface-container text-on-surface-variant border border-outline-variant`;
  if (estatus === "Reprobado") return `${base} bg-error-container text-on-error-container`;
  return `${base} bg-surface-variant text-on-surface-variant`;
}

export default function ReportesPage() {
  const promedioAcumulado = (
    SEMESTRES.filter((s) => s.promedio !== "—")
      .reduce((acc, s) => acc + parseFloat(s.promedio), 0) /
    SEMESTRES.filter((s) => s.promedio !== "—").length
  ).toFixed(2);

  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        activeTopLink="dashboard"
        linkBase="/dashboard/alumno"
      />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="reportes" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Page Header */}
          <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background">Reportes Académicos</h1>
              <p className="text-on-surface-variant mt-unit">
                Historial académico por semestre y documentos descargables.
              </p>
            </div>
            <div className="flex gap-sm flex-wrap">
              <button className="inline-flex items-center gap-2 border border-outline text-on-surface px-md py-sm rounded font-label-bold text-label-bold hover:bg-surface-variant transition-colors shadow-sm">
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                Boleta PDF
              </button>
              <button className="inline-flex items-center gap-2 border border-outline text-on-surface px-md py-sm rounded font-label-bold text-label-bold hover:bg-surface-variant transition-colors shadow-sm">
                <span className="material-symbols-outlined text-sm">description</span>
                Constancia
              </button>
            </div>
          </div>

          {/* Student identity card */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm p-md mb-xl flex flex-col sm:flex-row gap-md items-start sm:items-center">
            <div className="w-16 h-16 rounded-full bg-surface-container overflow-hidden border border-outline-variant flex-shrink-0">
              <img alt="Foto alumno" className="w-full h-full object-cover" src={AVATAR} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-title-sm text-title-sm text-on-surface">García López, Juan Carlos</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">No. Control: <strong>230145</strong></p>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Carrera: <strong>Técnico en Informática</strong> · Grupo: <strong>3° IM-A</strong></p>
            </div>
            <div className="flex flex-col items-end gap-unit">
              <span className="text-xs text-on-surface-variant">Promedio acumulado</span>
              <span className="font-display-lg text-display-lg text-on-surface">{promedioAcumulado}</span>
            </div>
          </div>

          {/* Semestres Accordion */}
          <div className="flex flex-col gap-lg">
            {SEMESTRES.map((sem, idx) => (
              <div key={sem.label} className={`bg-surface border rounded-xl shadow-sm overflow-hidden ${idx === SEMESTRES.length - 1 ? "border-primary/40" : "border-outline-variant"}`}>
                {/* Semestre header */}
                <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm px-md py-sm ${idx === SEMESTRES.length - 1 ? "bg-primary/5" : "bg-surface-container-high"}`}>
                  <div>
                    <h3 className="font-title-sm text-title-sm text-on-surface flex items-center gap-2">
                      {sem.label}
                      {idx === SEMESTRES.length - 1 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-on-primary">
                          En curso
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{sem.periodo}</p>
                  </div>
                  <div className="flex items-center gap-md">
                    {sem.promedio !== "—" && (
                      <div className="text-right">
                        <p className="text-xs text-on-surface-variant">Promedio</p>
                        <p className="font-semibold text-on-surface">{sem.promedio}</p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant">Aprobadas</p>
                      <p className="font-semibold text-on-surface">{sem.aprobadas}/{sem.total}</p>
                    </div>
                    {sem.promedio !== "—" && (
                      <button className="flex items-center gap-1 text-sm text-primary hover:underline font-medium">
                        <span className="material-symbols-outlined text-sm">download</span>
                        PDF
                      </button>
                    )}
                  </div>
                </div>

                {/* Subjects table */}
                <table className="w-full text-left font-data-tabular text-data-tabular border-collapse">
                  <thead className="bg-surface-variant/30">
                    <tr>
                      <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs">Materia</th>
                      <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs text-center">Calificación</th>
                      <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs text-center">Estatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.materias.map((m) => (
                      <tr key={m.nombre} className="odd:bg-surface even:bg-surface-bright border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-sm px-md text-on-surface font-medium">{m.nombre}</td>
                        <td className="p-sm px-md text-center font-semibold text-on-surface">
                          {m.estatus === "En curso" ? (
                            <span className="text-on-surface-variant select-none">—</span>
                          ) : m.calificacion}
                        </td>
                        <td className="p-sm px-md text-center">
                          <span className={estatusChip(m.estatus)}>{m.estatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
