import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEzpJcll0X5d9jtID0KZQY9DQZRRq2urTYr7OTdd5wbN3bwTITJS_udArelmyFwKHp52jZMTZigPK27koZBzrOk8apUTBoENBTNSQ_9UV341OiiIG2ayvR2P6RSKF_-zlJhwraxvKTWP30vx0XqFtP3QHDJZtZ5q0FsLnV0k_-5Y9u3x3nfcJe2qD7R3eQk7iDmNl6Al0VZjLNgQ06SdDzzwjB1yyZU_u4Aiu24ZTFsCj_CbalIFeIYzf8-mCoS4Y8hn9Ux-Vpjacf";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const HORARIOS: Record<string, Record<string, { grupo: string; materia: string; aula: string; color: string } | null>> = {
  "07:00 – 08:00": {
    Lunes:     { grupo: "301-G", materia: "Matemáticas Aplicadas III", aula: "Aula 12", color: "bg-blue-50 border-blue-200 text-blue-800" },
    Martes:    null,
    Miércoles: { grupo: "301-G", materia: "Matemáticas Aplicadas III", aula: "Aula 12", color: "bg-blue-50 border-blue-200 text-blue-800" },
    Jueves:    null,
    Viernes:   { grupo: "301-G", materia: "Matemáticas Aplicadas III", aula: "Aula 12", color: "bg-blue-50 border-blue-200 text-blue-800" },
  },
  "08:00 – 09:00": {
    Lunes:     null,
    Martes:    { grupo: "302-G", materia: "Biología Contemporánea", aula: "Lab. Ciencias", color: "bg-green-50 border-green-200 text-green-800" },
    Miércoles: null,
    Jueves:    { grupo: "302-G", materia: "Biología Contemporánea", aula: "Lab. Ciencias", color: "bg-green-50 border-green-200 text-green-800" },
    Viernes:   null,
  },
  "09:00 – 10:00": {
    Lunes:     { grupo: "301-I", materia: "Inglés V", aula: "Aula 8", color: "bg-purple-50 border-purple-200 text-purple-800" },
    Martes:    null,
    Miércoles: { grupo: "301-I", materia: "Inglés V", aula: "Aula 8", color: "bg-purple-50 border-purple-200 text-purple-800" },
    Jueves:    null,
    Viernes:   { grupo: "301-I", materia: "Inglés V", aula: "Aula 8", color: "bg-purple-50 border-purple-200 text-purple-800" },
  },
  "10:00 – 11:00": {
    Lunes:     null,
    Martes:    { grupo: "301-G", materia: "Matemáticas Aplicadas III", aula: "Aula 12", color: "bg-blue-50 border-blue-200 text-blue-800" },
    Miércoles: null,
    Jueves:    { grupo: "301-G", materia: "Matemáticas Aplicadas III", aula: "Aula 12", color: "bg-blue-50 border-blue-200 text-blue-800" },
    Viernes:   null,
  },
  "11:00 – 12:00": {
    Lunes:     { grupo: "302-G", materia: "Biología Contemporánea", aula: "Lab. Ciencias", color: "bg-green-50 border-green-200 text-green-800" },
    Martes:    null,
    Miércoles: { grupo: "302-G", materia: "Biología Contemporánea", aula: "Lab. Ciencias", color: "bg-green-50 border-green-200 text-green-800" },
    Jueves:    null,
    Viernes:   { grupo: "302-G", materia: "Biología Contemporánea", aula: "Lab. Ciencias", color: "bg-green-50 border-green-200 text-green-800" },
  },
  "12:00 – 13:00": {
    Lunes:     null,
    Martes:    { grupo: "301-I", materia: "Inglés V", aula: "Aula 8", color: "bg-purple-50 border-purple-200 text-purple-800" },
    Miércoles: null,
    Jueves:    { grupo: "301-I", materia: "Inglés V", aula: "Aula 8", color: "bg-purple-50 border-purple-200 text-purple-800" },
    Viernes:   null,
  },
  "13:00 – 14:00": {
    Lunes:     null,
    Martes:    null,
    Miércoles: null,
    Jueves:    null,
    Viernes:   null,
  },
};

const LEYENDA = [
  { color: "bg-blue-200",   label: "301-G · Matemáticas Aplicadas III" },
  { color: "bg-green-200",  label: "302-G · Biología Contemporánea" },
  { color: "bg-purple-200", label: "301-I · Inglés V" },
];

const HORAS = Object.keys(HORARIOS);

export default function HorariosMaestroPage() {
  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        activeTopLink="horarios"
        linkBase="/dashboard/maestro"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="inicio" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            {/* Header */}
            <div className="mb-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-background">Mis Horarios</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Horario de clases asignado. Ciclo 2023-2024 · Turno Matutino
                </p>
              </div>
              <button className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant text-on-surface font-label-bold text-label-bold rounded hover:bg-surface-container-lowest shadow-sm transition-all">
                <span className="material-symbols-outlined text-sm">print</span>
                Imprimir
              </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-outline-variant rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                      <th className="py-3 px-4 w-36 font-label-bold text-label-bold text-on-surface-variant uppercase text-sm text-left">Hora</th>
                      {DIAS.map((d) => (
                        <th key={d} className="py-3 px-3 font-label-bold text-label-bold text-on-surface-variant uppercase text-sm text-center">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HORAS.map((hora, i) => (
                      <tr key={hora} className={`border-b border-outline-variant ${i % 2 === 1 ? "bg-surface-container-lowest/50" : "bg-white"}`}>
                        <td className="py-3 px-4 text-xs font-mono text-on-surface-variant whitespace-nowrap">{hora}</td>
                        {DIAS.map((dia) => {
                          const cel = HORARIOS[hora][dia];
                          return (
                            <td key={dia} className="py-2 px-2 text-center">
                              {cel ? (
                                <div className={`rounded-lg border px-2 py-2 text-left ${cel.color}`}>
                                  <p className="font-bold text-xs leading-tight">{cel.grupo}</p>
                                  <p className="text-[11px] leading-tight mt-0.5">{cel.materia}</p>
                                  <p className="text-[10px] opacity-70 mt-0.5 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined" style={{ fontSize: "10px" }}>location_on</span>
                                    {cel.aula}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-on-surface-variant text-xs">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Leyenda */}
              <div className="border-t border-outline-variant p-md bg-surface-container-lowest flex flex-wrap gap-md">
                <p className="text-xs text-on-surface-variant font-medium self-center">Leyenda:</p>
                {LEYENDA.map((l) => (
                  <div key={l.label} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${l.color}`} />
                    <span className="text-xs text-on-surface">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
