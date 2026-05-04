"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Formulario de vinculación de hijo/a ───────────────────────────────────────
function VincularHijoForm({ onVinculado }: { onVinculado: () => void }) {
  const [open, setOpen] = useState(false);
  const [matricula, setMatricula] = useState("");
  const [curp, setCurp] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/padres/vincular-alumno", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricula: matricula.trim(),
          curp: curp.trim().toUpperCase(),
          fecha_nacimiento: fechaNac,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "No se pudo vincular. Verifica los datos e intenta de nuevo.");
      } else {
        setSuccess(`¡Vinculado correctamente! Bienvenido, ${json.alumno?.nombre ?? "estudiante"}.`);
        setMatricula(""); setCurp(""); setFechaNac("");
        // Esperar un momento y recargar la lista
        setTimeout(() => { setOpen(false); onVinculado(); }, 1800);
      }
    } catch {
      setError("Error de red. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-outline-variant overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setError(""); setSuccess(""); }}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-low hover:bg-surface-container text-left transition-colors"
      >
        <span className="font-label-bold text-label-bold text-on-surface flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
            <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/>
          </svg>
          Vincular a mi hijo/a
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-4 h-4 text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>

      {/* Form body */}
      {open && (
        <form onSubmit={handleSubmit} className="px-4 pb-5 pt-4 flex flex-col gap-4 bg-white dark:bg-slate-900">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Ingresa los datos de tu hijo/a para vincularlo a tu cuenta. Los <strong>3 datos deben coincidir</strong> exactamente con los registrados por la escuela.
          </p>

          {/* Matrícula */}
          <div>
            <label className="block font-label-bold text-label-bold text-on-surface mb-1" htmlFor="vin-matricula">
              Matrícula del alumno
            </label>
            <input
              id="vin-matricula"
              type="text"
              inputMode="numeric"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value.replace(/\D/g, ""))}
              placeholder="Ej. 201724408"
              maxLength={12}
              required
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest dark:bg-slate-800 px-3 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
          </div>

          {/* CURP */}
          <div>
            <label className="block font-label-bold text-label-bold text-on-surface mb-1" htmlFor="vin-curp">
              CURP del alumno
            </label>
            <input
              id="vin-curp"
              type="text"
              value={curp}
              onChange={(e) => setCurp(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              placeholder="XXXX000000XXXXXXXX"
              maxLength={18}
              minLength={18}
              required
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest dark:bg-slate-800 px-3 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition uppercase"
            />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block font-label-bold text-label-bold text-on-surface mb-1" htmlFor="vin-fnac">
              Fecha de nacimiento del alumno
            </label>
            <input
              id="vin-fnac"
              type="date"
              value={fechaNac}
              onChange={(e) => setFechaNac(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest dark:bg-slate-800 px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
          </div>

          {/* Mensajes */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-700 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !matricula || !curp || !fechaNac}
            className="w-full bg-primary text-white font-label-bold text-label-bold py-2.5 px-4 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Verificando...
              </>
            ) : (
              "Vincular estudiante"
            )}
          </button>

          {/* Aviso de seguridad */}
          <p className="font-body-xs text-body-xs text-on-surface-variant text-center">
            Si los datos no coinciden o realizas demasiados intentos, el sistema bloqueará temporalmente tu cuenta por seguridad.
          </p>
        </form>
      )}
    </div>
  );
}

interface AlumnoVinculado {
  alumno_id: string;
  matricula: string;
  nombre: string;
  semestre: number;
  grupo: string;
  carrera: string;
  estatus: string;
}

