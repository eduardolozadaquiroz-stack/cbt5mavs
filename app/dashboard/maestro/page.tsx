import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEzpJcll0X5d9jtID0KZQY9DQZRRq2urTYr7OTdd5wbN3bwTITJS_udArelmyFwKHp52jZMTZigPK27koZBzrOk8apUTBoENBTNSQ_9UV341OiiIG2ayvR2P6RSKF_-zlJhwraxvKTWP30vx0XqFtP3QHDJZtZ5q0FsLnV0k_-5Y9u3x3nfcJe2qD7R3eQk7iDmNl6Al0VZjLNgQ06SdDzzwjB1yyZU_u4Aiu24ZTFsCj_CbalIFeIYzf8-mCoS4Y8hn9Ux-Vpjacf";

export default function DashboardMaestroPage() {
  return (
    <>
      <LoadingSpinner duration={2000} />
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        linkBase="/dashboard/maestro"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="inicio" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            {/* Page Header */}
            <div className="mb-lg">
              <h1 className="font-display-lg text-display-lg text-on-background">Bienvenido, Prof. Ramos</h1>
              <p className="text-on-surface-variant mt-unit">Ciclo 2023-2024 · Turno Matutino</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
              {[
                { icon: "groups", label: "Grupos Asignados", value: "3", sub: "Ciclo actual", color: "text-primary bg-surface-container" },
                { icon: "person", label: "Alumnos Totales", value: "87", sub: "Entre todos los grupos", color: "text-secondary bg-surface-container-high" },
                { icon: "grade", label: "Capturas Pendientes", value: "1", sub: "Tercer Parcial abierto", color: "text-[#856404] bg-[#fff3cd]" },
                { icon: "timer", label: "Cierre de Captura", value: "5 días", sub: "Vence 3 de mayo", color: "text-error bg-error-container" },
              ].map((c) => (
                <div key={c.label} className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-sm">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.color}`}>
                    <span className="material-symbols-outlined text-sm">{c.icon}</span>
                  </div>
                  <span className="font-display-lg text-display-lg text-on-surface">{c.value}</span>
                  <div>
                    <p className="font-label-bold text-label-bold text-on-surface text-xs">{c.label}</p>
                    <p className="text-xs text-on-surface-variant">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Access + Upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mb-xl">

              {/* Quick Access */}
              <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-md border-b border-outline-variant">
                  <h2 className="font-title-sm text-title-sm text-on-surface">Acceso Rápido</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md p-md">
                  {[
                    { href: "/dashboard/maestro/calificaciones", icon: "grade", title: "Captura de Calificaciones", desc: "Ingresa las calificaciones del 3er Parcial", color: "bg-primary/5 border-primary/20 hover:border-primary/40" },
                    { href: "/dashboard/maestro/asistencias", icon: "rule", title: "Registro de Asistencia", desc: "Pasa lista a tus grupos del día de hoy", color: "bg-secondary/5 border-secondary/20 hover:border-secondary/40" },
                    { href: "/dashboard/maestro/grupos", icon: "groups", title: "Mis Grupos", desc: "Consulta los alumnos de cada grupo", color: "bg-surface-container border-outline-variant hover:border-primary/30" },
                    { href: "/dashboard/maestro/reportes", icon: "analytics", title: "Reportes", desc: "Índices de reprobación y asistencia", color: "bg-surface-container border-outline-variant hover:border-primary/30" },
                  ].map((item) => (
                    <a key={item.href} href={item.href} className={`flex items-start gap-sm p-md rounded-xl border transition-colors ${item.color}`}>
                      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 shadow-sm border border-outline-variant">
                        <span className="material-symbols-outlined text-primary text-sm">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-label-bold text-label-bold text-on-surface">{item.title}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-md border-b border-outline-variant">
                  <h2 className="font-title-sm text-title-sm text-on-surface">Próximos Eventos</h2>
                </div>
                <ul className="divide-y divide-outline-variant">
                  {[
                    { fecha: "3 May", titulo: "Cierre de captura Parcial 3", tipo: "urgente", tipoClass: "bg-error-container text-on-error-container" },
                    { fecha: "5 May", titulo: "Entrega de rúbricas 301-G", tipo: "académico", tipoClass: "bg-primary-fixed text-on-primary-fixed" },
                    { fecha: "15 May", titulo: "Suspensión – Día del Maestro", tipo: "institucional", tipoClass: "bg-secondary-fixed text-on-secondary-fixed" },
                    { fecha: "20 May", titulo: "Inicio reinscripciones 2024-2025", tipo: "administrativo", tipoClass: "bg-surface-container text-primary" },
                  ].map((e) => (
                    <li key={e.titulo} className="flex items-start gap-sm px-md py-sm hover:bg-surface-variant/40 transition-colors">
                      <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-surface-container flex flex-col items-center justify-center text-center border border-outline-variant">
                        <span className="text-[10px] font-bold text-primary leading-none">{e.fecha.split(" ")[1]}</span>
                        <span className="text-[11px] text-on-surface-variant leading-none">{e.fecha.split(" ")[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">{e.titulo}</p>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium mt-0.5 ${e.tipoClass}`}>
                          {e.tipo}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Groups Summary */}
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="p-md border-b border-outline-variant flex justify-between items-center">
                <h2 className="font-title-sm text-title-sm text-on-surface">Mis Grupos</h2>
                <a href="/dashboard/maestro/grupos" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
                  Ver todos
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant">
                {[
                  { grupo: "301-G", carrera: "Gastronomía", alumnos: 32, promedio: "7.9", reprobados: 4 },
                  { grupo: "302-G", carrera: "Gastronomía", alumnos: 28, promedio: "8.3", reprobados: 2 },
                  { grupo: "301-I", carrera: "Informática", alumnos: 27, promedio: "8.6", reprobados: 1 },
                ].map((g) => (
                  <a key={g.grupo} href="/dashboard/maestro/calificaciones" className="p-md hover:bg-surface-variant/40 transition-colors flex flex-col gap-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-title-sm text-title-sm text-on-surface">{g.grupo}</span>
                      <span className="text-xs text-on-surface-variant">{g.alumnos} alumnos</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{g.carrera}</p>
                    <div className="flex items-center justify-between mt-unit">
                      <div>
                        <p className="text-xs text-on-surface-variant">Promedio</p>
                        <p className="font-semibold text-on-surface">{g.promedio}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-on-surface-variant">Reprobados</p>
                        <p className={`font-semibold ${g.reprobados > 2 ? "text-error" : "text-on-surface"}`}>{g.reprobados}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
