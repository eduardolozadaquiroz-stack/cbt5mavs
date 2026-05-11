export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 font-public-sans text-xs uppercase tracking-widest border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 w-full mt-xl">
      <div className="w-full px-8 py-12 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-4">
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            CBT Núm. 5 – María Amparo Viderique de Shein          </div>
          <div className="text-slate-500 dark:text-slate-400">
            © 2024 Centro de Bachillerato Tecnológico Núm. 5, Chalco. Institución de Excelencia Educativa.
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-blue-900 dark:text-blue-100">
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 underline transition-colors duration-200"
            href="/privacidad"
          >
            Privacidad
          </a>
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 underline transition-colors duration-200"
            href="#"
          >
            Transparencia
          </a>
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 underline transition-colors duration-200"
            href="#"
          >
            Directorio
          </a>
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 underline transition-colors duration-200"
            href="#"
          >
            Facebook
          </a>
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 underline transition-colors duration-200"
            href="#"
          >
            YouTube
          </a>
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 underline transition-colors duration-200"
            href="#"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
