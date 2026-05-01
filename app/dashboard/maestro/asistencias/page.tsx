import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEzpJcll0X5d9jtID0KZQY9DQZRRq2urTYr7OTdd5wbN3bwTITJS_udArelmyFwKHp52jZMTZigPK27koZBzrOk8apUTBoENBTNSQ_9UV341OiiIG2ayvR2P6RSKF_-zlJhwraxvKTWP30vx0XqFtP3QHDJZtZ5q0FsLnV0k_-5Y9u3x3nfcJe2qD7R3eQk7iDmNl6Al0VZjLNgQ06SdDzzwjB1yyZU_u4Aiu24ZTFsCj_CbalIFeIYzf8-mCoS4Y8hn9Ux-Vpjacf";

const ALUMNOS = [
  "Aguilar Martínez, Carlos",
  "Bautista López, María",
  "Cruz Hernández, Jorge",
  "Díaz Sánchez, Ana Paola",
  "Espinoza Ríos, Luis",
  "Flores Vega, Sofía",
  "González Cruz, Emilio",
  "Herrera Lima, Valeria",
  "Jiménez Mora, Andrés",
  "López Torres, Gabriela",
  "Martínez Ruiz, Daniel",
  "Núñez Castro, Fernanda",
];

type Estatus = "P" | "F" | "J";
const DEFAULT: Estatus[] = ["P", "P", "F", "P", "P", "P", "J", "P", "P", "F", "P", "P"];

function EstatusBtn({ value, active }: { value: Estatus; active: boolean }) {
  const styles: Record<Estatus, string> = {
    P: "bg-surface-container-high text-primary border-primary/30",
    F: "bg-error-container text-on-error-container border-error/30",
    J: "bg-[#fff3cd] text-[#856404] border-[#ffc107]/40",
  };
  const labels: Record<Estatus, string> = { P: "Presente", F: "Falta", J: "Justificada" };
  return (
    <button
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${active ? styles[value] : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant"}`}
      title={labels[value]}
    >
      {value}
    </button>
  );
}

export default function AsistenciasMaestroPage() {
  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        linkBase="/dashboard/maestro"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="asistencias" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            {/* Page Header */}
            <div className="mb-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-background">Registro de Asistencia</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Selecciona el grupo y la fecha para pasar lista.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-outline-variant text-on-surface font-label-bold text-label-bold rounded hover:bg-surface-container-lowest shadow-sm transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-primary text-on-primary font-label-bold text-label-bold rounded hover:bg-primary-container shadow-sm transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">save</span>
                  Guardar Lista
                </button>
              </div>
            </div>

            {/* Selectors */}
            <div className="bg-white border border-outline-variant rounded-lg p-md mb-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase text-xs" htmlFor="asist-group">
                    Grupo
                  </label>
                  <div className="relative">
                    <select
                      id="asist-group"
                      className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option>301 - Gastronomía</option>
                      <option>302 - Gastronomía</option>
                      <option>301 - Informática</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase text-xs" htmlFor="asist-materia">
                    Materia
                  </label>
                  <div className="relative">
                    <select
                      id="asist-materia"
                      className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option>Matemáticas Aplicadas III</option>
                      <option>Biología Contemporánea</option>
                      <option>Inglés V</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase text-xs" htmlFor="asist-fecha">
                    Fecha
                  </label>
                  <input
                    id="asist-fecha"
                    type="date"
                    defaultValue="2026-04-29"
                    className="border border-outline-variant rounded px-3 py-2 font-body-base text-body-base text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-sm mb-md">
              {[
                { label: "Presentes", count: DEFAULT.filter((s) => s === "P").length, cls: "bg-surface-container-high text-primary border-primary/20" },
                { label: "Faltas", count: DEFAULT.filter((s) => s === "F").length, cls: "bg-error-container text-on-error-container border-error/20" },
                { label: "Justificadas", count: DEFAULT.filter((s) => s === "J").length, cls: "bg-[#fff3cd] text-[#856404] border-[#ffc107]/30" },
              ].map((c) => (
                <span key={c.label} className={`inline-flex items-center gap-1 px-md py-unit rounded-full border text-sm font-medium ${c.cls}`}>
                  <strong>{c.count}</strong> {c.label}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 px-md py-unit rounded-full border border-outline-variant text-sm text-on-surface-variant">
                {ALUMNOS.length} alumnos totales
              </span>
            </div>

            {/* Attendance Table */}
            <div className="bg-white border border-outline-variant rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="p-md border-b border-outline-variant bg-surface-bright flex items-center justify-between">
                <h3 className="font-title-sm text-title-sm text-on-surface">Lista del Día</h3>
                <div className="flex gap-sm text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary/30 inline-block"></span> P = Presente</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-error/30 inline-block"></span> F = Falta</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ffc107]/40 inline-block"></span> J = Justificada</span>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant">
                    <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs w-8">#</th>
                    <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">Nombre del Alumno</th>
                    <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs text-center">Estatus</th>
                    <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs text-center w-48">Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {ALUMNOS.map((alumno, i) => {
                    const est = DEFAULT[i];
                    const rowBg = est === "F" ? "bg-[#fff8f8]" : est === "J" ? "bg-[#fffbea]" : i % 2 === 0 ? "bg-white" : "bg-surface-bright";
                    return (
                      <tr key={alumno} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${rowBg}`}>
                        <td className="py-2 px-4 text-on-surface-variant text-sm">{i + 1}</td>
                        <td className="py-2 px-4 text-on-surface font-medium">{alumno}</td>
                        <td className="py-2 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            est === "P" ? "bg-surface-container-high text-primary" :
                            est === "F" ? "bg-error-container text-on-error-container" :
                            "bg-[#fff3cd] text-[#856404]"
                          }`}>
                            {est === "P" ? "Presente" : est === "F" ? "Falta" : "Justificada"}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <EstatusBtn value="P" active={est === "P"} />
                            <EstatusBtn value="F" active={est === "F"} />
                            <EstatusBtn value="J" active={est === "J"} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
