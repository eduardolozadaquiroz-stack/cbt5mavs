"use client";

import { useState } from "react";
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

type GrupoH = { id: string; label: string; carrera: "Informática" | "Gastronomía" | "CAD"; semestre: number; turno: "Matutino" | "Vespertino" };

const CAR_CODE: Record<string, string> = { "Informática": "INF", "Gastronomía": "GAS", "CAD": "CAD" };
const T_CODE: Record<string, string>   = { "Matutino": "M", "Vespertino": "V" };

// ─── Modal: nuevo grupo ──────────────────────────────────────────────────────
function ModalNuevoGrupo({ onClose, onSave, grupos }: {
  onClose: () => void;
  onSave: (g: GrupoH) => void;
  grupos: GrupoH[];
}) {
  const [carrera, setCarrera] = useState<"Informática" | "Gastronomía" | "CAD">("Informática");
  const [semestre, setSemestre] = useState(1);
  const [letra, setLetra] = useState("");
  const [turno, setTurno] = useState<"Matutino" | "Vespertino">("Matutino");

  const letraOk = letra.trim().length > 0;
  const id = letraOk ? `G-${CAR_CODE[carrera]}-S${semestre}${letra.trim().toUpperCase()}${T_CODE[turno]}` : "—";
  const label = letraOk ? `S${semestre}-${letra.trim().toUpperCase()} ${turno === "Matutino" ? "Mat." : "Ves."}` : "";
  const yaExiste = letraOk && grupos.some((g) => g.id === id);

  function handleSave() {
    if (!letraOk || yaExiste) return;
    onSave({ id, label, carrera, semestre, turno });
    onClose();
  }

  const sB = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300";
  const lB = "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Nuevo Grupo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <label className={lB}>Carrera</label>
            <select value={carrera} onChange={(e) => setCarrera(e.target.value as typeof carrera)} className={sB}>
              <option value="Informática">Informática</option>
              <option value="Gastronomía">Gastronomía</option>
              <option value="CAD">Diseño CAD</option>
            </select>
          </div>
          <div>
            <label className={lB}>Semestre</label>
            <select value={semestre} onChange={(e) => setSemestre(Number(e.target.value))} className={sB}>
              <option value={1}>1° Semestre (1er año)</option>
              <option value={2}>2° Semestre (1er año)</option>
              <option value={3}>3° Semestre (2do año)</option>
              <option value={4}>4° Semestre (2do año)</option>
              <option value={5}>5° Semestre (3er año)</option>
              <option value={6}>6° Semestre (3er año)</option>
            </select>
          </div>
          <div>
            <label className={lB}>Letra del grupo</label>
            <input
              value={letra}
              onChange={(e) => setLetra(e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase())}
              placeholder="Ej. A, B, C..."
              className={sB}
            />
            <p className="text-[11px] text-slate-400 mt-1">Una o dos letras. Ejemplo: A → Grupo A, B → Grupo B.</p>
          </div>
          <div>
            <label className={lB}>Turno</label>
            <div className="flex gap-2">
              {(["Matutino", "Vespertino"] as const).map((t) => (
                <button key={t} onClick={() => setTurno(t)} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${turno === t ? "bg-blue-700 text-white border-blue-700" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2.5 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">ID generado:</span>
            <span className="font-mono font-bold text-sm text-blue-800 dark:text-blue-300">{id}</span>
            {yaExiste && <span className="text-xs text-red-500 font-semibold">· ya existe</span>}
          </div>
        </div>
        <div className="px-5 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button disabled={!letraOk || yaExiste} onClick={handleSave} className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Agregar Grupo</button>
        </div>
      </div>
    </div>
  );
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
    onSave({ materia: form.materia, maestro: form.maestro, salon: form.salon, color: COLORES[form.colorIdx] });
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

// ─── Modal: copiar horario a grupos similares ─────────────────────────────────
function ModalCopiarHorario({ grupoId, grupos, horarios, onCopy, onClose }: {
  grupoId: string;
  grupos: GrupoH[];
  horarios: Record<string, Record<string, Celda>>;
  onCopy: (targetIds: string[]) => void;
  onClose: () => void;
}) {
  const actual = grupos.find((g) => g.id === grupoId);
  const similares = grupos.filter((g) => g.id !== grupoId && g.carrera === actual?.carrera && g.semestre === actual?.semestre);
  const [sel, setSel] = useState<string[]>([]);
  function toggle(id: string) { setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]); }
  const totalCeldas = Object.keys(horarios[grupoId] ?? {}).length;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Copiar horario</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-slate-500 mb-1">Copiando el horario de <span className="font-semibold font-mono text-slate-700 dark:text-slate-300">{grupoId}</span> ({totalCeldas} clases asignadas)</p>
          <p className="text-xs text-slate-500 mb-3">Grupos del mismo semestre:</p>
          {similares.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-3">No hay otros grupos en este semestre.</p>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
              {similares.map((g) => (
                <label key={g.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <div onClick={() => toggle(g.id)} className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${sel.includes(g.id) ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-600"}`}>
                    {sel.includes(g.id) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">{g.id}</p>
                    <p className="text-[11px] text-slate-400">{g.turno} {horarios[g.id] ? "· ⚠ reemplazará horario existente" : "· sin horario"}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
          {similares.length > 0 && (
            <button onClick={() => setSel(similares.map((g) => g.id))} className="mt-2 text-xs text-blue-700 hover:underline">Seleccionar todos</button>
          )}
        </div>
        <div className="px-5 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button disabled={sel.length === 0} onClick={() => { onCopy(sel); onClose(); }} className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Copiar a {sel.length > 0 ? sel.length : ""} grupo{sel.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function HorariosPage() {
  const [grupos,       setGrupos]       = useState<GrupoH[]>([]);
  const [horarios,     setHorarios]     = useState<Record<string, Record<string, Celda>>>({});
  const [carreraFiltro, setCarreraFiltro] = useState<"Informática" | "Gastronomía" | "CAD">("Informática");
  const [semFiltro,     setSemFiltro]     = useState(1);
  const [grupoId,       setGrupoId]       = useState("");
  const [modal,         setModal]         = useState<{ periodo: number; dia: string } | null>(null);
  const [modalCopiar,   setModalCopiar]   = useState(false);
  const [modalNuevoGrupo, setModalNuevoGrupo] = useState(false);

  const gruposFiltrados = grupos.filter((g) => g.carrera === carreraFiltro && g.semestre === semFiltro);
  const grid   = horarios[grupoId] ?? {};
  const nombre = grupos.find((g) => g.id === grupoId)?.label ?? "";
  const hasCeldas = Object.values(grid).some((c) => c !== null);

  function handleAgregarGrupo(g: GrupoH) {
    setGrupos((prev) => [...prev, g]);
    setCarreraFiltro(g.carrera);
    setSemFiltro(g.semestre);
    setGrupoId(g.id);
  }

  function handleCarreraChange(c: "Informática" | "Gastronomía" | "CAD") {
    setCarreraFiltro(c);
    const sems = Array.from(new Set(grupos.filter((g) => g.carrera === c).map((g) => g.semestre))).sort();
    const newSem = sems[0] ?? semFiltro;
    setSemFiltro(newSem);
    const first = grupos.find((g) => g.carrera === c && g.semestre === newSem);
    setGrupoId(first?.id ?? "");
  }
  function handleSemChange(s: number) {
    setSemFiltro(s);
    const first = grupos.find((g) => g.carrera === carreraFiltro && g.semestre === s);
    setGrupoId(first?.id ?? "");
  }

  function setCelda(dia: string, periodo: number, c: Celda) {
    setHorarios((h) => ({ ...h, [grupoId]: { ...h[grupoId], [`${periodo}-${dia}`]: c } }));
  }

  function copyHorarioTo(targetIds: string[]) {
    const source = horarios[grupoId] ?? {};
    setHorarios((h) => {
      const next = { ...h };
      for (const id of targetIds) { next[id] = { ...source }; }
      return next;
    });
  }

  const semestresDisponibles = Array.from(new Set(grupos.filter((g) => g.carrera === carreraFiltro).map((g) => g.semestre))).sort();
  const carreras = ["Informática", "Gastronomía", "CAD"] as const;

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora" activeTopLink="horarios" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Horarios</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Gestión de horarios por grupo — Ciclo 2025-2026</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setModalNuevoGrupo(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Nuevo Grupo
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                Exportar PDF
              </button>
              {hasCeldas && (
                <button onClick={() => setModalCopiar(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                  Copiar a grupos similares
                </button>
              )}
            </div>
          </div>

          {/* Filtro paso 1: Carrera */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-semibold text-slate-400">Carrera:</span>
            {carreras.map((c) => (
              <button key={c} onClick={() => handleCarreraChange(c)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${carreraFiltro === c ? "bg-blue-700 text-white border-blue-700" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                {c === "CAD" ? "Diseño CAD" : c}
              </button>
            ))}
          </div>

          {/* Filtro paso 2: Semestre */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="text-xs font-semibold text-slate-400">Semestre:</span>
            {semestresDisponibles.map((s) => (
              <button key={s} onClick={() => handleSemChange(s)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${semFiltro === s ? "bg-slate-700 text-white border-slate-700" : "border-slate-200 dark:border-slate-600 text-slate-600 hover:bg-slate-50"}`}>
                S{s}
              </button>
            ))}
            <span className="text-xs text-slate-400 ml-1">{gruposFiltrados.length} grupo{gruposFiltrados.length !== 1 ? "s" : ""} en este semestre</span>
          </div>

          {/* Filtro paso 3: Grupo */}
          {gruposFiltrados.length > 0 ? (
            <div className="flex gap-1.5 flex-wrap mb-4">
              {gruposFiltrados.map((g) => {
                const tieneHorario = Object.values(horarios[g.id] ?? {}).some((c) => c !== null);
                return (
                  <button key={g.id} onClick={() => setGrupoId(g.id)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${grupoId === g.id ? "bg-blue-700 text-white border-blue-700" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                    {tieneHorario && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
                    {g.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 mb-4 italic">No hay grupos registrados para {carreraFiltro} S{semFiltro}.</p>
          )}

          {/* Grid de horario */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{grupoId}</span>
                <span className="text-xs text-slate-400">{nombre}</span>
                {hasCeldas && <span className="text-[11px] px-1.5 py-0.5 rounded bg-green-100 text-green-800 font-semibold">Horario configurado</span>}
              </div>
              <span className="text-xs text-slate-400">Haz clic en una celda (+) para agregar clase</span>
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
                                {celda.salon && <div className="text-[10px] opacity-60 truncate">{celda.salon}</div>}
                                <button onClick={() => setCelda(dia, p.id, null)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 w-4 h-4 rounded-full bg-white/80 flex items-center justify-center hover:bg-red-100 transition-all" title="Eliminar">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-red-600"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setModal({ periodo: p.id, dia })} className="w-full h-12 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex items-center justify-center text-lg font-light" title="Agregar clase">+</button>
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

          <p className="mt-2 text-xs text-slate-400">• El punto verde en los botones de grupo indica que ya tiene horario asignado. • Los cambios son locales hasta conectar con el backend.</p>
        </main>
      </div>

      {modal && (
        <ModalClase
          periodo={modal.periodo} dia={modal.dia}
          onClose={() => setModal(null)}
          onSave={(c) => { setCelda(modal.dia, modal.periodo, c); setModal(null); }}
        />
      )}

      {modalCopiar && (
        <ModalCopiarHorario
          grupoId={grupoId} grupos={grupos} horarios={horarios}
          onCopy={copyHorarioTo}
          onClose={() => setModalCopiar(false)}
        />
      )}

      {modalNuevoGrupo && (
        <ModalNuevoGrupo
          grupos={grupos}
          onSave={handleAgregarGrupo}
          onClose={() => setModalNuevoGrupo(false)}
        />
      )}
    </>
  );
}
