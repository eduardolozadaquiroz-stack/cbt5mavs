"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

type Rol = "Todos" | "Alumno" | "Maestro" | "Admin";
type RolNuevo = "Alumno" | "Maestro" | "Admin";

interface ApiUsuario {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  telefono: string | null;
  activo: boolean;
  created_at: string;
}

const rolColors: Record<string, string> = {
  alumno:  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  maestro: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  admin:   "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  padres:  "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200",
  Alumno:  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  Maestro: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  Admin:   "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
};

function checkPw(p: string) {
  return {
    length:  p.length >= 8,
    upper:   /[A-Z]/.test(p),
    lower:   /[a-z]/.test(p),
    special: /[^A-Za-z0-9]/.test(p),
  };
}

const REQUISITOS: [keyof ReturnType<typeof checkPw>, string][] = [
  ["length",  "Mínimo 8 caracteres"],
  ["upper",   "Una mayúscula (A-Z)"],
  ["lower",   "Una minúscula (a-z)"],
  ["special", "Un carácter especial (!@#$...)"],
];

// ─── Modal Nuevo Usuario ──────────────────────────────────────────────────────
function NuevoUsuarioModal({ onClose, onCreated }: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [step, setStep] = useState<"form" | "verify" | "saving">("form");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", rol: "Alumno" as RolNuevo, pw: "", pw2: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingEmail, setPendingEmail] = useState("");

  const pw = form.pw;
  const checks = checkPw(pw);
  const allPwOk = Object.values(checks).every(Boolean);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Ingresa un correo válido.";
    if (!allPwOk) e.pw = "La contraseña no cumple los requisitos.";
    if (form.pw !== form.pw2) e.pw2 = "Las contraseñas no coinciden.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setPendingEmail(form.email);
    setStep("verify");
  }

  async function handleConfirmVerification() {
    setStep("saving");
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre:   form.nombre,
          correo:   form.email,
          rol:      form.rol.toLowerCase(),
          password: form.pw,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors({ email: (data as { error?: string }).error ?? "Error al crear usuario." });
        setStep("form");
        return;
      }
      onCreated();
      onClose();
    } catch {
      setErrors({ email: "Error de conexión. Intenta de nuevo." });
      setStep("form");
    }
  }

  const inputBase = "w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-sm text-on-surface focus:outline-none focus:ring-1 transition-colors";
  const inputOk   = "border-outline-variant focus:border-primary focus:ring-primary";
  const inputErr  = "border-red-400 focus:border-red-500 focus:ring-red-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-outline-variant overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="font-semibold text-on-surface text-base">
            {step === "form" ? "Nuevo Usuario" : step === "saving" ? "Guardando…" : "Verificar Correo Electrónico"}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* ── STEP 1: Formulario ─────────────────────────────── */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">

            {/* Nombre */}
            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1 block">Nombre completo</label>
              <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Apellido Apellido, Nombre" className={`${inputBase} ${errors.nombre ? inputErr : inputOk}`} />
              {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
            </div>

            {/* Rol */}
            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1 block">Rol</label>
              <select value={form.rol} onChange={(e) => set("rol", e.target.value)} className={`${inputBase} ${inputOk}`}>
                <option value="Alumno">Alumno</option>
                <option value="Maestro">Maestro</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Correo */}
            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1 block">Correo electrónico institucional</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="usuario@cbt5.edu.mx" className={`${inputBase} ${errors.email ? inputErr : inputOk}`} />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              <p className="text-xs text-on-surface-variant mt-1">Se enviará un correo de verificación a esta dirección.</p>
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Contraseña</label>
                <button
                  type="button"
                  onClick={() => {
                    const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
                    const req = [
                      "ABCDEFGHJKLMNPQRSTUVWXYZ",
                      "abcdefghijkmnpqrstuvwxyz",
                      "23456789",
                      "!@#$%&*",
                    ];
                    let pw = req.map((r) => r[Math.floor(Math.random() * r.length)]).join("");
                    for (let i = pw.length; i < 12; i++) pw += chars[Math.floor(Math.random() * chars.length)];
                    pw = pw.split("").sort(() => Math.random() - 0.5).join("");
                    set("pw", pw);
                    set("pw2", pw);
                    setShowPw(true);
                    setShowPw2(true);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5zm-1 5v2h2v-2h-2zm0-4v3h2V6h-2z"/>
                  </svg>
                  Generar contraseña
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.pw}
                  onChange={(e) => set("pw", e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={`${inputBase} pr-9 ${errors.pw ? inputErr : pw.length > 0 && allPwOk ? "border-green-500 focus:border-green-500 focus:ring-green-300" : pw.length > 0 ? "border-amber-400 focus:border-amber-400 focus:ring-amber-300" : inputOk}`}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    {showPw
                      ? <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      : <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    }
                  </svg>
                </button>
              </div>

              {/* Requisitos */}
              {pw.length > 0 && (
                <div className="mt-2 rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-2">
                  <p className="text-[11px] font-semibold text-on-surface-variant mb-1.5">Requisitos de contraseña segura:</p>
                  <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {REQUISITOS.map(([key, label]) => (
                      <li key={key} className={`flex items-center gap-1 text-[11px] ${checks[key] ? "text-green-700 dark:text-green-400" : "text-on-surface-variant"}`}>
                        {checks[key]
                          ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 flex-shrink-0"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                          : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 flex-shrink-0 text-outline-variant"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                        }
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {errors.pw && <p className="text-xs text-red-600 mt-1">{errors.pw}</p>}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1 block">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showPw2 ? "text" : "password"}
                  value={form.pw2}
                  onChange={(e) => set("pw2", e.target.value)}
                  placeholder="Repite la contraseña"
                  className={`${inputBase} pr-9 ${errors.pw2 ? inputErr : form.pw2.length > 0 && form.pw === form.pw2 ? "border-green-500 focus:border-green-500 focus:ring-green-300" : inputOk}`}
                />
                <button type="button" onClick={() => setShowPw2((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    {showPw2
                      ? <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      : <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    }
                  </svg>
                </button>
              </div>
              {form.pw2.length > 0 && form.pw === form.pw2 && (
                <p className="text-xs text-green-700 dark:text-green-400 mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Las contraseñas coinciden
                </p>
              )}
              {errors.pw2 && <p className="text-xs text-red-600 mt-1">{errors.pw2}</p>}
            </div>

            {/* Banner contraseña generada */}
            {form.pw.length > 0 && form.pw === form.pw2 && allPwOk && (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600 flex-shrink-0">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold">Contraseña lista</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-mono truncate">{form.pw}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(form.pw)}
                  title="Copiar contraseña"
                  className="flex-shrink-0 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-blue-600 dark:text-blue-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-3 pt-1 border-t border-outline-variant mt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors">
                Cancelar
              </button>
              <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-colors">
                Crear usuario
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: Verificación enviada ───────────────────── */}
        {step === "verify" && (
          <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-700 dark:text-blue-300">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-on-surface text-base">Correo de verificación enviado</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Se envió un enlace de verificación a:
              </p>
              <p className="text-sm font-semibold text-primary mt-0.5 break-all">{pendingEmail}</p>
            </div>
            <div className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 text-left text-sm text-amber-800 dark:text-amber-200">
              <p className="font-semibold mb-1">⚠ Cuenta pendiente de activación</p>
              <p>El usuario aparecerá como <strong>Inactivo</strong> hasta que verifique su correo y confirme su contraseña haciendo clic en el enlace enviado.</p>
            </div>
            <ul className="w-full text-left space-y-1.5 text-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                El enlace expira en <strong>24 horas</strong>.
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                Si no llega, revisar la carpeta de <strong>Spam</strong> o <strong>Correo no deseado</strong>.
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                El admin puede reenviar el correo desde esta lista.
              </li>
            </ul>
            <div className="flex gap-3 w-full pt-2 border-t border-outline-variant">
              <button type="button" onClick={onClose} disabled={step === "saving"} className="flex-1 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50">
                Cerrar
              </button>
              <button type="button" onClick={handleConfirmVerification} disabled={step === "saving"} className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
                {step === "saving" ? "Guardando…" : "Entendido, agregar usuario"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Modal Editar Usuario ────────────────────────────────────────────────────
function ModalEditarUsuario({ usuario, onClose, onSaved }: {
  usuario: ApiUsuario;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ nombre: usuario.nombre, rol: usuario.rol, activo: usuario.activo });
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  async function handleSave() {
    setSaving(true);
    setApiError("");
    try {
      const res = await fetch(`/api/admin/usuarios/${usuario.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, rol: form.rol, activo: form.activo }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setApiError((d as { error?: string }).error ?? "Error al guardar.");
        setSaving(false);
        return;
      }
      onSaved();
      onClose();
    } catch {
      setApiError("Error de conexión. Intenta de nuevo.");
      setSaving(false);
    }
  }

  const inputBase = "w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-sm text-on-surface focus:outline-none focus:ring-1 border-outline-variant focus:border-primary focus:ring-primary transition-colors";
  const labelBase = "text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-outline-variant overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="font-semibold text-on-surface text-base">Editar usuario</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={labelBase}>Nombre completo</label>
            <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className={labelBase}>Correo electrónico</label>
            <input type="email" value={usuario.correo} disabled className={`${inputBase} opacity-60 cursor-not-allowed`} />
            <p className="text-xs text-on-surface-variant mt-1">El correo no se puede cambiar desde aquí.</p>
          </div>
          <div>
            <label className={labelBase}>Rol</label>
            <select value={form.rol} onChange={(e) => set("rol", e.target.value)} className={inputBase}>
              <option value="alumno">Alumno</option>
              <option value="maestro">Maestro</option>
              <option value="admin">Admin</option>
              <option value="padres">Padres</option>
            </select>
          </div>
          {apiError && <p className="text-xs text-red-600">{apiError}</p>}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set("activo", !form.activo)}
              className={`relative w-9 h-5 rounded-full transition-colors ${form.activo ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.activo ? "translate-x-4" : "translate-x-0"}`} />
            </div>
            <span className="text-sm text-on-surface-variant">Cuenta activa</span>
          </label>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose} disabled={saving} className="flex-1 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">{saving ? "Guardando…" : "Guardar cambios"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function UsuariosPage() {
  const [query, setQuery] = useState("");
  const [filtroRol, setFiltroRol] = useState<Rol>("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<ApiUsuario | null>(null);
  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  async function cargarUsuarios() {
    setLoading(true);
    setApiError("");
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (filtroRol !== "Todos") params.set("rol", filtroRol.toLowerCase());
      if (query) params.set("search", query);
      const res = await fetch(`/api/admin/usuarios?${params}`);
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json() as { usuarios: ApiUsuario[]; total: number };
      setUsuarios(data.usuarios ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setApiError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargarUsuarios(); }, [filtroRol]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtrados = usuarios.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" activeTopLink="usuarios" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="usuarios" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Usuarios del Sistema</h2>
              <p className="text-on-surface-variant mt-1">Administra cuentas de alumnos, maestros y administradores.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Nuevo Usuario
            </button>
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full sm:w-72">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && cargarUsuarios()}
                  placeholder="Buscar por nombre o correo..."
                  className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded bg-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["Todos", "Alumno", "Maestro", "Admin"] as Rol[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setFiltroRol(r)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                      filtroRol === r
                        ? "bg-primary text-on-primary border-primary"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              {apiError && (
                <p className="text-sm text-red-600 p-4">{apiError}</p>
              )}
              {loading ? (
                <p className="text-sm text-on-surface-variant p-8 text-center">Cargando usuarios…</p>
              ) : (
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="bg-surface-variant">
                  <tr>
                    {["Nombre", "Rol", "Correo", "Estado", "Acciones"].map((h, i) => (
                      <th key={h} className={`p-2 px-4 border-b border-outline-variant text-on-surface-variant uppercase tracking-wider text-xs font-semibold ${i === 4 ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-on-surface-variant text-sm">
                        Sin resultados
                      </td>
                    </tr>
                  ) : filtrados.map((u) => (
                    <tr key={u.id} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors">
                      <td className="p-2 px-4 border-b border-outline-variant font-medium text-on-surface">{u.nombre}</td>
                      <td className="p-2 px-4 border-b border-outline-variant">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${rolColors[u.rol] ?? ""}`}>{u.rol}</span>
                      </td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{u.correo}</td>
                      <td className="p-2 px-4 border-b border-outline-variant">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${u.activo ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200" : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"}`}>
                          {!u.activo && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                          )}
                          {u.activo ? "Activo" : "Pendiente verificación"}
                        </span>
                      </td>
                      <td className="p-2 px-4 border-b border-outline-variant text-right">
                        <button
                          onClick={() => setEditando(u)}
                          className="text-on-surface-variant hover:text-primary p-1 rounded" title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>

            <div className="p-3 px-4 border-t border-outline-variant text-sm text-on-surface-variant">
              Mostrando {filtrados.length} de {total} usuarios
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <NuevoUsuarioModal
          onClose={() => setShowModal(false)}
          onCreated={() => { cargarUsuarios(); }}
        />
      )}

      {editando && (
        <ModalEditarUsuario
          usuario={editando}
          onClose={() => setEditando(null)}
          onSaved={() => { cargarUsuarios(); setEditando(null); }}
        />
      )}
    </>
  );
}
