"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import SavedToast from "@/components/SavedToast";
import { useAdminConfig, ContactoConfig } from "@/app/context/AdminConfigContext";

const BASE = "/dashboard/administrador";

export default function ContactoEditPage() {
  const { config, updateContacto } = useAdminConfig();
  const [form, setForm] = useState<ContactoConfig>(config.contacto);
  const [saved, setSaved] = useState(false);

  // Sincronizar cuando el contexto cargue datos desde la API
  useEffect(() => {
    setForm(config.contacto);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.contacto.email]); // re-sincronizar en la carga inicial

  function set(k: string, v: string) {
    setForm((f) => {
      if (k.startsWith("redes_")) {
        const redName = k.replace("redes_", "");
        return { ...f, redesSociales: { ...f.redesSociales, [redName]: v } };
      }
      return { ...f, [k]: v };
    });
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateContacto(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleDiscard() {
    setForm(config.contacto);
    setSaved(false);
  }

  const inputBase =
    "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase =
    "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador"
        activeTopLink="edicion"
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

          <SavedToast visible={saved} />

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

                {/* Horarios por turno */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>Horario Turno Matutino</label>
                    <input
                      type="text"
                      value={form.horarioMatutino}
                      onChange={(e) => set("horarioMatutino", e.target.value)}
                      placeholder="07:00 AM – 01:00 PM"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Horario Turno Vespertino</label>
                    <input
                      type="text"
                      value={form.horarioVespertino}
                      onChange={(e) => set("horarioVespertino", e.target.value)}
                      placeholder="01:00 PM – 07:00 PM"
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* URL embed del mapa */}
                <div>
                  <label className={labelBase}>URL de embed de Google Maps</label>
                  <input
                    type="url"
                    value={form.mapaUrl}
                    onChange={(e) => set("mapaUrl", e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className={inputBase}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    En Google Maps: busca la ubicación → Compartir → Incorporar un mapa → copia la URL del atributo <code>src</code> del iframe.
                  </p>
                </div>

                {/* Vista previa del mapa */}
                {form.mapaUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 h-56">
                    <iframe
                      src={form.mapaUrl}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                      title="Vista previa del mapa"
                    />
                  </div>
                )}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                💾 Guardar cambios
              </button>
              <button
                type="button"
                onClick={handleDiscard}
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
