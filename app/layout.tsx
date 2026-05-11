import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";

export const metadata: Metadata = {
  title: "CBT Núm. 5 – María Amparo Viderique de Shein",
  description: "Centro de Bachillerato Tecnológico Núm. 5, Chalco",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Leer el nonce generado por el middleware para aplicarlo al script inline.
  // Esto permite que la CSP (script-src 'nonce-XXX') autorice este script
  // sin necesitar 'unsafe-inline'.
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") ?? "";

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Script de inicialización de tema — usa nonce para pasar la CSP estricta */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('cbt-tema');
              var s = localStorage.getItem('cbt-tamano');
              if (t === 'oscuro') document.documentElement.classList.add('dark');
              if (s === 'grande') document.documentElement.classList.add('text-grande');
            } catch(e) {}
          })();
        `}} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-background text-on-surface font-body-base antialiased min-h-screen flex flex-col">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
