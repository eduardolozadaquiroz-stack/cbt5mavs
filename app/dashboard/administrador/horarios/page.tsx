"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const PERIODOS = [
  { id: 1, hora: "7:00 – 8:00" },
  { id: 2, hora: "8:00 – 9:00" },
  { id: 3, hora: "9:00 – 10:00" },
  { id: 4, hora: "10:00 – 11:00" },
  { id: 5, hora: "11:00 – 12:00" },
  { id: 6, hora: "12:00 – 13:00" },
  { id: 7, hora: "13:00 – 14:00" },
];

type Celda = { materia: string; maestro: string; salon: string; color: string } | null;

const COLORES = [
  "bg-blue-100 text-blue-900 border-blue-300",
  "bg-purple-100 text-purple-900 border-purple-300",
  "bg-green-100 text-green-900 border-green-300",
  "bg-amber-100 text-amber-900 border-amber-300",
  "bg-rose-100 text-rose-900 border-rose-300",
  "bg-teal-100 text-teal-900 border-teal-300",
];

interface GrupoApi {
  id: string;
  nombre: string;
  semestre: number;
  turno: string;
  activo: boolean;
  carrera: { id: string; nombre: string; clave: string };
}

// ─── Modal: nueva clase ───────────────────────────────────────────────────────
function ModalClase({ onClose, onSave, periodo, dia }: {
  onClose: () => void;
  onSave: (c: NonNullable<Celda>) => void;
  periodo: number; dia: string;
}) {
  const [form, setForm] = useState({ materia: "", maestro: "", salon: "", colorIdx: 0 });
  function set(k: string, v: string | number) { setForm((f) => ({ ...f, [k]: v })); }
  function handleSave() {
    if (!form.materia.trim()) return;
    onSave({ materia: form.materia.trim(), maestro: form.maestro.trim(), salon: form.salon.trim(), color: COLORES[form.colorIdx] });
  }
  const iB = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300";
  const lB = "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1";
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{dia} — Periodo {periodo}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-3">
          {[{label:"Materia *",key:"materia",ph:"Ej. Programación"},{label:"Maestro",key:"maestro",ph:"Ej. Ing. Pérez"},{label:"Salón",key:"salon",ph:"Ej. Sala TIC-1"}].map(({label,key,ph})=>(
            <div key={key}>
              <label className={lB}>{label}</label>
              <input value={(form as Record<string,string|number>)[key] as string} onChange={(e)=>set(key,e.target.value)} placeholder={ph} className={iB} />
            </div>
          ))}
          <div>
            <label className={lB}>Color</label>
            <div className="flex gap-1.5">
              {COLORES.map((c,i)=>(<button key={i} onClick={()=>set("colorIdx",i)} className={`w-6 h-6 rounded-full border-2 ${c.split(" ")[0]} ${form.colorIdx===i?"border-slate-700 scale-110":"border-transparent"} transition-transform`}/>))}
            </div>
          </div>
        </div>
        <div className="px-5 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function HorariosPage() {
  const [grupos,   setGrupos]   = useState<GrupoApi[]>([]);
  const [loadingG, setLoadingG] = useState(true);
  const [grupoId,  setGrupoId]  = useState("");
  const [grid,     setGrid]     = useState<Record<string, Celda>>({});
  const [loadingH, setLoadingH] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [modal,    setModal]    = useState<{ periodo: number; dia: string } | null>(null);

  // Cargar grupos desde la API
  useEffect(() => {
    fetch("/api/grupos")
      .then((r) => r.json())
      .then((d) => {
        const lista: GrupoApi[] = d.grupos ?? [];
        setGrupos(lista);
        // Auto-seleccionar según ?grupo=ID en la URL
        const params = new URLSearchParams(window.location.search);
        const presel = params.get("grupo");
        if (presel && lista.some((g) => g.id === presel)) {
          setGrupoId(presel);
        } else if (lista.length > 0) {
          setGrupoId(lista[0].id);
        }
      })
      .catch(() => setGrupos([]))
      .finally(() => setLoadingG(false));
  }, []);

  // Cargar celdas de horario al cambiar de grupo
  const loadGrid = useCallback((gid: string) => {
    if (!gid) { setGrid({}); return; }
    setLoadingH(true);
    fetch(`/api/admin/horarios?grupo_id=${gid}`)
      .then((r) => r.json())
      .then((d) => {
        const celdas: Record<string, Celda> = {};
        for (const c of (d.celdas ?? [])) {
          celdas[`${c.periodo}-${c.dia}`] = {
            materia: c.materia,
            maestro: c.maestro ?? "",
            salon:   c.salon ?? "",
            color:   c.color ?? COLORES[0],
          };
        }
        setGrid(celdas);
      })
      .catch(() => setGrid({}))
      .finally(() => setLoadingH(false));
  }, []);

  useEffect(() => { loadGrid(grupoId); }, [grupoId, loadGrid]);

  // Guardar/eliminar celda individualmente (actualización optimista)
  async function setCelda(dia: string, periodo: number, celda: Celda) {
    setGrid((g) => ({ ...g, [`${periodo}-${dia}`]: celda }));
    setSaving(true);
    try {
      if (celda === null) {
        await fetch(
          `/api/admin/horarios?grupo_id=${grupoId}&dia=${encodeURIComponent(dia)}&periodo=${periodo}`,
          { method: "DELETE" }
        );
      } else {
        await fetch("/api/admin/horarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ grupo_id: grupoId, dia, periodo, ...celda }),
        });
      }
    } finally {
      setSaving(false);
    }
  }

  const grupoActual = grupos.find((g) => g.id === grupoId);
  const hasCeldas   = Object.values(grid).some((c) => c !== null);

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" activeTopLink="horarios" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="horarios" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Horarios por Grupo</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {grupoActual
                  ? `Horario del grupo: ${grupoActual.nombre} · ${grupoActual.carrera.nombre} · S${grupoActual.semestre}`
                  : "Selecciona un grupo para editar su horario"}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {saving && <span className="text-xs text-slate-400 animate-pulse">Guardando...</span>}
              <a
                href={`${BASE}/grupos`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1C4.76 14.04 4.39 14 4 14c-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>
                Gestión de Grupos
              </a>
            </div>
          </div>

          {/* Estado de carga inicial */}
          {loadingG && (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Cargando grupos...</div>
          )}

          {/* Empty state: sin grupos */}
          {!loadingG && grupos.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4">
                <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
              </svg>
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">No hay grupos creados</p>
              <p className="text-sm text-slate-400 mb-4">Ve a la sección de Grupos para crear uno primero.</p>
              <a
                href={`${BASE}/grupos`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                Ir a Gestión de Grupos
              </a>
            </div>
          )}

          {/* Selector de grupo */}
          {!loadingG && grupos.length > 0 && (
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Grupo:</label>
              <select
                value={grupoId}
                onChange={(e) => setGrupoId(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              >
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre} — {g.carrera.nombre} · S{g.semestre} · {g.turno}
                  </option>
                ))}
              </select>
              {loadingH && <span className="text-xs text-slate-400">Cargando horario...</span>}
            </div>
          )}

          {/* Grid de horario */}
          {!loadingG && grupoId && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{grupoActual?.nombre}</span>
                  <span className="text-xs text-slate-400">
                    {grupoActual?.carrera.nombre} · S{grupoActual?.semestre} · {grupoActual?.turno}
                  </span>
                  {hasCeldas && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold">
                      Horario configurado
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">Haz clic en (+) para agregar · hover para eliminar</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 w-28">Periodo</th>
                      {DIAS.map((d) => (
                        <th key={d} className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PERIODOS.map((p) => (
                      <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                        <td className="px-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/50">
                          <div className="font-semibold text-xs text-slate-700 dark:text-slate-300">P{p.id}</div>
                          <div className="text-[10px] text-slate-400">{p.hora}</div>
                        </td>
                        {DIAS.map((dia) => {
                          const celda = grid[`${p.id}-${dia}`] ?? null;
                          return (
                            <td key={dia} className="px-1.5 py-1.5 align-top">
                              {celda ? (
                                <div className={`rounded-lg border px-2 py-1.5 text-xs ${celda.color} relative group cursor-default`}>
                                  <div className="font-semibold leading-tight truncate">{celda.materia}</div>
                                  {celda.maestro && <div className="text-[10px] opacity-70 mt-0.5 truncate">{celda.maestro}</div>}
                                  {celda.salon   && <div className="text-[10px] opacity-60 truncate">{celda.salon}</div>}
                                  <button
                                    onClick={() => setCelda(dia, p.id, null)}
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 w-4 h-4 rounded-full bg-white/80 flex items-center justify-center hover:bg-red-100 transition-all"
                                    title="Eliminar clase"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-red-600"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setModal({ periodo: p.id, dia })}
                                  className="w-full h-12 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex items-center justify-center text-lg font-light"
                                  title="Agregar clase"
                                >+</button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <p className="mt-2 text-xs text-slate-400">
            • Los cambios se guardan automáticamente al confirmar cada celda. • Para crear grupos ve a{" "}
            <a href={`${BASE}/grupos`} className="text-blue-600 hover:underline">Gestión de Grupos</a>.
          </p>
        </main>
      </div>

      {modal && (
        <ModalClase
          periodo={modal.periodo}
          dia={modal.dia}
          onClose={() => setModal(null)}
          onSave={(c) => { setCelda(modal.dia, modal.periodo, c); setModal(null); }}
        />
      )}
    </>
  );
}

