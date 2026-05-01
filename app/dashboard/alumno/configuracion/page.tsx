"use client";
import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBJFu1eTFJVZnEIpf-KZZvSc_2ffZQGUirP05eqMK12TVBzwigT9EauHtrNVGTd-67_1LsY_0TUiZTt05HcyZXomBqsm1Kv6mJ9lOeQcUvsx9rZTLrY0ASxcVj2CMDkmyby29mUF551eD7wf5moJ9QLCBGlQObDInlM23i5b7BpfDkM3436o3JteJDAyE28ef_KoT1fTG6ZYBYE3KNLPUgFcRV7Y5IldhFMLtpChj4-jm42Hz2QxVhJU5Gbk1KUKsL6zRDWY4Uoiz6";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${checked ? "bg-primary" : "bg-slate-300"}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

function passStrength(pass: string): { score: number; label: string; barColor: string } {
  if (!pass) return { score: 0, label: "", barColor: "" };
  let score = 0;
  if (pass.length >= 8)              score++;
  if (/[A-Z]/.test(pass))            score++;
  if (/[0-9]/.test(pass))            score++;
  if (/[^A-Za-z0-9]/.test(pass))    score++;
  if (score <= 1) return { score, label: "Débil",   barColor: "bg-red-500" };
  if (score === 2) return { score, label: "Regular",  barColor: "bg-orange-400" };
  if (score === 3) return { score, label: "Buena",    barColor: "bg-yellow-500" };
  return                { score: 4, label: "Segura",  barColor: "bg-green-500" };
}

