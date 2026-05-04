"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";

const BASE = "/dashboard/administrador";

function BarraFuerza({ pw }: { pw: string }) {
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Débil", "Regular", "Fuerte", "Muy fuerte"];
  const colors = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-green-500"];
  if (!pw) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? colors[score] : "bg-slate-200 dark:bg-slate-700"}`} />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${["", "text-red-500", "text-amber-500", "text-blue-600", "text-green-600"][score]}`}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function ContrasenaPage() {
  const [form, setForm] = useState({ actual: "", nueva: "", confirmar: "" });
  const [showAct, setShowAct] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); setError(""); setOk(false); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.actual) { setError("Ingresa tu contraseña actual."); return; }
    if (form.nueva.length < 8) { setError("La nueva contraseña debe tener al menos 8 caracteres."); return; }
    if (!/[A-Z]/.test(form.nueva) || !/[0-9]/.test(form.nueva)) {
      setError("La nueva contraseña debe tener al menos una mayúscula y un número."); return;
    }
    if (form.nueva !== form.confirmar) { setError("Las contraseñas no coinciden."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/perfil/cambiar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.actual,
          newPassword:     form.nueva,
          confirmPassword: form.confirmar,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "No se pudo actualizar la contraseña.");
        return;
      }
      setOk(true);
      setForm({ actual: "", nueva: "", confirmar: "" });
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  const inputBase =
    "w-full px-3 py-2 pr-10 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

  function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
    return (
      <button type="button" onClick={onToggle} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          {show
            ? <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            : <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17C11.04 6.89 11.5 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55a2.821 2.821 0 0 0 3.57 3.57l1.55 1.55A4.977 4.977 0 0 1 12 17c-2.76 0-5-2.24-5-5 0-.61.11-1.19.3-1.73l.23.53z"/>
          }
        </svg>
      </button>
    );
  }

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora"
        activeTopLink="perfil" showSearch linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[600px] mx-auto w-full">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
            <Link href={`${BASE}/perfil`} className="hover:text-blue-700 transition-colors">Mi perfil</Link>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Cambiar contraseña</span>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Cambiar contraseña</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Por seguridad usa una contraseña única y difícil de adivinar</p>
          </div>

          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5 flex flex-col gap-4">

            {/* Contraseña actual */}
            <div>
              <label className={labelBase}>Contraseña actual</label>
              <div className="relative">
                <input type={showAct ? "text" : "password"} value={form.actual} onChange={(e) => set("actual", e.target.value)} className={inputBase} placeholder="••••••••" autoComplete="current-password" />
                <EyeToggle show={showAct} onToggle={() => setShowAct((s) => !s)} />
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <label className={labelBase}>Nueva contraseña</label>
              <div className="relative">
                <input type={showNew ? "text" : "password"} value={form.nueva} onChange={(e) => set("nueva", e.target.value)} className={inputBase} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
                <EyeToggle show={showNew} onToggle={() => setShowNew((s) => !s)} />
              </div>
              <BarraFuerza pw={form.nueva} />
            </div>

            {/* Confirmar */}
            <div>
              <label className={labelBase}>Confirmar nueva contraseña</label>
              <div className="relative">
                <input type={showCon ? "text" : "password"} value={form.confirmar} onChange={(e) => set("confirmar", e.target.value)} className={inputBase} placeholder="Repite la nueva contraseña" autoComplete="new-password" />
                <EyeToggle show={showCon} onToggle={() => setShowCon((s) => !s)} />
              </div>
              {form.confirmar && form.confirmar !== form.nueva && (
                <p className="text-[11px] text-red-500 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            {/* Requisitos */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-xs text-slate-500 flex flex-col gap-1">
              {[
                { ok: form.nueva.length >= 8,          label: "Mínimo 8 caracteres" },
                { ok: /[A-Z]/.test(form.nueva),        label: "Al menos una mayúscula" },
                { ok: /[0-9]/.test(form.nueva),        label: "Al menos un número" },
                { ok: /[^A-Za-z0-9]/.test(form.nueva), label: "Al menos un carácter especial" },
              ].map(({ ok: met, label }) => (
                <span key={label} className={`flex items-center gap-1.5 ${met ? "text-green-600" : "text-slate-400"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                    {met ? <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/> : <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z"/>}
                  </svg>
                  {label}
                </span>
              ))}
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}
            {ok && (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                Contraseña actualizada correctamente
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <Link href={`${BASE}/perfil`} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center">
                Cancelar
              </Link>
              <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-60">
                {saving ? "Actualizando…" : "Actualizar contraseña"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