export default function SeleccionarAlumnoPage() {
  const [alumnos, setAlumnos] = useState<AlumnoVinculado[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function fetchMisAlumnos() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/padres/mis-alumnos", { credentials: "include" });
      if (res.status === 401) { router.replace("/login"); return; }
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Error al cargar alumnos vinculados."); return; }
      const lista: AlumnoVinculado[] = json.alumnos ?? [];
      setAlumnos(lista);
      if (lista.length === 1) setSelectedId(lista[0].alumno_id);
    } catch {
      setError("Error de red. Verifica tu conexión.");
    } finally {
      setLoadingList(false);
    }
  }

  // Cargar SOLO los alumnos vinculados a este padre desde la API segura
  useEffect(() => {
    fetchMisAlumnos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!selectedId) {
      setError("Selecciona un estudiante de la lista.");
      return;
    }

    const alumno = alumnos.find((a) => a.alumno_id === selectedId);
    if (!alumno) {
      setError("Selección inválida.");
      return;
    }

    setSubmitting(true);
    // Solo guardamos datos no sensibles para la UI (el acceso real siempre se valida en el servidor)
    sessionStorage.setItem("selectedAlumnoId", alumno.alumno_id);
    sessionStorage.setItem("selectedAlumnoNombre", alumno.nombre);
    sessionStorage.setItem("selectedAlumnoSemestre", String(alumno.semestre));
    sessionStorage.setItem("selectedAlumnoGrupo", alumno.grupo);
    router.push("/dashboard/padres");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-container-low font-public-sans">
      {/* Brand header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo CBT Núm. 5" className="w-16 h-16 object-contain" />
        </div>
        <h2 className="font-title-sm text-title-sm text-primary tracking-tight">CBT Núm. 5 Chalco</h2>
      </div>

      {/* Card */}
      <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">

        {/* Card header */}
        <div className="px-10 pt-10 pb-6">
          <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Seleccionar Estudiante</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Selecciona el estudiante cuyo seguimiento deseas ver.
          </p>
        </div>

        <div className="px-10 pb-10">

          {/* Estado de carga */}
          {loadingList ? (
            <div className="flex items-center justify-center gap-2 py-8 text-on-surface-variant">
              <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span className="font-body-sm text-body-sm">Cargando estudiantes vinculados...</span>
            </div>
          ) : alumnos.length === 0 ? (
            /* Sin alumnos vinculados */
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-4 py-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-amber-500 mx-auto mb-2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p className="font-label-bold text-label-bold text-amber-800 dark:text-amber-200 mb-1">
                  Sin estudiantes vinculados
                </p>
                <p className="font-body-sm text-body-sm text-amber-700 dark:text-amber-300">
                  Vincula a tu hijo/a ingresando su matrícula, CURP y fecha de nacimiento, o contacta a la administración.
                </p>
              </div>
              {/* Formulario de autoservicio */}
              <VincularHijoForm onVinculado={fetchMisAlumnos} />
              <p className="text-center font-body-xs text-body-xs text-on-surface-variant">
                ¿Problemas?{" "}
                <Link href="/contacto" className="text-primary hover:underline">
                  Contacta a la administración →
                </Link>
              </p>
            </div>
          ) : (
            /* Lista de alumnos vinculados */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <fieldset className="flex flex-col gap-2">
                <legend className="font-label-bold text-label-bold text-on-surface mb-1">
                  Mis estudiantes vinculados
                </legend>

                {alumnos.map((alumno) => (
                  <label
                    key={alumno.alumno_id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedId === alumno.alumno_id
                        ? "border-primary bg-primary/5"
                        : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low"
                    }`}
                  >
                    <input
                      type="radio"
                      name="alumno"
                      value={alumno.alumno_id}
                      checked={selectedId === alumno.alumno_id}
                      onChange={() => setSelectedId(alumno.alumno_id)}
                      className="mt-0.5 accent-primary"
                      required
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-label-bold text-label-bold text-on-surface truncate">
                        {alumno.nombre}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Matrícula: {alumno.matricula} · {alumno.carrera}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {alumno.semestre}° semestre · Grupo {alumno.grupo}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        alumno.estatus === "regular"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : alumno.estatus === "en_riesgo"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {alumno.estatus === "regular"
                        ? "Regular"
                        : alumno.estatus === "en_riesgo"
                        ? "En riesgo"
                        : "Crítico"}
                    </span>
                  </label>
                ))}
              </fieldset>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!selectedId || submitting}
                className="w-full mt-1 bg-primary text-white font-label-bold text-label-bold py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Cargando...
                  </>
                ) : (
                  "Ver Seguimiento"
                )}
              </button>
            </form>
          )}

          {/* Vincular otro hijo (siempre disponible si ya hay alumnos) */}
          {!loadingList && alumnos.length > 0 && (
            <VincularHijoForm onVinculado={fetchMisAlumnos} />
          )}

          {/* Cerrar sesión */}
          <div className="mt-6 pt-4 border-t border-outline-variant/50 text-center">
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/login");
              }}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
