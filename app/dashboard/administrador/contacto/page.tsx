"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

export default function ContactoEditPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    email: "contacto@cbt5.edu.mx",
    telefono: "(55) 5742-1234",
    telefono2: "(55) 5742-5678",
    direccion: "Av. México 123, Chalco, Estado de México",
    horarioAtencion: "Lunes a Viernes 7:00 - 17:00 hrs",
    mapaCoordenadas: "-98.7598, 19.2580",
    redesSociales: {
      facebook: "https://facebook.com/cbt5",
      instagram: "https://instagram.com/cbt5",
      whatsapp: "https://wa.me/5557421234",
    },
  });

  function set(k: string, v: string) {
    setForm((f) => {
      if (k.includes("redes_")) {
        const redName = k.replace("redes_", "");
        return {
          ...f,
          redesSociales: { ...f.redesSociales, [redName]: v },
        };
      }
      return { ...f, [k]: v };
    });
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputBase =
    "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador"
        userName="Mtra. Viderique"
        userRole="Administradora"
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

          <form onSubmit={handleSave} className="space-y-6">
            {/* Contacto directo */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                📞 Contacto Directo
              </h3>
              
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                📍 Ubicación
              </h3>
              
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
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                🔗 Redes Sociales
              </h3>
              
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
                className="px-6 py-2 border border-outline text-on-surface rounded-lg hover:bg-surface-variant font-medium transition-colors"
              >
                📋 Vista previa
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
