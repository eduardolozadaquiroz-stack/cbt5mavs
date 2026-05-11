import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Aviso de Privacidad – CBT Núm. 5",
  description:
    "Aviso de privacidad del portal escolar del Centro de Bachillerato Tecnológico Núm. 5, Chalco, conforme a la LFPDPPP.",
};

export default function PrivacidadPage() {
  return (
    <>
      <Navbar activePage="" />

      <main className="flex-grow w-full max-w-[860px] mx-auto px-4 md:px-8 py-16 flex flex-col gap-10">

        {/* Encabezado */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Transparencia institucional
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Aviso de Privacidad
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Última actualización: mayo 2026
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-[15px] leading-relaxed flex flex-col gap-8">

          {/* 1. Responsable */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              1. Responsable del tratamiento de datos personales
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              El <strong>Centro de Bachillerato Tecnológico Núm. 5 «María Amparo Viderique de Shein»</strong>,
              ubicado en Valle de Chalco, Estado de México, es responsable del tratamiento de los datos
              personales que usted nos proporciona, de conformidad con la{" "}
              <em>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</em>.
            </p>
          </section>

          {/* 2. Datos que recabamos */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              2. Datos personales que recabamos
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              A través del portal escolar se recopilan únicamente los datos estrictamente necesarios para
              el funcionamiento del sistema:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 flex flex-col gap-1">
              <li>Nombre completo y matrícula o número de personal</li>
              <li>Correo electrónico institucional o personal</li>
              <li>Datos académicos: calificaciones, asistencias, horarios y reinscripciones</li>
              <li>Contraseña (almacenada de forma cifrada, nunca en texto plano)</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>No recabamos</strong> datos sensibles como información financiera, de salud, religiosa
              o biométrica.
            </p>
          </section>

          {/* 3. Finalidad */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              3. Finalidades del tratamiento
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Sus datos se utilizan exclusivamente para:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 flex flex-col gap-1">
              <li>Autenticar su acceso al portal y mantener su sesión activa</li>
              <li>Mostrar y registrar información académica (calificaciones, asistencias, horarios)</li>
              <li>Gestionar el proceso de reinscripción</li>
              <li>Enviar notificaciones y avisos escolares relevantes</li>
              <li>Recuperar o restablecer su contraseña a través del correo electrónico</li>
            </ul>
          </section>

          {/* 4. Cookies */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              4. Uso de cookies
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Este portal utiliza únicamente <strong>cookies de sesión esenciales</strong> necesarias para
              mantenerlo autenticado mientras navega. Estas cookies:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 flex flex-col gap-1">
              <li>Son de tipo <em>HttpOnly</em> y <em>Secure</em> (no accesibles desde JavaScript)</li>
              <li>Se eliminan al cerrar sesión o al expirar el tiempo de inactividad</li>
              <li>No rastrean su comportamiento fuera del portal</li>
              <li>No se comparten con terceros ni con plataformas de publicidad</li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
              <strong>Por qué no hay banner de cookies:</strong> al tratarse exclusivamente de cookies
              técnicas necesarias, la ley no exige su consentimiento explícito.
            </div>
          </section>

          {/* 5. Transferencia */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              5. Transferencia de datos a terceros
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Sus datos <strong>no son vendidos, cedidos ni transferidos</strong> a terceros con fines
              comerciales. El portal utiliza los siguientes servicios de infraestructura técnica bajo
              acuerdos de confidencialidad:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 flex flex-col gap-1">
              <li>
                <strong>Supabase</strong> — base de datos y autenticación (servidores en EE. UU.,
                cumplimiento SOC 2)
              </li>
              <li>
                <strong>Cloudflare Pages</strong> — hospedaje y distribución del portal (CDN global)
              </li>
              <li>
                <strong>Google Gmail API</strong> — envío de correos transaccionales como
                restablecimiento de contraseña
              </li>
            </ul>
          </section>

          {/* 6. Derechos ARCO */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              6. Derechos ARCO
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Usted tiene derecho a <strong>Acceder, Rectificar, Cancelar u Oponerse</strong> al
              tratamiento de sus datos personales (derechos ARCO). Para ejercerlos, acuda
              directamente con el administrador escolar del CBT Núm. 5 o comuníquese a través del
              formulario de{" "}
              <a href="/contacto" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200">
                Contacto
              </a>
              .
            </p>
          </section>

          {/* 7. Seguridad */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              7. Medidas de seguridad
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Implementamos medidas técnicas y organizativas para proteger sus datos:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 flex flex-col gap-1">
              <li>Comunicaciones cifradas mediante HTTPS (TLS 1.3)</li>
              <li>Contraseñas almacenadas con hash seguro (bcrypt)</li>
              <li>Políticas de seguridad de contenido (CSP) estrictas en todas las páginas</li>
              <li>Acceso por roles: cada usuario solo accede a su propia información</li>
              <li>Limitación de intentos de inicio de sesión para prevenir ataques de fuerza bruta</li>
            </ul>
          </section>

          {/* 8. Cambios */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
              8. Cambios al aviso de privacidad
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Cualquier modificación a este aviso se publicará en esta misma página con la fecha de
              actualización. Le recomendamos revisarlo periódicamente.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
