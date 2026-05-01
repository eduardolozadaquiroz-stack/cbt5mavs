"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

const valores = [
  { icon: "star", titulo: "Excelencia", descripcion: "Buscamos el más alto nivel de calidad en la enseñanza, el aprendizaje y la gestión institucional." },
  { icon: "handshake", titulo: "Responsabilidad", descripcion: "Fomentamos el compromiso con las tareas, la puntualidad y el cumplimiento de las obligaciones escolares." },
  { icon: "groups", titulo: "Respeto", descripcion: "Promovemos el trato digno, la tolerancia y la convivencia armónica entre todos los integrantes de la comunidad." },
  { icon: "emoji_objects", titulo: "Innovación", descripcion: "Impulsamos la creatividad y el uso de la tecnología como herramientas para la formación técnica y humana." },
  { icon: "volunteer_activism", titulo: "Solidaridad", descripcion: "Alentamos el apoyo mutuo, el trabajo en equipo y el sentido de pertenencia a nuestra institución." },
  { icon: "workspace_premium", titulo: "Integridad", descripcion: "Actuamos con honestidad, transparencia y coherencia entre los valores que declaramos y las acciones que realizamos." },
];

const NIVEL_LABEL: Record<string, string> = {
  director: "Dirección",
  subdirector: "Subdirección",
  coordinador: "Coordinación",
  docente: "Docente",
  administrativo: "Administrativo",
};

