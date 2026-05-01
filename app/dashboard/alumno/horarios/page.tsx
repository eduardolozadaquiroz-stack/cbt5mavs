import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBJFu1eTFJVZnEIpf-KZZvSc_2ffZQGUirP05eqMK12TVBzwigT9EauHtrNVGTd-67_1LsY_0TUiZTt05HcyZXomBqsm1Kv6mJ9lOeQcUvsx9rZTLrY0ASxcVj2CMDkmyby29mUF551eD7wf5moJ9QLCBGlQObDInlM23i5b7BpfDkM3436o3JteJDAyE28ef_KoT1fTG6ZYBYE3KNLPUgFcRV7Y5IldhFMLtpChj4-jm42Hz2QxVhJU5Gbk1KUKsL6zRDWY4Uoiz6";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

type Subject = {
  materia: string;
  maestro: string;
  aula: string;
  color: string;
};

type Slot = Subject | null;

// Rows = time slots, Columns = Mon-Fri
const SCHEDULE: { hora: string; slots: Slot[] }[] = [
  {
    hora: "7:00 – 7:50",
    slots: [
      { materia: "Matemáticas Aplicadas", maestro: "Prof. Ramos", aula: "A-101", color: "bg-blue-50 border-blue-300 text-blue-800" },
      { materia: "Física II", maestro: "Prof. Mendoza", aula: "Lab-F", color: "bg-purple-50 border-purple-300 text-purple-800" },
      { materia: "Inglés IV", maestro: "Prof. Torres", aula: "B-203", color: "bg-green-50 border-green-300 text-green-800" },
      { materia: "Matemáticas Aplicadas", maestro: "Prof. Ramos", aula: "A-101", color: "bg-blue-50 border-blue-300 text-blue-800" },
      { materia: "Química Orgánica", maestro: "Prof. Salinas", aula: "Lab-Q", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
    ],
  },
  {
    hora: "8:00 – 8:50",
    slots: [
      { materia: "Física II", maestro: "Prof. Mendoza", aula: "Lab-F", color: "bg-purple-50 border-purple-300 text-purple-800" },
      { materia: "Química Orgánica", maestro: "Prof. Salinas", aula: "Lab-Q", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
      { materia: "Matemáticas Aplicadas", maestro: "Prof. Ramos", aula: "A-101", color: "bg-blue-50 border-blue-300 text-blue-800" },
      { materia: "Inglés IV", maestro: "Prof. Torres", aula: "B-203", color: "bg-green-50 border-green-300 text-green-800" },
      { materia: "Historia de México", maestro: "Prof. Guerrero", aula: "C-305", color: "bg-rose-50 border-rose-300 text-rose-800" },
    ],
  },
  {
    hora: "9:00 – 9:50",
    slots: [
      { materia: "Inglés IV", maestro: "Prof. Torres", aula: "B-203", color: "bg-green-50 border-green-300 text-green-800" },
      null,
      { materia: "Física II", maestro: "Prof. Mendoza", aula: "Lab-F", color: "bg-purple-50 border-purple-300 text-purple-800" },
      { materia: "Química Orgánica", maestro: "Prof. Salinas", aula: "Lab-Q", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
      null,
    ],
  },
  {
    hora: "10:00 – 10:50",
    slots: [
      { materia: "Historia de México", maestro: "Prof. Guerrero", aula: "C-305", color: "bg-rose-50 border-rose-300 text-rose-800" },
      { materia: "Historia de México", maestro: "Prof. Guerrero", aula: "C-305", color: "bg-rose-50 border-rose-300 text-rose-800" },
      null,
      { materia: "Física II", maestro: "Prof. Mendoza", aula: "Lab-F", color: "bg-purple-50 border-purple-300 text-purple-800" },
      { materia: "Inglés IV", maestro: "Prof. Torres", aula: "B-203", color: "bg-green-50 border-green-300 text-green-800" },
    ],
  },
  {
    hora: "11:00 – 11:50",
    slots: [
      null,
      { materia: "Matemáticas Aplicadas", maestro: "Prof. Ramos", aula: "A-101", color: "bg-blue-50 border-blue-300 text-blue-800" },
      { materia: "Historia de México", maestro: "Prof. Guerrero", aula: "C-305", color: "bg-rose-50 border-rose-300 text-rose-800" },
      null,
      { materia: "Física II", maestro: "Prof. Mendoza", aula: "Lab-F", color: "bg-purple-50 border-purple-300 text-purple-800" },
    ],
  },
  {
    hora: "12:00 – 12:50",
    slots: [
      { materia: "Química Orgánica", maestro: "Prof. Salinas", aula: "Lab-Q", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
      { materia: "Inglés IV", maestro: "Prof. Torres", aula: "B-203", color: "bg-green-50 border-green-300 text-green-800" },
      { materia: "Química Orgánica", maestro: "Prof. Salinas", aula: "Lab-Q", color: "bg-yellow-50 border-yellow-300 text-yellow-800" },
      { materia: "Historia de México", maestro: "Prof. Guerrero", aula: "C-305", color: "bg-rose-50 border-rose-300 text-rose-800" },
      { materia: "Matemáticas Aplicadas", maestro: "Prof. Ramos", aula: "A-101", color: "bg-blue-50 border-blue-300 text-blue-800" },
    ],
  },
  {
    hora: "13:00 – 13:50",
    slots: [null, null, null, null, null],
  },
];

export default function HorariosPage() {
  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        activeTopLink="horarios"
        linkBase="/dashboard/alumno"
      />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="inicio" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full overflow-x-auto">

          {/* Page Header */}
          <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background">Horario Semanal</h1>
              <p className="text-on-surface-variant mt-unit">
                Grupo: <strong>3° IM-A</strong> &nbsp;·&nbsp; Turno: Matutino &nbsp;·&nbsp; Ciclo 2023-2024
              </p>
            </div>
            <button className="inline-flex items-center gap-2 border border-outline text-on-surface px-md py-sm rounded font-label-bold text-label-bold hover:bg-surface-variant transition-colors shadow-sm">
              <span className="material-symbols-outlined text-sm">print</span>
              Imprimir Horario
            </button>
          </div>

          {/* Schedule Table */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high">
                  <th className="p-sm px-md border-b border-outline-variant text-label-bold font-label-bold text-on-surface-variant w-32">
                    Hora
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="p-sm px-md border-b border-outline-variant text-label-bold font-label-bold text-on-surface-variant text-center"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((row) => (
                  <tr key={row.hora} className="border-b border-outline-variant last:border-0">
                    <td className="p-sm px-md text-body-sm font-body-sm text-on-surface-variant align-top whitespace-nowrap">
                      {row.hora}
                    </td>
                    {row.slots.map((slot, i) => (
                      <td key={i} className="p-unit align-top">
                        {slot ? (
                          <div
                            className={`rounded border px-2 py-1.5 h-full ${slot.color}`}
                          >
                            <p className="font-semibold text-xs leading-snug">{slot.materia}</p>
                            <p className="text-[11px] mt-0.5 opacity-70">{slot.maestro}</p>
                            <p className="text-[10px] mt-0.5 opacity-60 flex items-center gap-0.5">
                              <span className="material-symbols-outlined" style={{ fontSize: "11px" }}>
                                door_open
                              </span>
                              {slot.aula}
                            </p>
                          </div>
                        ) : (
                          <div className="rounded border border-dashed border-outline-variant bg-surface-variant/30 h-full min-h-[60px] flex items-center justify-center text-[11px] text-on-surface-variant/40 select-none">
                            —
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-md flex flex-wrap gap-sm">
            {[
              { label: "Matemáticas Aplicadas", color: "bg-blue-100 border-blue-300" },
              { label: "Física II", color: "bg-purple-100 border-purple-300" },
              { label: "Inglés IV", color: "bg-green-100 border-green-300" },
              { label: "Química Orgánica", color: "bg-yellow-100 border-yellow-300" },
              { label: "Historia de México", color: "bg-rose-100 border-rose-300" },
            ].map((item) => (
              <span
                key={item.label}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium text-on-surface ${item.color}`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
