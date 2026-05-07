"use client";

import { useState, useRef, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";

const BASE = "/dashboard/administrador";

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
  maestro?: { especialidad?: string | null } | null;
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", cargo: "", especialidad: "" });
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/perfil")
      .then((r) => r.json())
      .then((data: PerfilData) => {
        setPerfil(data);
        const rolLabel: Record<string, string> = { admin: "Administrador/a", maestro: "Maestro/a", alumno: "Alumno", padres: "Padre/Tutor" };
        setForm({
          nombre: data.nombre ?? "",
          telefono: data.telefono ?? "",
          cargo: rolLabel[data.rol] ?? data.rol,
          especialidad: data.maestro?.especialidad ?? "",
        });
        setImgSrc(data.foto_url ?? null);
      })
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoading(false));
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    setUploadingPhoto(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("bucket", "avatars");
      fd.append("file", f);

      const res = await fetch("/api/storage/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al subir foto");

      // Guardar URL en perfil
      const patchRes = await fetch("/api/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto_url: json.url }),
      });
      if (!patchRes.ok) throw new Error("Error al guardar foto");

      setImgSrc(json.url);
      setSuccess("Foto actualizada");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir foto");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, telefono: form.telefono }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al guardar");
      setSuccess("Cambios guardados");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const nombreCompleto = [perfil?.nombre, perfil?.apellido_paterno, perfil?.apellido_materno].filter(Boolean).join(" ") || perfil?.nombre || "U";
  const initials = nombreCompleto
    .split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

  const inputBase =
    "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora"
        activeTopLink="perfil" showSearch linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mi perfil</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Información personal y datos de la cuenta</p>
          </div>

          {loading && (
            <div className="text-sm text-slate-500 py-8 text-center">Cargando perfil...</div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Avatar */}
              <div className="md:col-span-1">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5 flex flex-col items-center gap-3">
                  {imgSrc ? (
                    <img src={imgSrc} alt="Foto de perfil" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold select-none">
                      {initials}
                    </div>
                  )}
                  <div className="text-center">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{nombreCompleto}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">{perfil?.rol}</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                    </svg>
                    {uploadingPhoto ? "Subiendo..." : "Cambiar foto"}
                  </button>
                  <div className="w-full border-t border-slate-100 dark:border-slate-700 pt-3">
                    <Link
                      href={`${BASE}/perfil/contrasena`}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-400">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                      Cambiar contraseña
                    </Link>
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <div className="md:col-span-2 flex flex-col gap-4">

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200 text-sm">
                    ✅ {success}
                  </div>
                )}

                <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-4">Datos personales</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelBase}>Nombre completo</label>
                      <input
                        value={form.nombre}
                        onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                        className={inputBase}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Correo institucional</label>
                      <input
                        type="email"
                        value={perfil?.correo ?? ""}
                        readOnly
                        className={`${inputBase} opacity-60 cursor-not-allowed`}
                        title="El correo no se puede cambiar desde aquí"
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Teléfono</label>
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                        className={inputBase}
                        placeholder="55 1234 5678"
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Cargo</label>
                      <input
                        value={form.cargo}
                        readOnly
                        className={`${inputBase} opacity-60 cursor-not-allowed`}
                        title="El cargo se deriva del rol asignado"
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Carrera / Especialidad</label>
                      <input
                        value={form.especialidad}
                        onChange={(e) => setForm((f) => ({ ...f, especialidad: e.target.value }))}
                        className={inputBase}
                        placeholder="Ej. Administración Educativa"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>

                {/* Info de sesión */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-3">Información de sesión</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    {[
                      { label: "Rol",            val: perfil?.rol ?? "—" },
                      { label: "Correo",          val: perfil?.correo ?? "—" },
                      { label: "Miembro desde",   val: perfil?.created_at ? new Date(perfil.created_at).toLocaleDateString("es-MX") : "—" },
                      { label: "Ciclo activo",    val: "2025-2026" },
                      { label: "Institución",     val: "CBT Núm. 5, Chalco" },
                      { label: "Sistema",         val: "v1.0.0" },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5">
                        <p className="text-slate-400 mb-0.5">{label}</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

