"use client";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
interface AlumnoEstado {
  alumno_id: string;
  nombre: string;
  matricula: string;
  semestre: number;
  solicitud_id: string | null;
  estado: string;
  notas_admin: string | null;
  updated_at: string | null;
  total_docs: number;
  docs_aprobados: number;
  docs_rechazados: number;
}

const ESTADO_LABEL: Record<string, string> = {
  sin_solicitud: "Sin solicitud",
  borrador:      "Borrador",
  enviada:       "Enviada",
  en_revision:   "En revisión",
  aprobada:      "Aprobada",
  rechazada:     "Rechazada",
};

const ESTADO_COLOR: Record<string, string> = {
  sin_solicitud: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
  borrador:      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  enviada:       "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  en_revision:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  aprobada:      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  rechazada:     "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────
export default function ReinscripcionPadresPage() {
  const [alumnos, setAlumnos] = useState<AlumnoEstado[]>([]);
  const [cicloEscolar, setCicloEscolar] = useState("");
  const [habilitada, setHabilitada] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/padres/reinscripcion");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error al cargar datos");
        setAlumnos(data.alumnos ?? []);
        setCicloEscolar(data.cicloEscolar ?? "");
        setHabilitada(data.habilitada ?? false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 px-2 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reinscripción {cicloEscolar}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Seguimiento del proceso de reinscripción de tus alumnos.
        </p>
      </div>

      {!habilitada && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400">
          El proceso de reinscripción no está habilitado actualmente.
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {alumnos.length === 0 && !error && (
        <div className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No tienes alumnos vinculados.
          </p>
        </div>
      )}

      {alumnos.map((alumno) => (
        <div
          key={alumno.alumno_id}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Cabecera alumno */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{alumno.nombre}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Matrícula: {alumno.matricula} · Semestre: {alumno.semestre}
              </p>
            </div>
            <span className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-semibold ${ESTADO_COLOR[alumno.estado] ?? ""}`}>
              {ESTADO_LABEL[alumno.estado] ?? alumno.estado}
            </span>
          </div>

          {/* Cuerpo */}
          <div className="px-6 py-4 space-y-3 text-sm">
            {alumno.estado === "sin_solicitud" && (
              <p className="text-gray-500 dark:text-gray-400">
                {habilitada
                  ? "Tu alumno aún no ha iniciado su trámite de reinscripción."
                  : "El proceso no está habilitado aún."}
              </p>
            )}

            {alumno.solicitud_id && (
              <>
                {/* Progreso de documentos */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: alumno.total_docs > 0
                          ? `${Math.round((alumno.docs_aprobados / alumno.total_docs) * 100)}%`
                          : "0%"
                      }}
                    />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                    {alumno.docs_aprobados}/{alumno.total_docs} docs aprobados
                  </span>
                </div>

                {alumno.docs_rechazados > 0 && (
                  <p className="text-red-600 dark:text-red-400 text-xs">
                    ⚠️ {alumno.docs_rechazados} documento(s) rechazado(s) — tu alumno necesita corregirlos.
                  </p>
                )}

                {alumno.notas_admin && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-amber-800 dark:text-amber-200">
                    <strong>Mensaje del administrador:</strong>
                    <p className="mt-0.5">{alumno.notas_admin}</p>
                  </div>
                )}

                {alumno.updated_at && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Actualizado: {new Date(alumno.updated_at).toLocaleString("es-MX")}
                  </p>
                )}
              </>
            )}

            {alumno.estado === "aprobada" && (
              <p className="text-green-700 dark:text-green-400 font-medium">
                🎉 ¡La reinscripción fue aprobada!
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
