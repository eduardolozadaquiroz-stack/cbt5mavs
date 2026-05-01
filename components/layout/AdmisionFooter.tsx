export default function AdmisionFooter() {
  return (
    <footer className="bg-surface w-full border-t border-outline-variant">
      <div className="w-full px-lg py-[48px] max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-start gap-lg">

        {/* Brand & Copyright */}
        <div className="flex flex-col gap-sm max-w-[300px]">
          <span className="font-title-sm text-title-sm font-bold text-on-surface">CBT Núm. 5 – María Amparo Viderique de Shein</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2024 Centro de Bachillerato Tecnológico Núm. 5, Chalco. Institución de Excelencia Educativa.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-lg md:gap-[64px]">
          <div className="flex flex-col gap-sm">
            <span className="font-label-bold text-label-bold text-on-surface uppercase tracking-widest mb-xs">
              Legal
            </span>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#"
            >
              Privacidad
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#"
            >
              Transparencia
            </a>
          </div>
          <div className="flex flex-col gap-sm">
            <span className="font-label-bold text-label-bold text-on-surface uppercase tracking-widest mb-xs">
              Contacto
            </span>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
              href="#"
            >
              Directorio
            </a>
          </div>
          <div className="flex flex-col gap-sm">
            <span className="font-label-bold text-label-bold text-on-surface uppercase tracking-widest mb-xs">
              Social
            </span>
            <div className="flex items-center gap-md">
              <a
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-xs"
                href="#"
              >
                <span className="font-body-sm text-body-sm">Facebook</span>
              </a>
              <a
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-xs"
                href="#"
              >
                <span className="font-body-sm text-body-sm">YouTube</span>
              </a>
              <a
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-xs"
                href="#"
              >
                <span className="font-body-sm text-body-sm">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