export default function NosotrosPage() {
  const { config } = useAdminConfig();
  const { mision, vision, historiaTexto, historiaEventos, directivos, instalaciones, reconocimientos } = config.nosotros;

  const director = directivos.filter((d) => d.nivel === "director");
  const subdirectores = directivos.filter((d) => d.nivel === "subdirector");
  const resto = directivos.filter((d) => d.nivel !== "director" && d.nivel !== "subdirector");

  function avatarUrl(nombre: string) {
    const initials = nombre.split(" ").slice(0, 2).map((w) => w[0]).join("");
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=1d4ed8&color=fff&size=128`;
  }

  return (
    <>
      <LoadingSpinner duration={3000} />
      <Navbar activePage="nosotros" />
      <main className="w-full font-public-sans">

        {/* ── HERO ── */}
        <section className="bg-blue-900 dark:bg-slate-900 text-white py-16 px-8">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0 flex items-center justify-center w-36 h-36 rounded-full bg-white/10 border-2 border-white/30 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Logo CBT Núm. 5" className="h-24 w-auto object-contain" />
            </div>
            <div>
              <p className="text-blue-300 text-xs font-semibold tracking-widest uppercase mb-2">
                Centro de Bachillerato Tecnológico Núm. 5 – Chalco
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Quiénes somos</h1>
              <p className="text-blue-100 text-base max-w-2xl leading-relaxed">
                Somos una institución educativa de nivel medio superior comprometida con la formación técnica y humanística
                de jóvenes del municipio de Chalco y la región oriente del Estado de México.
              </p>
            </div>
          </div>
        </section>

        {/* ── SIGNIFICADO DEL LOGO ── */}
        <section className="py-14 px-8 bg-white dark:bg-slate-950">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Significado del logo</h2>
            <div className="w-12 h-1 bg-blue-700 rounded mb-8" />
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-56 h-56 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md mx-auto lg:mx-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Logo CBT Núm. 5 – significado" className="h-44 w-auto object-contain" />
              </div>
              <div className="flex-1 space-y-6 text-sm leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-700 dark:text-blue-400 text-xl">shield</span>
                    Estructura general
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    El logo mantiene una forma de <strong className="text-slate-700 dark:text-slate-200">escudo heráldico moderno</strong>, enmarcado
                    por un borde metálico en tonos plata y azul. En el fondo destaca un <strong className="text-slate-700 dark:text-slate-200">engranaje mecánico negro y azul</strong>,
                    que simboliza el carácter técnico y el dinamismo de la institución. Una{" "}
                    <strong className="text-slate-700 dark:text-slate-200">flecha azul ascendente</strong> atraviesa el diseño,
                    representando el crecimiento y el progreso académico.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-700 dark:text-blue-400 text-xl">donut_large</span>
                    Elementos centrales — las tres carreras
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { icon: "restaurant", color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800", iconColor: "text-orange-600 dark:text-orange-400", titulo: "Técnico en Gastronomía", pos: "Sección superior izquierda", desc: "Gorro de chef, batidor de globo, espátula y tabla de picar con ingredientes frescos." },
                      { icon: "design_services", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800", iconColor: "text-purple-600 dark:text-purple-400", titulo: "Técnico en Diseño Asistido por Computadora", pos: "Sección superior derecha", desc: "Monitor mostrando el diseño técnico de un engranaje en 3D, acompañado de un mouse." },
                      { icon: "computer", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", iconColor: "text-blue-600 dark:text-blue-400", titulo: "Técnico en Informática", pos: "Base del círculo", desc: "Servidor, computadora portátil y nube digital, simbolizando la gestión de la información." },
                    ].map((c) => (
                      <div key={c.titulo} className={`rounded-xl border p-4 ${c.color}`}>
                        <span className={`material-symbols-outlined text-2xl mb-2 block ${c.iconColor}`}>{c.icon}</span>
                        <p className="font-semibold text-slate-800 dark:text-white text-xs mb-1">{c.titulo}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 italic">{c.pos}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-700 dark:text-blue-400 text-xl">person</span>
                      Retrato institucional
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      En la parte superior central, dentro de un pequeño escudo independiente, se encuentra el retrato estilizado de{" "}
                      <strong className="text-slate-700 dark:text-slate-200">María Amparo Viderique de Shein</strong>, rindiendo honor a la identidad del plantel.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-700 dark:text-blue-400 text-xl">palette</span>
                      Guía de estilo
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Paleta profesional basada en <strong className="text-slate-700 dark:text-slate-200">azules</strong> (celeste, rey y marino),{" "}
                      <strong className="text-slate-700 dark:text-slate-200">gris metálico</strong> y <strong className="text-slate-700 dark:text-slate-200">negro</strong>;
                      estética limpia y equilibrada que facilita el reconocimiento institucional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISIÓN / VISIÓN ── (dinámico) */}
        <section className="py-14 px-8 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-blue-700 dark:text-blue-400 text-3xl">flag</span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Misión</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{mision}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-blue-700 dark:text-blue-400 text-3xl">visibility</span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Visión</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{vision}</p>
            </div>
          </div>
        </section>

        {/* ── VALORES ── */}
        <section className="py-14 px-8 bg-white dark:bg-slate-950">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Valores institucionales</h2>
            <div className="w-12 h-1 bg-blue-700 rounded mb-8" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {valores.map((v) => (
                <div key={v.titulo} className="flex gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm">
                  <span className="material-symbols-outlined text-blue-700 dark:text-blue-400 text-2xl flex-shrink-0 mt-0.5">{v.icon}</span>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white mb-1">{v.titulo}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{v.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HISTORIA ── (dinámico) */}
        <section className="py-14 px-8 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Historia</h2>
            <div className="w-12 h-1 bg-blue-700 rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Texto */}
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {historiaTexto}
              </p>
              {/* Línea de tiempo */}
              {historiaEventos.length > 0 && (
                <div className="space-y-4">
                  {historiaEventos.map((item, i) => (
                    <div key={item.id} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-700 flex-shrink-0 mt-1" />
                        {i < historiaEventos.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1" style={{ minHeight: "28px" }} />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{item.anio}</span>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{item.evento}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── ORGANIGRAMA / DIRECTIVOS ── (dinámico) */}
        <section className="py-14 px-8 bg-white dark:bg-slate-950">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Organigrama</h2>
            <div className="w-12 h-1 bg-blue-700 rounded mb-10" />

            {/* Nivel Director */}
            {director.length > 0 && (
              <div className="flex justify-center mb-8">
                {director.map((d) => (
                  <DirectivoCard key={d.id} directivo={d} avatarUrl={avatarUrl} size="lg" />
                ))}
              </div>
            )}

            {/* Línea conectora */}
            {director.length > 0 && subdirectores.length > 0 && (
              <div className="flex justify-center mb-4">
                <div className="w-0.5 h-8 bg-blue-300 dark:bg-blue-700" />
              </div>
            )}

            {/* Nivel Subdirectores */}
            {subdirectores.length > 0 && (
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {subdirectores.map((d) => (
                  <DirectivoCard key={d.id} directivo={d} avatarUrl={avatarUrl} size="md" />
                ))}
              </div>
            )}

            {/* Nivel resto */}
            {resto.length > 0 && (
              <>
                {subdirectores.length > 0 && (
                  <div className="flex justify-center mb-4">
                    <div className="w-0.5 h-6 bg-slate-200 dark:bg-slate-700" />
                  </div>
                )}
                <div className="flex flex-wrap justify-center gap-4">
                  {resto.map((d) => (
                    <DirectivoCard key={d.id} directivo={d} avatarUrl={avatarUrl} size="sm" />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── INSTALACIONES ── (dinámico, con imágenes) */}
        <section className="py-14 px-8 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Instalaciones</h2>
            <div className="w-12 h-1 bg-blue-700 rounded mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {instalaciones.map((inst) => (
                <div key={inst.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden flex flex-col">
                  {inst.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={inst.imageSrc} alt={inst.label} className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-36 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                      <span className="material-symbols-outlined text-blue-700 dark:text-blue-400 text-5xl">{inst.icon}</span>
                    </div>
                  )}
                  <div className="p-3 text-center">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{inst.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RECONOCIMIENTOS ── (dinámico, con fotos) */}
        <section className="py-14 px-8 bg-white dark:bg-slate-950">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Reconocimientos y logros</h2>
            <div className="w-12 h-1 bg-blue-700 rounded mb-8" />
            <div className="space-y-6">
              {reconocimientos.map((r) => (
                <div key={r.id} className="flex flex-col sm:flex-row gap-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm">
                  {r.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.imageSrc} alt={r.titulo} className="w-full sm:w-40 h-32 sm:h-auto object-cover rounded-xl flex-shrink-0" />
                  ) : (
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                      <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-2xl">emoji_events</span>
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">{r.anio}</span>
                    <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">{r.titulo}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{r.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

// ── Componente auxiliar para tarjeta de directivo ──────────────────────────
function DirectivoCard({
  directivo,
  avatarUrl,
  size,
}: {
  directivo: { nombre: string; cargo: string; nivel: string; img: string };
  avatarUrl: (n: string) => string;
  size: "lg" | "md" | "sm";
}) {
  const imgSize = size === "lg" ? "w-24 h-24" : size === "md" ? "w-20 h-20" : "w-14 h-14";
  const cardPad = size === "lg" ? "p-6 min-w-[200px]" : size === "md" ? "p-5 min-w-[160px]" : "p-4 min-w-[130px]";
  const nameClass = size === "lg" ? "font-bold text-base" : size === "md" ? "font-bold text-sm" : "font-semibold text-xs";
  const cargoClass = size === "lg" ? "text-xs" : "text-[11px]";

  const bgClass =
    directivo.nivel === "director"
      ? "border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30"
      : directivo.nivel === "subdirector"
      ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20"
      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800";

  return (
    <div className={`flex flex-col items-center text-center rounded-2xl border shadow-sm gap-3 ${cardPad} ${bgClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={directivo.img || avatarUrl(directivo.nombre)}
        alt={directivo.nombre}
        className={`${imgSize} rounded-full object-cover border-2 border-blue-200 dark:border-blue-800`}
      />
      <div>
        <p className={`text-slate-800 dark:text-white mb-0.5 ${nameClass}`}>{directivo.nombre}</p>
        <p className={`text-blue-700 dark:text-blue-400 ${cargoClass}`}>{directivo.cargo}</p>
      </div>
    </div>
  );
}
