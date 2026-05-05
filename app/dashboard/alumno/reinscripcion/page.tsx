"use client";
import { useEffect, useState, useCallback } from "react";
import { useAdminConfig } from "@/app/context/AdminConfigContext";
import FileUploadInput from "@/components/dashboard/FileUploadInput";
import LoadingSpinner from "@/components/LoadingSpinner";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
interface Documento {
  id: string;
  nombre: string;
  url: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  notas: string | null;
  created_at: string;
}

interface Solicitud {
  id: string;
  estado: "borrador" | "enviada" | "en_revision" | "aprobada" | "rechazada";
  notas_admin: string | null;
  ciclo_escolar: string;
  created_at: string;
  updated_at: string;
  reinscripcion_documentos: Documento[];
}

// ─────────────────────────────────────────────
// Helpers de estado
// ─────────────────────────────────────────────
const ESTADO_LABEL: Record<string, string> = {
  borrador:    "Borrador",
  enviada:     "Enviada",
  en_revision: "En revisión",
  aprobada:    "Aprobada",
  rechazada:   "Rechazada",
};

const ESTADO_COLOR: Record<string, string> = {
  borrador:    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  enviada:     "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  en_revision: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  aprobada:    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  rechazada:   "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const DOC_ESTADO_COLOR: Record<string, string> = {
  pendiente:  "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
  aprobado:   "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  rechazado:  "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────
export default function ReinscripcionAlumnoPage() {
  const { config } = useAdminConfig();
  const reinConfig = config.reinscripcion;
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [cicloEscolar, setCicloEscolar] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Documentos requeridos según la configuración
  const docsRequeridos: string[] = reinConfig?.documentosRequeridos
    ? reinConfig.documentosRequeridos.split(",").map((d: string) => d.trim()).filter(Boolean)
    : [];

  // ─── Fetch solicitud ────────────────────────
  const fetchSolicitud = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reinscripcion/mi-solicitud");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al cargar solicitud");
      setSolicitud(data.solicitud ?? null);
      setCicloEscolar(data.cicloEscolar ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSolicitud(); }, [fetchSolicitud]);

  // ─── Crear solicitud ───────────────────────
  async function crearSolicitud() {
    setCreando(true);
    setError(null);
    try {
      const res = await fetch("/api/reinscripcion/mi-solicitud", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear solicitud");
      await fetchSolicitud();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCreando(false);
    }
  }

  // ─── Subir documento ──────────────────────
  async function subirDocumento(nombre: string, url: string) {
    if (!solicitud) return;
    setError(null);
    try {
      const res = await fetch("/api/reinscripcion/mi-solicitud/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitud_id: solicitud.id, nombre, url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al registrar documento");
      setSuccessMsg(`Documento "${nombre}" subido correctamente`);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchSolicitud();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    }
  }

  // ─── Eliminar documento ───────────────────
  async function eliminarDocumento(docId: string) {
    if (!solicitud) return;
    if (!confirm("¿Eliminar este documento?")) return;
    setError(null);
    try {
      const res = await fetch(
        `/api/reinscripcion/mi-solicitud/documentos?id=${docId}&solicitud_id=${solicitud.id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al eliminar documento");
      await fetchSolicitud();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    }
  }

  // ─── Enviar solicitud ─────────────────────
  async function enviarSolicitud() {
    if (!solicitud) return;
    if (!confirm("¿Enviar solicitud de reinscripción? Una vez enviada no podrás eliminar documentos.")) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reinscripcion/mi-solicitud/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitud_id: solicitud.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al enviar solicitud");
      setSuccessMsg("¡Solicitud enviada correctamente! El administrador la revisará pronto.");
      await fetchSolicitud();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Render guards ────────────────────────
  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>;

  // Si reinscripción no está habilitada
  if (!reinConfig?.habilitada) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Reinscripción no disponible
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            El proceso de reinscripción aún no ha sido habilitado. Consulta con tu administrador.
          </p>
        </div>
      </div>
    );
  }

  // Determinar si puede editar (borrador o en_revision(rechazada con docs))
  const puedeEditar = !solicitud || ["borrador"].includes(solicitud.estado);
  const puedeEnviar = solicitud?.estado === "borrador" && (solicitud.reinscripcion_documentos ?? []).length > 0;
  const puedeSubirDocs = solicitud && ["borrador", "enviada"].includes(solicitud.estado);

  // Calcular si doc requerido ya fue subido
  const docsSubidos = new Set((solicitud?.reinscripcion_documentos ?? []).map(d => d.nombre));

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 px-2 sm:px-0">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reinscripción {cicloEscolar}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Gestiona tu trámite de reinscripción para el siguiente ciclo escolar.
        </p>
      </div>

      {/* ── Info del período ── */}
      {reinConfig && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-1 text-sm text-blue-800 dark:text-blue-200">
          {reinConfig.fechaInicio && (
            <p><strong>Inicio:</strong> {new Date(reinConfig.fechaInicio).toLocaleDateString("es-MX", { dateStyle: "long" })}</p>
          )}
          {reinConfig.fechaCierre && (
            <p><strong>Cierre:</strong> {new Date(reinConfig.fechaCierre).toLocaleDateString("es-MX", { dateStyle: "long" })}</p>
          )}
          {reinConfig.costoReinscripcion != null && reinConfig.costoReinscripcion > 0 && (
            <p><strong>Costo:</strong> ${reinConfig.costoReinscripcion.toFixed(2)} MXN</p>
          )}
          {reinConfig.avisoImportante && (
            <p className="mt-2 text-yellow-700 dark:text-yellow-400 font-medium">⚠️ {reinConfig.avisoImportante}</p>
          )}
        </div>
      )}

      {/* ── Mensajes ── */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg text-sm">
          {successMsg}
        </div>
      )}

      {/* ── Sin solicitud ── */}
      {!solicitud && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
          <svg className="w-14 h-14 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Aún no tienes una solicitud
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Inicia tu trámite de reinscripción para {cicloEscolar}.
          </p>
          <button
            onClick={crearSolicitud}
            disabled={creando}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-60 transition"
          >
            {creando ? "Iniciando..." : "Iniciar trámite"}
          </button>
        </div>
      )}

      {/* ── Con solicitud ── */}
      {solicitud && (
        <>
          {/* Estado */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Estado de tu solicitud</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Última actualización: {new Date(solicitud.updated_at).toLocaleString("es-MX")}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ESTADO_COLOR[solicitud.estado] ?? ""}`}>
              {ESTADO_LABEL[solicitud.estado] ?? solicitud.estado}
            </span>
          </div>

          {/* Notas del admin */}
          {solicitud.notas_admin && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-sm text-amber-800 dark:text-amber-200">
              <strong>Mensaje del administrador:</strong>
              <p className="mt-1">{solicitud.notas_admin}</p>
            </div>
          )}

          {/* Documentos requeridos */}
          {docsRequeridos.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">Documentos requeridos</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {docsSubidos.size} / {docsRequeridos.length} subidos
                </p>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {docsRequeridos.map((nombre) => {
                  const docExistente = solicitud.reinscripcion_documentos.find(d => d.nombre === nombre);
                  return (
                    <div key={nombre} className="px-6 py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{nombre}</span>
                          {docExistente && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DOC_ESTADO_COLOR[docExistente.estado]}`}>
                              {docExistente.estado}
                            </span>
                          )}
                        </div>
                        {docExistente && puedeEditar && (
                          <button
                            onClick={() => eliminarDocumento(docExistente.id)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      {docExistente?.notas && (
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Nota: {docExistente.notas}
                        </p>
                      )}
                      {!docExistente && puedeSubirDocs && (
                        <FileUploadInput
                          currentUrl=""
                          label={`Subir ${nombre}`}
                          bucket="avisos"
                          folder={`reinscripcion/solicitudes/${solicitud.id}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onUploaded={(url) => subirDocumento(nombre, url)}
                        />
                      )}
                      {docExistente && docExistente.estado === "rechazado" && puedeSubirDocs && (
                        <div>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">
                            Este documento fue rechazado. Puedes subir uno nuevo:
                          </p>
                          <FileUploadInput
                            currentUrl=""
                            label={`Resubir ${nombre}`}
                            bucket="avisos"
                            folder={`reinscripcion/solicitudes/${solicitud.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onUploaded={(url) => subirDocumento(nombre, url)}
                          />
                        </div>
                      )}
                      {docExistente && (
                        <a
                          href={docExistente.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Ver documento subido
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Documentos extra (no requeridos) */}
          {puedeSubirDocs && docsRequeridos.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Subir documentos</h2>
              <FileUploadInput
                currentUrl=""
                label="Agregar documento"
                bucket="avisos"
                folder={`reinscripcion/solicitudes/${solicitud.id}`}
                accept=".pdf,.jpg,.jpeg,.png"
                onUploaded={(url) => subirDocumento("Documento", url)}
              />
            </div>
          )}

          {/* Docs subidos (extra) */}
          {solicitud.reinscripcion_documentos.length > 0 && docsRequeridos.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">Documentos subidos</h2>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {solicitud.reinscripcion_documentos.map(doc => (
                  <li key={doc.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{doc.nombre}</p>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                        Ver documento
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DOC_ESTADO_COLOR[doc.estado]}`}>
                        {doc.estado}
                      </span>
                      {puedeEditar && (
                        <button onClick={() => eliminarDocumento(doc.id)}
                          className="text-xs text-red-500 hover:text-red-700">
                          Eliminar
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botón enviar */}
          {puedeEnviar && (
            <div className="flex justify-end">
              <button
                onClick={enviarSolicitud}
                disabled={submitting}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-60 transition"
              >
                {submitting ? "Enviando..." : "Enviar solicitud ✓"}
              </button>
            </div>
          )}

          {/* Estado aprobada/rechazada */}
          {solicitud.estado === "aprobada" && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl text-center">
              <p className="text-green-700 dark:text-green-300 font-semibold text-lg">🎉 ¡Reinscripción aprobada!</p>
              <p className="text-green-600 dark:text-green-400 text-sm mt-1">Tu trámite fue revisado y aprobado por el administrador.</p>
            </div>
          )}
          {solicitud.estado === "rechazada" && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
              <p className="text-red-700 dark:text-red-300 font-semibold">Solicitud rechazada</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                Revisa los documentos marcados en rojo y vuelve a enviar tu solicitud.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
