"use client";

import { useState, useRef } from "react";

interface UsuarioFila {
  nombre:           string;
  apellido_paterno: string;
  apellido_materno: string;
  email:            string;
  rol:              string;
  matricula:        string;
  curp:             string;
  fecha_nacimiento: string;
}

interface ResultadoFila {
  email:           string;
  ok:              boolean;
  error?:          string;
  contrasena_temp?: string;
}

// ── Parser CSV simple (maneja comillas y comas dentro de campos) ──────────────
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let cur = ""; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { cols.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    rows.push(cols);
  }
  return rows;
}

const CSV_TEMPLATE = `nombre,apellido_paterno,apellido_materno,email,rol,matricula,curp,fecha_nacimiento
Juan,García,López,juan.garcia@cbt5.edu.mx,alumno,202300001,GALJ050101HMCRPN01,2005-01-01
María,Hernández,,maria.hernandez@cbt5.edu.mx,maestro,,,
Carlos,Pérez,Ruiz,carlos.perez@cbt5.edu.mx,alumno,202300002,PERC040215HMCRLS09,2004-02-15`;

export default function ImportarUsuariosPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview,    setPreview]    = useState<UsuarioFila[]>([]);
  const [resultados, setResultados] = useState<ResultadoFila[] | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [stats,      setStats]      = useState<{ exitosos: number; fallidos: number } | null>(null);

  // ── Leer archivo CSV ────────────────────────────────────────────────────────
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) { setError("Solo se aceptan archivos .csv"); return; }

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length < 2) { setError("El CSV no tiene datos suficientes."); return; }

        const headers = rows[0].map(h => h.toLowerCase().replace(/\s/g, "_"));
        const filas: UsuarioFila[] = rows.slice(1).map(row => ({
          nombre:           row[headers.indexOf("nombre")]           ?? "",
          apellido_paterno: row[headers.indexOf("apellido_paterno")] ?? "",
          apellido_materno: row[headers.indexOf("apellido_materno")] ?? "",
          email:            row[headers.indexOf("email")]            ?? "",
          rol:              row[headers.indexOf("rol")]              ?? "alumno",
          matricula:        row[headers.indexOf("matricula")]        ?? "",
          curp:             row[headers.indexOf("curp")]             ?? "",
          fecha_nacimiento: row[headers.indexOf("fecha_nacimiento")] ?? "",
        }));

        setPreview(filas);
        setResultados(null);
        setError("");
        setStats(null);
      } catch {
        setError("Error al leer el archivo CSV.");
      }
    };
    reader.readAsText(file, "utf-8");
  }

  // ── Enviar al API ───────────────────────────────────────────────────────────
  async function handleImportar() {
    if (preview.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/admin/importar-usuarios", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ usuarios: preview }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Error al importar."); return; }
      setResultados(json.resultados);
      setStats({ exitosos: json.exitosos, fallidos: json.fallidos });
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // ── Descargar credenciales como CSV ────────────────────────────────────────
  function descargarCredenciales() {
    if (!resultados) return;
    const ok = resultados.filter(r => r.ok);
    const header = "email,contrasena_temporal\n";
    const rows   = ok.map(r => `${r.email},${r.contrasena_temp}`).join("\n");
    const blob   = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a");
    a.href = url; a.download = "credenciales_temporales.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function descargarPlantilla() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "plantilla_importacion.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const rolColor: Record<string, string> = {
    alumno:  "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    maestro: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    admin:   "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
    padres:  "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-public-sans">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface mb-1">Importación masiva de usuarios</h1>
        <p className="text-sm text-on-surface-variant">
          Crea hasta 500 usuarios en una sola operación. Cada usuario recibirá una contraseña temporal
          y deberá cambiarla en su primer inicio de sesión.
        </p>
      </div>

      {/* Paso 1: Instrucciones + plantilla */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
          Descarga la plantilla CSV
        </h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Usa esta plantilla con las columnas correctas. No cambies los nombres de las columnas.
        </p>

        {/* Vista previa del formato */}
        <div className="overflow-x-auto rounded-lg border border-outline-variant mb-4">
          <table className="text-xs w-full">
            <thead className="bg-surface-container">
              <tr>
                {["nombre","apellido_paterno","apellido_materno","email","rol","matricula","curp","fecha_nacimiento"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-on-surface-variant whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-outline-variant/30">
                <td className="px-3 py-2 text-on-surface">Juan</td>
                <td className="px-3 py-2 text-on-surface">García</td>
                <td className="px-3 py-2 text-on-surface">López</td>
                <td className="px-3 py-2 text-on-surface">juan@cbt5.edu.mx</td>
                <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">alumno</span></td>
                <td className="px-3 py-2 text-on-surface">202300001</td>
                <td className="px-3 py-2 text-on-surface-variant">GALJ050101…</td>
                <td className="px-3 py-2 text-on-surface-variant">2005-01-01</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={descargarPlantilla}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-sm font-medium text-on-surface transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Descargar plantilla.csv
        </button>
      </div>

      {/* Paso 2: Subir archivo */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
          Sube tu archivo CSV
        </h2>

        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-8 text-center cursor-pointer transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            className="w-10 h-10 mx-auto mb-3 text-outline group-hover:text-primary transition-colors">
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
          </svg>
          <p className="text-sm font-medium text-on-surface">
            {preview.length > 0
              ? `✓ ${preview.length} usuario${preview.length !== 1 ? "s" : ""} cargado${preview.length !== 1 ? "s" : ""}`
              : "Haz clic para seleccionar tu archivo .csv"
            }
          </p>
          <p className="text-xs text-on-surface-variant mt-1">Máximo 500 registros · Codificación UTF-8</p>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>

      {/* Paso 3: Vista previa */}
      {preview.length > 0 && !resultados && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-on-surface flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
              Vista previa ({preview.length} registros)
            </h2>
            <button
              onClick={handleImportar}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Importando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                  </svg>
                  Importar {preview.length} usuarios
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-outline-variant">
            <table className="text-xs w-full">
              <thead className="bg-surface-container">
                <tr>
                  {["#","Nombre","Email","Rol","Matrícula","CURP","Nac."].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-on-surface-variant whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 50).map((u, i) => (
                  <tr key={i} className="border-t border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                    <td className="px-3 py-2 text-on-surface-variant">{i + 1}</td>
                    <td className="px-3 py-2 text-on-surface font-medium whitespace-nowrap">
                      {u.nombre} {u.apellido_paterno} {u.apellido_materno}
                    </td>
                    <td className="px-3 py-2 text-on-surface-variant">{u.email}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${rolColor[u.rol] ?? "bg-slate-100 text-slate-600"}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-on-surface-variant">{u.matricula || "—"}</td>
                    <td className="px-3 py-2 text-on-surface-variant">{u.curp ? u.curp.slice(0, 8) + "…" : "—"}</td>
                    <td className="px-3 py-2 text-on-surface-variant">{u.fecha_nacimiento || "—"}</td>
                  </tr>
                ))}
                {preview.length > 50 && (
                  <tr className="border-t border-outline-variant/20">
                    <td colSpan={7} className="px-3 py-2 text-center text-on-surface-variant text-xs">
                      … y {preview.length - 50} registros más
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resultados */}
      {resultados && stats && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-on-surface text-lg">Resultados de importación</h2>
            {stats.exitosos > 0 && (
              <button
                onClick={descargarCredenciales}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Descargar credenciales ({stats.exitosos})
              </button>
            )}
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 text-center">
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.exitosos}</p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">✓ Creados exitosamente</p>
            </div>
            <div className={`rounded-lg border p-4 text-center ${
              stats.fallidos > 0
                ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            }`}>
              <p className={`text-3xl font-bold ${stats.fallidos > 0 ? "text-red-700 dark:text-red-400" : "text-slate-500"}`}>
                {stats.fallidos}
              </p>
              <p className={`text-sm mt-1 ${stats.fallidos > 0 ? "text-red-700 dark:text-red-400" : "text-slate-500"}`}>
                {stats.fallidos > 0 ? "✗ Fallidos" : "Sin errores"}
              </p>
            </div>
          </div>

          {/* Tabla de resultados */}
          <div className="overflow-x-auto rounded-lg border border-outline-variant">
            <table className="text-xs w-full">
              <thead className="bg-surface-container">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-on-surface-variant">Estado</th>
                  <th className="px-3 py-2 text-left font-semibold text-on-surface-variant">Email</th>
                  <th className="px-3 py-2 text-left font-semibold text-on-surface-variant">Contraseña temporal</th>
                  <th className="px-3 py-2 text-left font-semibold text-on-surface-variant">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r, i) => (
                  <tr key={i} className={`border-t border-outline-variant/20 ${r.ok ? "" : "bg-red-50/50 dark:bg-red-950/10"}`}>
                    <td className="px-3 py-2">
                      {r.ok
                        ? <span className="text-green-700 dark:text-green-400 font-bold">✓</span>
                        : <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                      }
                    </td>
                    <td className="px-3 py-2 text-on-surface">{r.email}</td>
                    <td className="px-3 py-2">
                      {r.ok
                        ? <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-on-surface">{r.contrasena_temp}</code>
                        : <span className="text-on-surface-variant">—</span>
                      }
                    </td>
                    <td className="px-3 py-2 text-on-surface-variant">
                      {r.error ?? "Creado correctamente"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-on-surface-variant">
            ⚠️ Descarga las credenciales ahora — las contraseñas temporales no se pueden recuperar después.
            Cada usuario deberá cambiarla en su primer inicio de sesión.
          </p>

          {/* Reiniciar */}
          <button
            onClick={() => { setPreview([]); setResultados(null); setStats(null); if (fileRef.current) fileRef.current.value = ""; }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            ← Nueva importación
          </button>
        </div>
      )}
    </div>
  );
}
