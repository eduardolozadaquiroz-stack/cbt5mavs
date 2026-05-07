"use client";
import { useState, useRef, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface PerfilData {
  id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  correo: string;
  rol: string;
  telefono: string | null;
  foto_url: string | null;
  created_at: string;
  maestro?: { id: number; especialidad: string | null; clave_empleado: string | null };
}

export default function PerfilMaestroPage() {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [form, setForm] = useState({ nombre: "", telefono: "" });
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/perfil")
      .then((r) => r.json())
      .then((data: PerfilData) => {
        setPerfil(data);
        setForm({ nombre: data.nombre ?? "", telefono: data.telefono ?? "" });
        setImgSrc(data.foto_url ?? null);
      })
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("bucket", "avatars");
      fd.append("file", f);
      const res = await fetch("/api/storage/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al subir foto");
      await fetch("/api/perfil", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ foto_url: json.url }) });
      setImgSrc(json.url);
      setSuccess("Foto actualizada"); setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally { setUploading(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      const res = await fetch("/api/perfil", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: form.nombre, telefono: form.telefono }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al guardar");
      setSuccess("Cambios guardados"); setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally { setSaving(false); }
  }

  const nombreCompleto = [perfil?.nombre, perfil?.apellido_paterno, perfil?.apellido_materno].filter(Boolean).join(" ") || perfil?.nombre || "M";
  const initials = nombreCompleto.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
  const inputBase = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase = "text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-1";

  return (
    <>
      <DashboardTopbar userImageAlt="Maestro" linkBase="/dashboard/maestro" />
      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="inicio" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />
        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[800px] mx-auto p-md lg:p-lg">
            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-background">Mi Perfil</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Información personal y datos de tu cuenta docente.</p>
            </div>

            {loading && <div className="text-sm text-on-surface-variant py-8 text-center">Cargando perfil...</div>}

            {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">✅ {success}</div>}

            {!loading && perfil && (
              <>
                {/* Avatar card */}
                <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-md">
                  <div className="h-28 bg-gradient-to-r from-primary to-secondary" />
                  <div className="px-lg pb-lg flex flex-col sm:flex-row sm:items-end gap-md" style={{ marginTop: "-2.5rem" }}>
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                        {imgSrc ? <img src={imgSrc} alt="Foto" className="w-full h-full object-cover" /> : initials}
                      </div>
                      <button onClick={() => fileRef.current?.click()} disabled={uploading} className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow border-2 border-white hover:bg-primary/90 transition-colors disabled:opacity-50" title="Cambiar foto">
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>photo_camera</span>
                      </button>
                      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
                    </div>
                    <div className="pb-2 pt-10 sm:pt-0">
                      <h3 className="font-title-sm text-title-sm text-on-surface">{nombreCompleto}</h3>
                      <p className="text-xs text-on-surface-variant">{perfil.correo}{perfil.maestro?.clave_empleado ? ` · ${perfil.maestro.clave_empleado}` : ""}</p>
                    </div>
                  </div>
                </div>

                {/* Formulario edición */}
                <form onSubmit={handleSave} className="bg-white border border-outline-variant rounded-xl shadow-sm p-md mb-md">
                  <h3 className="font-title-sm text-title-sm text-on-surface mb-md">Editar datos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelBase}>Nombre completo</label>
                      <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className={inputBase} required />
                    </div>
                    <div>
                      <label className={labelBase}>Correo institucional</label>
                      <input value={perfil.correo} readOnly className={`${inputBase} opacity-60 cursor-not-allowed`} />
                    </div>
                    <div>
                      <label className={labelBase}>Teléfono</label>
                      <input type="tel" value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} className={inputBase} placeholder="55 1234 5678" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">{saving ? "Guardando..." : "Guardar cambios"}</button>
                  </div>
                </form>

                {/* Info de cuenta */}
                <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                  <div className="p-md border-b border-outline-variant bg-surface-bright">
                    <h3 className="font-title-sm text-title-sm text-on-surface">Datos de cuenta</h3>
                  </div>
                  <div className="divide-y divide-outline-variant">
                    {[
                      { label: "Correo", value: perfil.correo },
                      { label: "Rol", value: perfil.rol },
                      { label: "No. empleado", value: perfil.maestro?.clave_empleado ?? "—" },
                      { label: "Especialidad", value: perfil.maestro?.especialidad ?? "—" },
                      { label: "Miembro desde", value: new Date(perfil.created_at).toLocaleDateString("es-MX") },
                    ].map((row) => (
                      <div key={row.label} className="flex flex-col sm:flex-row sm:items-center px-md py-sm gap-1 sm:gap-0">
                        <span className="text-xs text-on-surface-variant font-medium sm:w-48 flex-shrink-0">{row.label}</span>
                        <span className="text-sm text-on-surface capitalize">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
