import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEzpJcll0X5d9jtID0KZQY9DQZRRq2urTYr7OTdd5wbN3bwTITJS_udArelmyFwKHp52jZMTZigPK27koZBzrOk8apUTBoENBTNSQ_9UV341OiiIG2ayvR2P6RSKF_-zlJhwraxvKTWP30vx0XqFtP3QHDJZtZ5q0FsLnV0k_-5Y9u3x3nfcJe2qD7R3eQk7iDmNl6Al0VZjLNgQ06SdDzzwjB1yyZU_u4Aiu24ZTFsCj_CbalIFeIYzf8-mCoS4Y8hn9Ux-Vpjacf";

export default function CalificacionesMaestroPage() {
  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        linkBase="/dashboard/maestro"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="calificaciones" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            {/* Page Header */}
            <div className="mb-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-background">
                  Captura de Calificaciones
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Seleccione un grupo y materia para ingresar las calificaciones del periodo actual.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-outline-variant text-on-surface font-label-bold text-label-bold rounded hover:bg-surface-container-lowest shadow-sm transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">save</span>
                  Guardar Borrador
                </button>
                <button className="px-4 py-2 bg-primary text-on-primary font-label-bold text-label-bold rounded hover:bg-primary-container shadow-sm transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">publish</span>
                  Publicar Calificaciones
                </button>
              </div>
            </div>

            {/* Selectors Card */}
            <div className="bg-white border border-outline-variant rounded-lg p-md mb-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Grupo */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="group-select">
                    Grupo
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      id="group-select"
                    >
                      <option value="301-g">301 - Gastronomía</option>
                      <option value="302-g">302 - Gastronomía</option>
                      <option value="301-i">301 - Informática</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Materia */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="subject-select">
                    Materia
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      id="subject-select"
                    >
                      <option value="mat">Matemáticas Aplicadas III</option>
                      <option value="bio">Biología Contemporánea</option>
                      <option value="ing">Inglés V</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Periodo */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="period-select">
                    Periodo Activo
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-surface-container-low border border-outline-variant rounded px-3 py-2 font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      id="period-select"
                      disabled
                    >
                      <option value="p3">Tercer Parcial</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">
                      lock
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grades Table Card */}
            <div className="bg-white border border-outline-variant rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                <h3 className="font-title-sm text-title-sm text-on-surface">Lista de Alumnos</h3>
                <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
                  <span className="w-3 h-3 rounded-full bg-error"></span>
                  Reprobado (&lt; 6)
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase sticky left-0 bg-surface-container-lowest z-10 w-1/3">
                        Nombre del Alumno
                      </th>
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-center w-32">Parcial 1</th>
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-center w-32">Parcial 2</th>
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-primary-fixed-variant uppercase text-center w-32 bg-primary-fixed/30 border-x border-outline-variant">
                        Parcial 3
                      </th>
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-center w-32">Promedio</th>
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-center w-40">Estatus</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-data-tabular">
                    <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-4 text-on-surface sticky left-0 bg-white z-10">Aguilar Martínez, Carlos</td>
                      <td className="py-2 px-4 text-center text-on-surface-variant">8.5</td>
                      <td className="py-2 px-4 text-center text-on-surface-variant">9.0</td>
                      <td className="py-2 px-4 text-center bg-primary-fixed/10 border-x border-outline-variant">
                        <input className="w-16 text-center border border-outline-variant rounded py-1 px-1 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-data-tabular" max="10" min="0" step="0.1" type="number" defaultValue="8.8" />
                      </td>
                      <td className="py-2 px-4 text-center font-bold text-on-surface">8.8</td>
                      <td className="py-2 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container-high text-on-surface">Regular</span>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-4 text-on-surface sticky left-0 bg-surface-container-lowest z-10">Bautista López, María</td>
                      <td className="py-2 px-4 text-center text-on-surface-variant">5.5</td>
                      <td className="py-2 px-4 text-center text-on-surface-variant">6.0</td>
                      <td className="py-2 px-4 text-center bg-primary-fixed/10 border-x border-outline-variant">
                        <input className="w-16 text-center border border-error rounded py-1 px-1 focus:outline-none focus:border-error focus:ring-1 focus:ring-error font-data-tabular text-error" max="10" min="0" step="0.1" type="number" defaultValue="4.5" />
                      </td>
                      <td className="py-2 px-4 text-center font-bold text-error">5.3</td>
                      <td className="py-2 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container text-on-error-container">Reprobado</span>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-4 text-on-surface sticky left-0 bg-white z-10">Cruz Hernández, Jorge</td>
                      <td className="py-2 px-4 text-center text-on-surface-variant">7.0</td>
                      <td className="py-2 px-4 text-center text-on-surface-variant">6.5</td>
                      <td className="py-2 px-4 text-center bg-primary-fixed/10 border-x border-outline-variant">
                        <input className="w-16 text-center border border-outline-variant rounded py-1 px-1 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-data-tabular" max="10" min="0" placeholder="-" step="0.1" type="number" />
                      </td>
                      <td className="py-2 px-4 text-center text-on-surface-variant">-</td>
                      <td className="py-2 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary-fixed text-on-tertiary-fixed">Pendiente</span>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-4 text-on-surface sticky left-0 bg-surface-container-lowest z-10">Díaz Sánchez, Ana Paola</td>
                      <td className="py-2 px-4 text-center text-on-surface-variant">10.0</td>
                      <td className="py-2 px-4 text-center text-on-surface-variant">9.5</td>
                      <td className="py-2 px-4 text-center bg-primary-fixed/10 border-x border-outline-variant">
                        <input className="w-16 text-center border border-outline-variant rounded py-1 px-1 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-data-tabular" max="10" min="0" step="0.1" type="number" defaultValue="10.0" />
                      </td>
                      <td className="py-2 px-4 text-center font-bold text-on-surface">9.8</td>
                      <td className="py-2 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container-high text-on-surface">Regular</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
