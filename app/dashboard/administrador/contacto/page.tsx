"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

interface ContactoForm {
  email: string;
  telefono: string;
  telefono2: string;
  direccion: string;
  horarioAtencion: string;
  mapaCoordenadas: string;
  redesSociales: {
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
}

const DEFAULT_FORM: ContactoForm = {
  email: "",
  telefono: "",
  telefono2: "",
  direccion: "",
  horarioAtencion: "",
  mapaCoordenadas: "",
  redesSociales: { facebook: "", instagram: "", whatsapp: "" },
};

function buildMapUrl(coords: string): string | null {
  const parts = coords.split(",").map((s) => s.trim());
  if (parts.length !== 2) return null;
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return `https://maps.google.com/maps?q=${lat},${lng}&output=embed&z=16`;
}

export default function ContactoEditPage() {
  const [form, setForm] = useState<ContactoForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const mapUrl = buildMapUrl(form.mapaCoordenadas);

  // Carga la config actual del servidor
  const loadConfig = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/config");
      const d = await r.json();
      const contacto = d.config?.contacto as ContactoForm | undefined;
      if (contacto) {
        setForm({
          email:           contacto.email           ?? "",
          telefono:        contacto.telefono        ?? "",
          telefono2:       contacto.telefono2       ?? "",
          direccion:       contacto.direccion       ?? "",
          horarioAtencion: contacto.horarioAtencion ?? "",
          mapaCoordenadas: contacto.mapaCoordenadas ?? "",
          redesSociales: {
            facebook:  contacto.redesSociales?.facebook  ?? "",
            instagram: contacto.redesSociales?.instagram ?? "",
            whatsapp:  contacto.redesSociales?.whatsapp  ?? "",
          },
        });
      }
    } catch { /* silently ignore on first load */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  function set(k: string, v: string) {
    setForm((f) => {
      if (k.startsWith("redes_")) {
        const redName = k.replace("redes_", "");
        return { ...f, redesSociales: { ...f.redesSociales, [redName]: v } };
      }
      return { ...f, [k]: v };
    });
    setSaved(false);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Lee la config completa primero para no pisar otras secciones
      const getR = await fetch("/api/admin/config");
      const getD = await getR.json();
      const currentConfig = (getD.config ?? {}) as Record<string, unknown>;

      const r = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: { ...currentConfig, contacto: form },
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Error al guardar");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  const inputBase =
    "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase =
    "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

  if (loading) {
    return (
      <>
        <DashboardTopbar userImageAlt="Administrador" activeTopLink="dashboard" showSearch linkBase={BASE} />
        <div className="flex pt-14">
          <DashboardSidebar activeLink="contacto" headerVariant="school-icon" linkBase={BASE} />
          <main className="flex-1 md:ml-64 p-8 text-center text-slate-400">Cargando configuración...</main>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador"
        activeTopLink="dashboard"
        showSearch
        linkBase={BASE}
      />

      <div className="flex pt-14">
        <DashboardSidebar activeLink="contacto" headerVariant="school-icon" linkBase={BASE} />

        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Editar Sección: Contacto
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestiona la información de contacto de la institución
            </p>
          </div>

          {saved && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200 text-sm">
              ✅ Cambios guardados exitosamente
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Contacto directo */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">📞 Contacto Directo</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Email principal</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>Teléfono 1</label>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => set("telefono", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Teléfono 2</label>
                    <input
                      type="tel"
                      value={form.telefono2}
                      onChange={(e) => set("telefono2", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">📍 Ubicación</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Dirección</label>
                  <input
                    type="text"
                    value={form.direccion}
                    onChange={(e) => set("direccion", e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Horario de atención</label>
                  <input
                    type="text"
                    value={form.horarioAtencion}
                    onChange={(e) => set("horarioAtencion", e.target.value)}
                    placeholder="Ej: Lunes a Viernes 8:00 - 17:00"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Coordenadas del mapa (latitud, longitud)</label>
                  <input
                    type="text"
                    value={form.mapaCoordenadas}
                    onChange={(e) => set("mapaCoordenadas", e.target.value)}
                    placeholder="-98.7598, 19.2580"
                    className={inputBase}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Usa Google Maps → clic derecho sobre la ubicación → copiar coordenadas
                  </p>
                </div>

                {/* Vista previa del mapa */}
                {mapUrl ? (
                  <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 h-56">
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                      title="Vista previa del mapa"
                    />
                  </div>
                ) : form.mapaCoordenadas ? (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Formato inválido. Usa: latitud, longitud (ej. 19.2580, -98.7598)
                  </p>
                ) : null}
              </div>
            </div>

            {/* Redes sociales */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">🔗 Redes Sociales</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Facebook</label>
                  <input
                    type="url"
                    value={form.redesSociales.facebook}
                    onChange={(e) => set("redes_facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Instagram</label>
                  <input
                    type="url"
                    value={form.redesSociales.instagram}
                    onChange={(e) => set("redes_instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>WhatsApp</label>
                  <input
                    type="url"
                    value={form.redesSociales.whatsapp}
                    onChange={(e) => set("redes_whatsapp", e.target.value)}
                    placeholder="https://wa.me/..."
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : "💾 Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={loadConfig}
                className="px-6 py-2 border border-outline text-on-surface rounded-lg hover:bg-surface-variant font-medium transition-colors"
              >
                ↩ Descartar cambios
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
