"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase manda el token en el hash del URL al hacer click en el enlace de email.
  // Necesitamos intercambiar ese token por una sesión antes de permitir el cambio.
  useEffect(() => {
    const hash = window.location.hash;
    // Supabase envía: #access_token=xxx&type=recovery&...
    if (hash.includes("access_token") && hash.includes("type=recovery")) {
      // El cliente de Supabase (browser) procesa el hash automáticamente al importarlo
      import("@/lib/supabase-browser").then(({ createBrowserClient }) => {
        const client = createBrowserClient();
        // escuchar el evento de sesión
        const { data: { subscription } } = client.auth.onAuthStateChange((event) => {
          if (event === "PASSWORD_RECOVERY") {
            setSessionReady(true);
          }
        });
        return () => subscription.unsubscribe();
      });
    } else {
      // token_hash en query params (desde el API verify-email redirigido)
      setSessionReady(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      setError("La contraseña debe tener mínimo 8 caracteres, con al menos una letra y un número.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, confirmPassword: confirm }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Error al actualizar la contraseña.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center px-10 py-10">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">¡Contraseña actualizada!</h2>
        <p className="text-on-surface-variant text-sm">Serás redirigido al inicio de sesión en unos momentos.</p>
        <Link href="/login" className="mt-4 inline-block text-primary hover:underline text-sm">
          Ir al login →
        </Link>
      </div>
    );
  }

  return (
    <div className="px-10 pb-10 pt-6">
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
      </div>
      <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Nueva contraseña</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
        Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres, una letra y un número.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-label-bold text-label-bold text-on-surface text-sm">
            Nueva contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            autoComplete="new-password"
            required
            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirm" className="font-label-bold text-label-bold text-on-surface text-sm">
            Confirmar contraseña
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError(""); }}
            autoComplete="new-password"
            required
            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !sessionReady}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all mt-2"
        >
          {loading ? "Guardando..." : "Guardar nueva contraseña"}
        </button>
      </form>

      <Link href="/login" className="mt-4 text-center text-sm text-primary hover:underline block">
        ← Volver al login
      </Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-container-low font-public-sans">
      <div className="mb-6 flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Logo CBT Núm. 5" className="w-16 h-16 object-contain mb-2" />
        <h2 className="font-title-sm text-title-sm text-primary tracking-tight">CBT Núm. 5 Chalco</h2>
      </div>

      <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
        <Suspense fallback={<div className="p-10 text-center text-sm text-on-surface-variant">Cargando...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
