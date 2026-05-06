export default function CareersSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-container-max mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="font-display-lg text-display-lg text-on-surface mb-4">Nuestras Carreras</h2>
          <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto">
            Programas diseñados para brindarte habilidades prácticas y conocimientos teóricos, preparándote para el entorno laboral real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Career Card: Gastronomía */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
            <div className="h-48 relative">
              <img
                className="w-full h-full object-cover"
                alt="A professional culinary setup in a modern teaching kitchen. Stainless steel counters are immaculate, under bright, clinical white lighting. Culinary students in crisp white uniforms are engaged in precise food preparation. The aesthetic is clean, disciplined, and highly structured, reflecting a rigorous academic approach to gastronomy."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpDMbTnT126JKHF6wEomD7Bm2R-wh93QvVu2HItEbBwN1ZswxqtoKRlgmsou429mpU5EuNb-QtM_2mXpccdPdgBH-noJndkJ_HL4mL7Rtp3aY096sZQe52RQg4nq0tE3MTcnuRIexdupl5KjLpC47U_zacoSIHbU33eT_LFHsmmp-8pJE-cQ4e4KSENdPKzrpSfqWms225xWcXPTutCJVFqMCRhPx8P48tOrBLgkuSNBGT5V946eO3tR-Mdc_-IFMmpzjkh28sYewT"
              />
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Gastronomía</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Formación integral en técnicas culinarias, administración de alimentos y bebidas, y normativas de higiene.
              </p>
              <div className="mb-4">
                <h4 className="font-label-bold text-label-bold text-primary mb-1 uppercase">Aprenderás</h4>
                <ul className="font-body-sm text-body-sm text-on-surface-variant list-disc pl-4 space-y-1">
                  <li>Técnicas culinarias avanzadas</li>
                  <li>Manejo higiénico de alimentos</li>
                  <li>Administración de menús</li>
                </ul>
              </div>
              <div className="mb-6 flex-grow">
                <h4 className="font-label-bold text-label-bold text-secondary mb-1 uppercase">Campo Laboral</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Restaurantes, hoteles, comedores industriales, emprendimiento propio.
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center bg-surface-container text-primary font-label-bold text-label-bold py-2 px-4 rounded hover:bg-surface-container-high transition-colors w-full"
                href="/carreras"
              >
                Ver más
              </a>
            </div>
          </div>

          {/* Career Card: Informática */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
            <div className="h-48 relative">
              <img
                className="w-full h-full object-cover"
                alt="A brightly lit computer lab with rows of modern monitors displaying code. The environment is pristine white and light grey, emphasizing technological precision. A student's hands are typing on a keyboard in focus. The scene conveys a structured, reliable, and corporate academic setting focused on information technology."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9TMsVlpzF8Ln2cjURRuO-QxEeLJL2I-HTsxWPs3XM4iVUy2CdckiDX8_VUlM8COXowxvua6wMx5dQgG7s93blqOwPzp_wcDWh9sdT097RzKKnUbKfsuDC9M_HlXh5Da4onpUrR2mKqcGzZTuVqqZ4lJfBv6xFvlsOArnqOv4UR9qsPYhWSi2SIcGOvLDUyE4WGdgO7EhTTg-iV2rq36L-PDGK6U_OZJzsva-Ea5W01m7ShaJATt3yiGMycTtYfOxddMWp_pkP8o2x"
              />
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Informática</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Desarrollo de software, mantenimiento de equipos, y gestión de redes para solucionar problemas tecnológicos.
              </p>
              <div className="mb-4">
                <h4 className="font-label-bold text-label-bold text-primary mb-1 uppercase">Aprenderás</h4>
                <ul className="font-body-sm text-body-sm text-on-surface-variant list-disc pl-4 space-y-1">
                  <li>Programación y bases de datos</li>
                  <li>Mantenimiento de hardware</li>
                  <li>Configuración de redes</li>
                </ul>
              </div>
              <div className="mb-6 flex-grow">
                <h4 className="font-label-bold text-label-bold text-secondary mb-1 uppercase">Campo Laboral</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Soporte técnico, desarrollo de software, administración de sistemas, empresas de tecnología.
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center bg-surface-container text-primary font-label-bold text-label-bold py-2 px-4 rounded hover:bg-surface-container-high transition-colors w-full"
                href="/carreras"
              >
                Ver más
              </a>
            </div>
          </div>

          {/* Career Card: Diseño Asistido por Computadora */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
            <div className="h-48 relative">
              <img
                className="w-full h-full object-cover"
                alt="A modern architectural or design studio setting. A desk features architectural blueprints and a monitor displaying 3D CAD models. The lighting is bright and even, highlighting the precision tools and clean lines of the workspace. The color palette is composed of crisp whites, cool greys, and technical blue accents, reflecting a structured design education."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUnEtlPPTtv_DCZo7SFT6vkxlVqmi7SAlVk9OJAyf5Io-Q-wCddSWcNNVJRDyruiuCN694MxQIGKGNDUcvzoDx2g_1aspS2Qx15zbVNSPTA_Kmox_rCEJcSFOIxxTD32Oy8cg2cEBuiwewOm5dMo2OlSmphFzNDW8DWr33xFBg3Pxhns4NCgPi_MFxXcjHBYuh00_AtuEr46WiliR0LGqwsAU8TiX8GjqowzpJbprkvkvNRPXLSqevtjuQg86aPzanBj_ZrBOTP8fd"
              />
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Diseño Asistido por Computadora</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Creación de planos, modelos 3D y representaciones gráficas utilizando software especializado de la industria.
              </p>
              <div className="mb-4">
                <h4 className="font-label-bold text-label-bold text-primary mb-1 uppercase">Aprenderás</h4>
                <ul className="font-body-sm text-body-sm text-on-surface-variant list-disc pl-4 space-y-1">
                  <li>Dibujo técnico computarizado</li>
                  <li>Modelado 3D (CAD)</li>
                  <li>Interpretación de planos</li>
                </ul>
              </div>
              <div className="mb-6 flex-grow">
                <h4 className="font-label-bold text-label-bold text-secondary mb-1 uppercase">Campo Laboral</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Despachos arquitectónicos, empresas constructoras, diseño industrial, agencias de publicidad.
                </p>
              </div>
              <a
                className="inline-flex items-center justify-center bg-surface-container text-primary font-label-bold text-label-bold py-2 px-4 rounded hover:bg-surface-container-high transition-colors w-full"
                href="/carreras"
              >
                Ver más
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
