"use client";

import { useRef, useState } from "react";

interface FileUploadInputProps {
  /** URL actual guardada (se muestra como preview si hay archivo) */
  currentUrl: string;
  /** Tipos aceptados para el input file, ej: ".pdf,.jpg,.png" */
  accept?: string;
  /** Etiqueta descriptiva */
  label?: string;
  /** Bucket de Supabase Storage donde se sube */
  bucket?: string;
  /** Sub-ruta dentro del bucket, ej: "reinscripcion/formatos" */
  folder?: string;
  /** Máx. bytes permitidos antes de enviar (validación front) */
  maxBytes?: number;
  /** Se llama con la URL pública del archivo subido */
  onUploaded: (url: string) => void;
}

export default function FileUploadInput({
  currentUrl,
  accept = ".pdf,.jpg,.jpeg,.png",
  label = "Subir archivo",
  bucket = "documentos",
  folder = "reinscripcion",
  maxBytes = 10 * 1024 * 1024,
  onUploaded,
}: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localName, setLocalName] = useState<string | null>(null);

  const isPdf = (url: string) => url.toLowerCase().endsWith(".pdf");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > maxBytes) {
      setError(`El archivo supera el límite de ${Math.round(maxBytes / 1024 / 1024)} MB`);
      e.target.value = "";
      return;
    }

    const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError("Solo se permiten PDF, JPG o PNG.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setLocalName(file.name);

    try {
      const formData = new FormData();
      formData.append("bucket", bucket);
      formData.append("folder", folder);
      formData.append("file", file);

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const debugInfo = (data as Record<string,unknown>).debug_rol
          ? ` (rol:${(data as Record<string,unknown>).debug_rol})`
          : "";
        throw new Error((data.error ?? "Error al subir el archivo") + debugInfo);
      }

      onUploaded(data.url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLocalName(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {/* Preview del archivo actual */}
      {currentUrl && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          {isPdf(currentUrl) ? (
            <svg className="w-8 h-8 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5z"/>
            </svg>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="preview" className="w-12 h-12 object-cover rounded" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
              {localName ?? decodeURIComponent(currentUrl.split("/").pop() ?? "Archivo guardado")}
            </p>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Ver archivo ↗
            </a>
          </div>
          <button
            type="button"
            onClick={() => { onUploaded(""); setLocalName(null); }}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Botón de upload */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Subiendo…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {label}
            </>
          )}
        </button>
        <span className="text-xs text-slate-400">PDF, JPG o PNG · máx 10 MB</span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
