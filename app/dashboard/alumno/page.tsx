import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardAlumnoPage() {
  return (
    <>
      <LoadingSpinner duration={2000} />
      <DashboardTopbar
        userImageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDBJFu1eTFJVZnEIpf-KZZvSc_2ffZQGUirP05eqMK12TVBzwigT9EauHtrNVGTd-67_1LsY_0TUiZTt05HcyZXomBqsm1Kv6mJ9lOeQcUvsx9rZTLrY0ASxcVj2CMDkmyby29mUF551eD7wf5moJ9QLCBGlQObDInlM23i5b7BpfDkM3436o3JteJDAyE28ef_KoT1fTG6ZYBYE3KNLPUgFcRV7Y5IldhFMLtpChj4-jm42Hz2QxVhJU5Gbk1KUKsL6zRDWY4Uoiz6"
        userImageAlt="User profile"
        activeTopLink="dashboard"
        linkBase="/dashboard/alumno"
      />

      <div className="flex flex-1 pt-16">
        <DashboardSidebar activeLink="inicio" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Page Header */}
          <div className="mb-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background mb-1">Panel de Estudiante</h1>
              <p className="font-body-base text-body-base text-on-surface-variant">
                Resumen académico y avisos institucionales.
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-lg py-sm rounded-lg font-label-bold text-label-bold transition-colors border border-transparent shadow-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Descargar Historial (PDF)
            </button>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">

            {/* Left column - Alerts */}
            <div className="md:col-span-4 flex flex-col gap-md">
              {/* Alert urgente */}
              <div className="bg-error-container border border-error/20 rounded-xl p-md flex flex-col gap-sm shadow-sm">
                <div className="flex items-center gap-2 text-on-error-container">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    warning
                  </span>
                  <h3 className="font-title-sm text-title-sm">Exámenes Extraordinarios</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-error-container/80">
                  El periodo de registro para exámenes extraordinarios finaliza el próximo viernes.
                  Verifica tus materias pendientes.
                </p>
                <a
                  className="mt-2 font-label-bold text-label-bold text-error underline underline-offset-2 self-start"
                  href="#"
                >
                  Ver Detalles
                </a>
              </div>

              {/* Alert aviso */}
              <div className="bg-surface-container-high border border-outline-variant rounded-xl p-md flex flex-col gap-sm shadow-sm">
                <div className="flex items-center gap-2 text-primary">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    campaign
                  </span>
                  <h3 className="font-title-sm text-title-sm text-on-surface">Avisos Urgentes</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Se suspenden actividades presenciales el día 15 de Mayo por conmemoración del Día
                  del Maestro.
                </p>
              </div>
            </div>

            {/* Right column */}
            <div className="md:col-span-8 flex flex-col gap-lg">

              {/* Mini stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between min-h-[120px]">
                  <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase">
                    Promedio Actual
                  </h3>
                  <div className="flex items-end gap-3 mt-auto">
                    <span className="text-4xl font-display-lg text-primary leading-none">8.7</span>
                    <span className="font-body-sm text-body-sm text-tertiary-fixed-dim pb-1">
                      Ciclo en curso
                    </span>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between min-h-[120px]">
                  <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase">
                    Estado Académico
                  </h3>
                  <div className="mt-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-bold text-label-bold border border-outline-variant/50">
                      <span className="w-2 h-2 rounded-full bg-secondary-container mr-2"></span>
                      Regular
                    </span>
                  </div>
                </div>
              </div>

              {/* Grades table */}
              <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-md border-b border-outline-variant bg-surface-bright">
                  <h2 className="font-title-sm text-title-sm text-on-surface">
                    Calificaciones por Parcial
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low border-b border-outline-variant">
                      <tr>
                        <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase">Materia</th>
                        <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">Parcial 1</th>
                        <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">Parcial 2</th>
                        <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">Parcial 3</th>
                        <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">Promedio</th>
                        <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">Estatus</th>
                      </tr>
                    </thead>
                    <tbody className="font-data-tabular text-data-tabular text-on-surface divide-y divide-outline-variant/50">
                      <tr className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-md py-sm font-body-sm text-body-sm">Matemáticas Aplicadas</td>
                        <td className="px-md py-sm text-center">8.5</td>
                        <td className="px-md py-sm text-center">9.0</td>
                        <td className="px-md py-sm text-center text-outline-variant">-</td>
                        <td className="px-md py-sm text-center font-bold">8.75</td>
                        <td className="px-md py-sm text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-primary">
                            Aprobado
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-lowest transition-colors bg-surface-bright/50">
                        <td className="px-md py-sm font-body-sm text-body-sm">Física II</td>
                        <td className="px-md py-sm text-center">7.0</td>
                        <td className="px-md py-sm text-center">6.5</td>
                        <td className="px-md py-sm text-center text-outline-variant">-</td>
                        <td className="px-md py-sm text-center font-bold">6.75</td>
                        <td className="px-md py-sm text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant">
                            Riesgo
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-md py-sm font-body-sm text-body-sm">Química Orgánica</td>
                        <td className="px-md py-sm text-center">9.5</td>
                        <td className="px-md py-sm text-center">10.0</td>
                        <td className="px-md py-sm text-center text-outline-variant">-</td>
                        <td className="px-md py-sm text-center font-bold">9.75</td>
                        <td className="px-md py-sm text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-primary">
                            Aprobado
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-lowest transition-colors bg-surface-bright/50">
                        <td className="px-md py-sm font-body-sm text-body-sm">Historia de México</td>
                        <td className="px-md py-sm text-center">5.0</td>
                        <td className="px-md py-sm text-center">5.5</td>
                        <td className="px-md py-sm text-center text-outline-variant">-</td>
                        <td className="px-md py-sm text-center font-bold text-error">5.25</td>
                        <td className="px-md py-sm text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container">
                            Reprobado
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-md py-sm font-body-sm text-body-sm">Inglés IV</td>
                        <td className="px-md py-sm text-center">8.0</td>
                        <td className="px-md py-sm text-center">8.0</td>
                        <td className="px-md py-sm text-center text-outline-variant">-</td>
                        <td className="px-md py-sm text-center font-bold">8.00</td>
                        <td className="px-md py-sm text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-primary">
                            Aprobado
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
