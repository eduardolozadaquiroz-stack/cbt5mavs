"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

interface Grupo {
  id: string;
  nombre: string;
  semestre: number;
  turno: string;
  activo: boolean;
  carrera: { id: string; nombre: string; clave: string };
  ciclo: { id: string; nombre: string; activo: boolean };
}

function turnoColor(turno: string) {
  if (turno === "matutino") return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200";
  return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200";
}

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fCarrera, setFCarrera] = useState("Todas");
  const [fSem, setFSem] = useState(0);
  const [fTurno, setFTurno] = useState("Todos");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/grupos")
      .then((r) => r.json())
      .then((d) => setGrupos(d.grupos ?? []))
      .catch(() => setGrupos([]))
      .finally(() => setLoading(false));
  }, []);

  const carreras = ["Todas", ...Array.from(new Set(grupos.map((g) => g.carrera.nombre)))];

  const filtrados = grupos.filter((g) => {
    const okCarrera = fCarrera === "Todas" || g.carrera.nombre === fCarrera;
    const okSem = fSem === 0 || g.semestre === fSem;
    const okTurno = fTurno === "Todos" || g.turno === fTurno;
    const q = query.toLowerCase();
    const okQ = q === "" || g.nombre.toLowerCase().includes(q) || g.carrera.nombre.toLowerCase().includes(q);
    return okCarrera && okSem && okTurno && okQ;
  });

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" activeTopLink="grupos" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="grupos" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Grupos</h2>
              <p className="text-sm text-slate-500 mt-0.5">{loading ? "Cargando..." : `${grupos.length} grupos registrados`}</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total grupos",     val: grupos.length,                                         color: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300" },
              { label: "Activos",          val: grupos.filter((g) => g.activo).length,                 color: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300" },
              { label: "Turno matutino",   val: grupos.filter((g) => g.turno === "matutino").length,   color: "bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300" },
              { label: "Turno vespertino", val: grupos.filter((g) => g.turno === "vespertino").length, color: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300" },
            ].map(({ label, val, color }) => (
              <div key={label} className={`rounded-xl p-3 ${color}`}>
                <p className="text-xs font-medium opacity-70">{label}</p>
                <p className="text-xl font-bold mt-0.5">{loading ? "—" : val}</p>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-3 mb-3 flex flex-col gap-2.5">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre de grupo o carrera..." className="w-full sm:w-80 pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300" />
            </div>
            <div className="flex gap-1.5 flex-wrap items-center">
              <span className="text-xs font-semibold text-slate-400 mr-1">Carrera:</span>
              {carreras.map((c) => (
                <button key={c} onClick={() => setFCarrera(c)} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${fCarrera === c ? "bg-blue-700 text-white border-blue-700" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{c}</button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap items-center">
              <span className="text-xs font-semibold text-slate-400 mr-1">Semestre:</span>
              <button onClick={() => setFSem(0)} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${fSem === 0 ? "bg-slate-700 text-white border-slate-700" : "border-slate-200 dark:border-slate-600 text-slate-600 hover:bg-slate-50"}`}>Todos</button>
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <button key={s} onClick={() => setFSem(s)} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${fSem === s ? "bg-slate-700 text-white border-slate-700" : "border-slate-200 dark:border-slate-600 text-slate-600 hover:bg-slate-50"}`}>S{s}</button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap items-center">
              <span className="text-xs font-semibold text-slate-400 mr-1">Turno:</span>
              {[{ key: "Todos", label: "Ambos turnos" }, { key: "matutino", label: "Matutino" }, { key: "vespertino", label: "Vespertino" }].map(({ key, label }) => (
                <button key={key} onClick={() => setFTurno(key)} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${fTurno === key ? "bg-sky-700 text-white border-sky-700" : "border-slate-200 dark:border-slate-600 text-slate-600 hover:bg-slate-50"}`}>{label}</button>
              ))}
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[680px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {["Nombre", "Carrera", "Semestre", "Turno", "Ciclo", "Estado"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left border-b border-slate-200 dark:border-slate-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">Cargando...</td></tr>
                  )}
                  {!loading && filtrados.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No hay grupos registrados aún.</td></tr>
                  )}
                  {!loading && filtrados.map((g) => (
                    <tr key={g.id} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-200">{g.nombre}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400">{g.carrera.nombre}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-xs text-slate-600 dark:text-slate-400">S{g.semestre}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${turnoColor(g.turno)}`}>
                          {g.turno.charAt(0).toUpperCase() + g.turno.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400">{g.ciclo.nombre}</td>
                      <td className="px-4 py-2.5">
                        {g.activo
                          ? <span className="inline-flex px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-semibold">Activo</span>
                          : <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-semibold">Inactivo</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500">
                    <td colSpan={6} className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                      {loading ? "Cargando..." : `Mostrando ${filtrados.length} de ${grupos.length} grupos`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Convención de ID: G-{CAR}-S{SEM}{LETRA}{TURNO}
// CAR: INF|GAS|CAD  SEM: 1-6  LETRA: A-E  TURNO: M (Matutino) | V (Vespertino)
// Ej: G-INF-S1AM = Informática, Semestre 1, Grupo A, Matutino

type Carrera = "Informática" | "Gastronomía" | "CAD";
type Turno   = "Matutino" | "Vespertino";
type Sem     = 1 | 2 | 3 | 4 | 5 | 6;
type Grupo   = { id: string; carrera: Carrera; semestre: Sem; letra: string; turno: Turno; tutor: string; salon: string; alumnos: number };

const CAR_CODE: Record<Carrera, string> = { Informática: "INF", Gastronomía: "GAS", CAD: "CAD" };
const T_CODE:   Record<Turno,   string> = { Matutino: "M", Vespertino: "V" };
const gid = (c: Carrera, s: number, l: string, t: Turno) => `G-${CAR_CODE[c]}-S${s}${l}${T_CODE[t]}`;

const TUTORES: Record<Carrera, string[]> = {
  Informática: ["Ing. Pérez Castro, Juan","Ing. Ramírez Díaz, Elena","Lic. Mendoza López, Pedro","Lic. Torres Ruiz, Sandra","Ing. Vázquez Cruz, Marco"],
  Gastronomía: ["Lic. García Mendoza, Rosa","Chef Morales Lima, Arturo","Lic. Herrera Soto, Carmen","Chef Ríos Vega, Fernando"],
  CAD:         ["Arq. Flores Nava, Beatriz","Ing. Salinas Mora, Roberto","Lic. Castillo Alba, Gabriela"],
};
const SALONES: Record<Carrera, string[]> = {
  Informática: ["Sala TIC-1","Sala TIC-2","Sala TIC-3","Sala TIC-4"],
  Gastronomía: ["Taller A","Taller B","Cocina Fría"],
  CAD:         ["Sala CAD-1","Sala CAD-2"],
};

// ~24 grupos representativos — en producción vendrán del backend
// Con 2 000 alumnos esperados, habrá ~57 grupos: ajustar letras/sems según inscripción
const gruposIniciales: Grupo[] = [
  // ─── Informática S1 (5 grupos: 3M + 2V) ────────────────────────────────────
  {id:gid("Informática",1,"A","Matutino"),  carrera:"Informática",semestre:1,letra:"A",turno:"Matutino",  tutor:TUTORES.Informática[0],salon:SALONES.Informática[0],alumnos:38},
  {id:gid("Informática",1,"B","Matutino"),  carrera:"Informática",semestre:1,letra:"B",turno:"Matutino",  tutor:TUTORES.Informática[2],salon:SALONES.Informática[1],alumnos:37},
  {id:gid("Informática",1,"C","Matutino"),  carrera:"Informática",semestre:1,letra:"C",turno:"Matutino",  tutor:TUTORES.Informática[4],salon:SALONES.Informática[2],alumnos:36},
  {id:gid("Informática",1,"A","Vespertino"),carrera:"Informática",semestre:1,letra:"A",turno:"Vespertino",tutor:TUTORES.Informática[3],salon:SALONES.Informática[0],alumnos:35},
  {id:gid("Informática",1,"B","Vespertino"),carrera:"Informática",semestre:1,letra:"B",turno:"Vespertino",tutor:TUTORES.Informática[1],salon:SALONES.Informática[1],alumnos:34},
  // ─── Informática S2 (4 grupos) ───────────────────────────────────────────────
  {id:gid("Informática",2,"A","Matutino"),  carrera:"Informática",semestre:2,letra:"A",turno:"Matutino",  tutor:TUTORES.Informática[0],salon:SALONES.Informática[0],alumnos:36},
  {id:gid("Informática",2,"B","Matutino"),  carrera:"Informática",semestre:2,letra:"B",turno:"Matutino",  tutor:TUTORES.Informática[2],salon:SALONES.Informática[2],alumnos:35},
  {id:gid("Informática",2,"A","Vespertino"),carrera:"Informática",semestre:2,letra:"A",turno:"Vespertino",tutor:TUTORES.Informática[3],salon:SALONES.Informática[1],alumnos:33},
  {id:gid("Informática",2,"B","Vespertino"),carrera:"Informática",semestre:2,letra:"B",turno:"Vespertino",tutor:TUTORES.Informática[1],salon:SALONES.Informática[3],alumnos:32},
  // ─── Informática S3 (3 grupos) ───────────────────────────────────────────────
  {id:gid("Informática",3,"A","Matutino"),  carrera:"Informática",semestre:3,letra:"A",turno:"Matutino",  tutor:TUTORES.Informática[1],salon:SALONES.Informática[2],alumnos:34},
  {id:gid("Informática",3,"B","Matutino"),  carrera:"Informática",semestre:3,letra:"B",turno:"Matutino",  tutor:TUTORES.Informática[4],salon:SALONES.Informática[3],alumnos:33},
  {id:gid("Informática",3,"A","Vespertino"),carrera:"Informática",semestre:3,letra:"A",turno:"Vespertino",tutor:TUTORES.Informática[0],salon:SALONES.Informática[1],alumnos:32},
  // ─── Gastronomía S1 (3 grupos) ───────────────────────────────────────────────
  {id:gid("Gastronomía",1,"A","Matutino"),  carrera:"Gastronomía",semestre:1,letra:"A",turno:"Matutino",  tutor:TUTORES.Gastronomía[0],salon:SALONES.Gastronomía[0],alumnos:36},
  {id:gid("Gastronomía",1,"B","Matutino"),  carrera:"Gastronomía",semestre:1,letra:"B",turno:"Matutino",  tutor:TUTORES.Gastronomía[2],salon:SALONES.Gastronomía[1],alumnos:35},
  {id:gid("Gastronomía",1,"A","Vespertino"),carrera:"Gastronomía",semestre:1,letra:"A",turno:"Vespertino",tutor:TUTORES.Gastronomía[1],salon:SALONES.Gastronomía[0],alumnos:34},
  // ─── Gastronomía S3 (2 grupos) ───────────────────────────────────────────────
  {id:gid("Gastronomía",3,"A","Matutino"),  carrera:"Gastronomía",semestre:3,letra:"A",turno:"Matutino",  tutor:TUTORES.Gastronomía[0],salon:SALONES.Gastronomía[2],alumnos:31},
  {id:gid("Gastronomía",3,"A","Vespertino"),carrera:"Gastronomía",semestre:3,letra:"A",turno:"Vespertino",tutor:TUTORES.Gastronomía[3],salon:SALONES.Gastronomía[1],alumnos:29},
  // ─── Gastronomía S5 ──────────────────────────────────────────────────────────
  {id:gid("Gastronomía",5,"A","Matutino"),  carrera:"Gastronomía",semestre:5,letra:"A",turno:"Matutino",  tutor:TUTORES.Gastronomía[0],salon:SALONES.Gastronomía[0],alumnos:27},
  // ─── CAD S1 ───────────────────────────────────────────────────────────────────
  {id:gid("CAD",1,"A","Matutino"),          carrera:"CAD",        semestre:1,letra:"A",turno:"Matutino",  tutor:TUTORES.CAD[0],        salon:SALONES.CAD[0],        alumnos:32},
  {id:gid("CAD",1,"A","Vespertino"),        carrera:"CAD",        semestre:1,letra:"A",turno:"Vespertino",tutor:TUTORES.CAD[1],        salon:SALONES.CAD[0],        alumnos:30},
  // ─── CAD S3 ───────────────────────────────────────────────────────────────────
  {id:gid("CAD",3,"A","Matutino"),          carrera:"CAD",        semestre:3,letra:"A",turno:"Matutino",  tutor:TUTORES.CAD[0],        salon:SALONES.CAD[1],        alumnos:28},
  {id:gid("CAD",3,"A","Vespertino"),        carrera:"CAD",        semestre:3,letra:"A",turno:"Vespertino",tutor:TUTORES.CAD[2],        salon:SALONES.CAD[0],        alumnos:26},
  // ─── CAD S5 / S6 ──────────────────────────────────────────────────────────────
  {id:gid("CAD",5,"A","Matutino"),          carrera:"CAD",        semestre:5,letra:"A",turno:"Matutino",  tutor:TUTORES.CAD[0],        salon:SALONES.CAD[1],        alumnos:25},
  {id:gid("CAD",6,"A","Matutino"),          carrera:"CAD",        semestre:6,letra:"A",turno:"Matutino",  tutor:TUTORES.CAD[1],        salon:SALONES.CAD[1],        alumnos:23},
];

const CAR_COLOR: Record<Carrera, string> = {
  Informática: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  Gastronomía: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  CAD:         "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
};
const TURNO_COLOR: Record<Turno, string> = {
  Matutino:   "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200",
  Vespertino: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200",
};

// ─── Modal Nuevo Grupo ────────────────────────────────────────────────────────
function ModalNuevoGrupo({ onClose, onCreated }: { onClose: () => void; onCreated: (g: Grupo) => void }) {
  const [form, setForm] = useState({ carrera: "Informática" as Carrera, semestre: 1 as Sem, letra: "A", turno: "Matutino" as Turno, tutor: "", salon: "" });
  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const previewId = gid(form.carrera, form.semestre, form.letra, form.turno);
  const cLabel = form.carrera === "CAD" ? "Diseño Asistido" : form.carrera;
  const previewNombre = `${cLabel} S${form.semestre}-${form.letra} ${form.turno}`;
  function handleSave() {
    onCreated({ id: previewId, carrera: form.carrera, semestre: form.semestre as Sem, letra: form.letra, turno: form.turno, tutor: form.tutor || "Por asignar", salon: form.salon || "Por asignar", alumnos: 0 });
    onClose();
  }
  const iB = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300";
  const lB = "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Nuevo Grupo</h2>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-3">
          <div>
            <label className={lB}>Carrera</label>
            <select value={form.carrera} onChange={(e) => set("carrera", e.target.value)} className={iB}>
              {(["Informática","Gastronomía","CAD"] as Carrera[]).map((c) => <option key={c} value={c}>{c === "CAD" ? "Diseño Asistido (CAD)" : c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className={lB}>Semestre</label>
              <select value={form.semestre} onChange={(e) => set("semestre", Number(e.target.value))} className={iB}>
                {[1,2,3,4,5,6].map((s) => <option key={s} value={s}>S{s}</option>)}
              </select>
            </div>
            <div>
              <label className={lB}>Grupo</label>
              <select value={form.letra} onChange={(e) => set("letra", e.target.value)} className={iB}>
                {["A","B","C","D","E","F"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={lB}>Turno</label>
              <select value={form.turno} onChange={(e) => set("turno", e.target.value)} className={iB}>
                <option>Matutino</option><option>Vespertino</option>
              </select>
            </div>
          </div>
          <div>
            <label className={lB}>Tutor responsable</label>
            <input value={form.tutor} onChange={(e) => set("tutor", e.target.value)} placeholder={`Ej. ${TUTORES[form.carrera][0]}`} className={iB} />
          </div>
          <div>
            <label className={lB}>Salón / Aula</label>
            <input value={form.salon} onChange={(e) => set("salon", e.target.value)} placeholder={`Ej. ${SALONES[form.carrera][0]}`} className={iB} />
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg px-3 py-2 text-xs text-blue-800 dark:text-blue-200">
            <span className="font-semibold">ID generado: </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-300 mr-2">{previewId}</span>
            <span className="text-blue-500">{previewNombre}</span>
          </div>
        </div>
        <div className="px-5 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors">Crear grupo</button>
        </div>
      </div>
    </div>
  );
}