export default function ConfiguracionAlumnoPage() {
  // ── Cuenta ──
  const [correo,   setCorreo]   = useState("v.garcia@cbt5chalco.edu.mx");
  const [telefono, setTelefono] = useState("55 1234 5678");
  const [pass,     setPass]     = useState("");
  const [passConf, setPassConf] = useState("");
  const [showPass,     setShowPass]     = useState(false);
  const [showPassConf, setShowPassConf] = useState(false);

  // ── Notificaciones ──
  const [nUrgente,        setNUrgente]        = useState(true);
  const [nAcademico,      setNAcademico]      = useState(true);
  const [nAdministrativo, setNAdministrativo] = useState(true);
  const [nInstitucional,  setNInstitucional]  = useState(false);
  const [nSistema,        setNSistema]        = useState(false);

  // ── Apariencia ──
  const [tema,   setTema]   = useState<"claro" | "oscuro">(() => {
    if (typeof window !== "undefined") return (localStorage.getItem("cbt-tema") as "claro" | "oscuro") || "claro";
    return "claro";
  });
  const [tamano, setTamano] = useState<"normal" | "grande">(() => {
    if (typeof window !== "undefined") return (localStorage.getItem("cbt-tamano") as "normal" | "grande") || "normal";
    return "normal";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "oscuro");
    localStorage.setItem("cbt-tema", tema);
  }, [tema]);

  useEffect(() => {
    document.documentElement.classList.toggle("text-grande", tamano === "grande");
    localStorage.setItem("cbt-tamano", tamano);
  }, [tamano]);

  // ── Académica ──
  const [idioma,    setIdioma]    = useState("es");
  const [privacidad, setPrivacidad] = useState(true);

  const [saved, setSaved] = useState(false);

  const strength = passStrength(pass);
  const passInsecure = pass.length > 0 && strength.score < 4;
  const mismatch = pass.length > 0 && passConf.length > 0 && pass !== passConf;

  function handleSave() {
    if (passInsecure || mismatch) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <DashboardTopbar userImageSrc={AVATAR} userImageAlt="User profile" linkBase="/dashboard/alumno" />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="inicio" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[760px] mx-auto p-md lg:p-lg">

            <div className="mb-lg flex items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-background">Configuración</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Preferencias de tu cuenta y ajustes del sistema.</p>
              </div>
              <button
                onClick={handleSave}
                disabled={passInsecure || mismatch}
                title={passInsecure ? "La contraseña debe ser Segura para guardar" : mismatch ? "Las contraseñas no coinciden" : ""}
                className={`px-4 py-2 rounded font-label-bold text-label-bold text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${saved ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary hover:bg-primary/90"}`}
              >
                <span className="material-symbols-outlined text-sm">{saved ? "check" : "save"}</span>
                {saved ? "Guardado" : "Guardar cambios"}
              </button>
            </div>

            {/* ── Sección: Cuenta ── */}
            <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-md">
              <div className="px-md py-sm border-b border-outline-variant bg-surface-bright flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">manage_accounts</span>
                <h3 className="font-title-sm text-title-sm text-on-surface">Datos de Cuenta</h3>
              </div>
              <div className="p-md flex flex-col gap-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-on-surface-variant">Correo de contacto</label>
                    <input
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-on-surface-variant">Teléfono de contacto</label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="border border-outline-variant rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-on-surface-variant">Nueva contraseña</label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        className="w-full border border-outline-variant rounded px-3 py-2 pr-10 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-2 text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-base leading-none">{showPass ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                    {pass.length > 0 && (
                      <div className="mt-1 flex flex-col gap-1">
                        <div className="flex gap-1">
                          {[1,2,3,4].map((i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${strength.score >= i ? strength.barColor : "bg-slate-200"}`} />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${
                          strength.score <= 1 ? "text-red-500" :
                          strength.score === 2 ? "text-orange-400" :
                          strength.score === 3 ? "text-yellow-600" : "text-green-600"
                        }`}>{strength.label} — mín. 8 caracteres, mayúscula, número y símbolo especial</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-on-surface-variant">Confirmar contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassConf ? "text" : "password"}
                        placeholder="••••••••"
                        value={passConf}
                        onChange={(e) => setPassConf(e.target.value)}
                        className={`w-full border rounded px-3 py-2 pr-10 text-sm text-on-surface focus:outline-none focus:ring-1 ${pass && passConf && pass !== passConf ? "border-error focus:border-error focus:ring-error" : "border-outline-variant focus:border-primary focus:ring-primary"}`}
                      />
                      <button type="button" onClick={() => setShowPassConf(p => !p)} className="absolute right-3 top-2 text-on-surface-variant hover:text-on-surface">
                        <span className="material-symbols-outlined text-base leading-none">{showPassConf ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                    {pass && passConf && pass !== passConf && (
                      <p className="text-xs text-error">Las contraseñas no coinciden</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Sección: Notificaciones ── */}
            <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-md">
              <div className="px-md py-sm border-b border-outline-variant bg-surface-bright flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">notifications</span>
                <h3 className="font-title-sm text-title-sm text-on-surface">Notificaciones</h3>
              </div>
              <div className="divide-y divide-outline-variant">
                {[
                  { label: "Avisos urgentes",        desc: "Cierres de captura, extraordinarios", val: nUrgente,        set: setNUrgente },
                  { label: "Avisos académicos",       desc: "Calificaciones, eventos académicos",  val: nAcademico,      set: setNAcademico },
                  { label: "Avisos administrativos",  desc: "Reinscripciones, trámites",           val: nAdministrativo, set: setNAdministrativo },
                  { label: "Avisos institucionales",  desc: "Suspensiones, eventos del plantel",   val: nInstitucional,  set: setNInstitucional },
                  { label: "Notificaciones del sistema", desc: "Mantenimientos y actualizaciones", val: nSistema,        set: setNSistema },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-md py-sm">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{row.label}</p>
                      <p className="text-xs text-on-surface-variant">{row.desc}</p>
                    </div>
                    <Toggle checked={row.val} onChange={row.set} />
                  </div>
                ))}
              </div>
            </section>

            {/* ── Sección: Apariencia ── */}
            <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-md">
              <div className="px-md py-sm border-b border-outline-variant bg-surface-bright flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">palette</span>
                <h3 className="font-title-sm text-title-sm text-on-surface">Apariencia</h3>
              </div>
              <div className="p-md flex flex-col gap-md">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface-variant">Tema</label>
                  <div className="flex gap-3">
                    {(["claro", "oscuro"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTema(t)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${tema === t ? "border-primary bg-primary/5 text-primary" : "border-outline-variant text-on-surface hover:bg-surface-container-lowest"}`}
                      >
                        <span className="material-symbols-outlined text-sm">{t === "claro" ? "light_mode" : "dark_mode"}</span>
                        {t === "claro" ? "Claro" : "Oscuro"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface-variant">Tamaño de texto</label>
                  <div className="flex gap-3">
                    {(["normal", "grande"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTamano(t)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${tamano === t ? "border-primary bg-primary/5 text-primary" : "border-outline-variant text-on-surface hover:bg-surface-container-lowest"}`}
                      >
                        {t === "normal" ? "Normal (16px)" : "Grande (18px)"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Sección: Preferencias académicas ── */}
            <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-md">
              <div className="px-md py-sm border-b border-outline-variant bg-surface-bright flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">school</span>
                <h3 className="font-title-sm text-title-sm text-on-surface">Preferencias Académicas</h3>
              </div>
              <div className="p-md flex flex-col gap-md">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface-variant">Idioma del sistema</label>
                  <div className="relative w-48">
                    <select
                      value={idioma}
                      onChange={(e) => setIdioma(e.target.value)}
                      className="w-full appearance-none border border-outline-variant rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-2 text-on-surface-variant pointer-events-none text-sm">expand_more</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Perfil público</p>
                    <p className="text-xs text-on-surface-variant">Otros alumnos pueden ver tu nombre en listas de grupo</p>
                  </div>
                  <Toggle checked={privacidad} onChange={setPrivacidad} />
                </div>
              </div>
            </section>

            {/* ── Cerrar sesión ── */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 border border-error text-error rounded hover:bg-error/5 text-sm font-medium transition-colors">
                <span className="material-symbols-outlined text-sm">logout</span>
                Cerrar sesión
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
