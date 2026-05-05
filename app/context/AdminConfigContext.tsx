import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Inicio ────────────────────────────────────────────────────────────────

export interface CarouselSlide {
  src: string;
  alt: string;
  label: string;
}

export interface Metrica {
  valor: string;
  etiqueta: string;
  descripcion: string;
}

export interface InicioConfig {
  hero: {
    subtitulo: string;
    titulo: string;
    descripcion: string;
    boton1Texto: string;
    boton1Href: string;
    boton2Texto: string;
    boton2Href: string;
  };
  carousel: CarouselSlide[];
  metricas: Metrica[];
}

// ─── Carreras ───────────────────────────────────────────────────────────────

export interface StudyHighlight {
  text: string;
}

export interface CarreraConfig {
  id: string;
  titulo: string;
  icon: string;
  imageSrc: string;
  imageAlt: string;
  perfilEgreso: string;
  campoProfesional: string;
  destacados: StudyHighlight[];
}

export interface CarrerasConfig {
  heroTitulo: string;
  heroDescripcion: string;
  carreras: CarreraConfig[];
}

// ─── Nosotros ──────────────────────────────────────────────────────────────

export interface DirectivoConfig {
  id: string;
  nombre: string;
  cargo: string;
  nivel: "director" | "subdirector" | "coordinador" | "docente" | "administrativo";
  img: string;
}

export interface InstalacionConfig {
  id: string;
  label: string;
  icon: string;
  imageSrc: string;
}

export interface ReconocimientoConfig {
  id: string;
  anio: string;
  titulo: string;
  descripcion: string;
  imageSrc: string;
}

export interface HistoriaEvento {
  id: string;
  anio: string;
  evento: string;
}

export interface NosotrosConfig {
  mision: string;
  vision: string;
  historiaTexto: string;
  historiaEventos: HistoriaEvento[];
  directivos: DirectivoConfig[];
  instalaciones: InstalacionConfig[];
  reconocimientos: ReconocimientoConfig[];
}

// ─── Contacto ───────────────────────────────────────────────────────────────

export interface ContactoConfig {
  email: string;
  telefono: string;
  telefono2: string;
  direccion: string;
  horarioMatutino: string;
  horarioVespertino: string;
  mapaUrl: string;
  redesSociales: {
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
}

// ─── Admisión ───────────────────────────────────────────────────────────────

export interface AdmisionConfig {
  fechaInicio: string;
  fechaCierre: string;
  cupoActual: number;
  precioInscripcion: number;
  documentosRequeridos: string;
  linkFormatosAdmision: string;
  avisoImportante: string;
  habilitada: boolean;
}

export interface ReinscripcionConfig {
  habilitada: boolean;
  fechaInicio: string;
  fechaCierre: string;
  cicloEscolar: string;
  costoReinscripcion: number;
  documentosRequeridos: string;
  linkFormatos: string;
  imagenPago: string;
  avisoImportante: string;
}

export interface Aviso {
  id: number;
  titulo: string;
  tipo: "Urgente" | "Académico" | "Administrativo" | "Institucional" | "Sistema";
  estado: "Publicado" | "Borrador" | "Archivado";
  destinatario: string;
  fecha: string;
  contenido: string;
  fotos: string[];
}

export interface SectionConfig {
  enabled: boolean;
  lastUpdated: string;
}

export interface SiteConfig {
  nombreInstituto: string;
  municipio: string;
  estado: string;
  director: string;
  ciclo: string;
  turnoMatutino: boolean;
  turnoVespertino: boolean;
  registroPublico: boolean;
  mantenimiento: boolean;
}

export interface AdminConfig {
  inicio: InicioConfig;
  carreras: CarrerasConfig;
  nosotros: NosotrosConfig;
  admision: AdmisionConfig;
  reinscripcion: ReinscripcionConfig;
  contacto: ContactoConfig;
  siteConfig: SiteConfig;
  avisos: Aviso[];
  secciones: Record<string, SectionConfig>;
  ultimaActualizacion: string;
}

interface AdminConfigContextType {
  config: AdminConfig;
  updateInicio: (data: Partial<InicioConfig>) => void;
  updateCarreras: (data: Partial<CarrerasConfig>) => void;
  updateNosotros: (data: Partial<NosotrosConfig>) => void;
  updateAdmision: (data: Partial<AdmisionConfig>) => void;
  updateReinscripcion: (data: Partial<ReinscripcionConfig>) => void;
  updateContacto: (data: Partial<ContactoConfig>) => void;
  updateSiteConfig: (data: Partial<SiteConfig>) => void;
  addAviso: (aviso: Aviso) => void;
  updateAviso: (id: number, data: Partial<Aviso>) => void;
  deleteAviso: (id: number) => void;
  updateSectionEnabled: (section: string, enabled: boolean) => void;
  getPublicadosAvisos: () => Aviso[];
}

const AdminConfigContext = createContext<AdminConfigContextType | undefined>(undefined);

const DEFAULT_CONFIG: AdminConfig = {
  inicio: {
    hero: {
      subtitulo: "Centro de Bachillerato Tecnológico Núm. 5 – Chalco",
      titulo: "Estudia una carrera técnica desde el bachillerato y prepárate para el futuro profesional",
      descripcion: "Formación en Gastronomía, Informática y Diseño Asistido por Computadora con enfoque práctico.",
      boton1Texto: "Ver Carreras",
      boton1Href: "/carreras",
      boton2Texto: "Proceso de Admisión",
      boton2Href: "/admision",
    },
    carousel: [
      {
        src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80&fit=crop",
        alt: "Alumnos estudiando juntos en salón de clases",
        label: "Formación técnica de calidad",
      },
      {
        src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1600&q=80&fit=crop",
        alt: "Laboratorio de cómputo con alumnos",
        label: "Laboratorios de Informática equipados",
      },
      {
        src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80&fit=crop",
        alt: "Taller de gastronomía",
        label: "Taller de Gastronomía profesional",
      },
      {
        src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&fit=crop",
        alt: "Instalaciones educativas modernas",
        label: "Instalaciones modernas en Chalco",
      },
      {
        src: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=1600&q=80&fit=crop",
        alt: "Alumnos en graduación",
        label: "Egresados listos para el futuro",
      },
    ],
    metricas: [
      { valor: "+1,200", etiqueta: "alumnos activos", descripcion: "comunidad en crecimiento" },
      { valor: "87%", etiqueta: "índice de aprobación", descripcion: "excelencia académica" },
      { valor: "3", etiqueta: "carreras técnicas", descripcion: "especialización técnica" },
      { valor: "+20", etiqueta: "años de experiencia", descripcion: "trayectoria institucional" },
    ],
  },
  nosotros: {
    mision: "Formar bachilleres técnicos competentes, con valores éticos y ciudadanos, capaces de incorporarse al sector productivo o continuar estudios superiores; a través de una educación integral, incluyente y de calidad que responda a las necesidades de la comunidad de Chalco y su región.",
    vision: "Ser una institución educativa de vanguardia, reconocida en la región por la calidad de su oferta educativa técnica, la innovación pedagógica y el compromiso permanente con el desarrollo humano y profesional de su comunidad estudiantil.",
    historiaTexto: "El Centro de Bachillerato Tecnológico Núm. 5 fue fundado en el municipio de Chalco, Estado de México, con el objetivo de brindar educación media superior de carácter tecnológico a la creciente población estudiantil de la región oriente del Estado de México.",
    historiaEventos: [
      { id: "ev1", anio: "[ Año ]", evento: "Fundación del plantel." },
      { id: "ev2", anio: "[ Año ]", evento: "Incorporación de la carrera de Informática." },
      { id: "ev3", anio: "[ Año ]", evento: "Inauguración del taller de Gastronomía." },
      { id: "ev4", anio: "[ Año ]", evento: "Primer generación de egresados técnicos." },
    ],
    directivos: [
      { id: "dir1", nombre: "Nombre del Director(a)", cargo: "Director(a) General", nivel: "director", img: "" },
      { id: "dir2", nombre: "Nombre del Subdirector(a) Académico", cargo: "Subdirector(a) Académico", nivel: "subdirector", img: "" },
      { id: "dir3", nombre: "Nombre del Subdirector(a) Administrativo", cargo: "Subdirector(a) Administrativo", nivel: "subdirector", img: "" },
    ],
    instalaciones: [
      { id: "inst1", label: "Laboratorios de cómputo", icon: "computer", imageSrc: "" },
      { id: "inst2", label: "Taller de gastronomía", icon: "restaurant", imageSrc: "" },
      { id: "inst3", label: "Taller de diseño asistido", icon: "design_services", imageSrc: "" },
      { id: "inst4", label: "Cancha deportiva", icon: "sports_soccer", imageSrc: "" },
      { id: "inst5", label: "Biblioteca", icon: "library_books", imageSrc: "" },
      { id: "inst6", label: "Sala de usos múltiples", icon: "meeting_room", imageSrc: "" },
      { id: "inst7", label: "Servicio médico", icon: "medical_services", imageSrc: "" },
      { id: "inst8", label: "Cafetería", icon: "local_cafe", imageSrc: "" },
    ],
    reconocimientos: [
      { id: "rec1", anio: "2024", titulo: "Reconocimiento de Excelencia Académica", descripcion: "Otorgado por la Dirección General de Educación Tecnológica Industrial y de Servicios (DGETI).", imageSrc: "" },
      { id: "rec2", anio: "2023", titulo: "Certificación en Calidad Educativa", descripcion: "Reconocimiento a la mejora continua en los procesos de enseñanza-aprendizaje.", imageSrc: "" },
      { id: "rec3", anio: "2022", titulo: "Premio al Mérito Técnico", descripcion: "Distinción por el desempeño sobresaliente de estudiantes en olimpiadas técnicas regionales.", imageSrc: "" },
    ],
  },
  carreras: {
    heroTitulo: "Oferta Educativa Técnica",
    heroDescripcion: "Formamos profesionales técnicos altamente capacitados, listos para integrarse al sector productivo o continuar con sus estudios superiores. Conoce nuestras especialidades.",
    carreras: [
      {
        id: "gastronomia",
        titulo: "Técnico en Gastronomía",
        icon: "restaurant",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCttOutF9MxnIbrUIIMKsyc2u5AldGSObwSZb06iSXh6zLHDDohaOl36Mh_1qRuQIXbTCnV0zlZhHCUe4mZDaNLqtOEIwbnQH8IRW2Y8JntS-39BksOX7nlTsU7Cfw3KmoKvuE4mC_y9fZkeeWxgW0eWE1KrdpWSeIiavxOwNDvjyXP0fen_6O_vcURcBF4FJfqvdInQl2xdH8FL-sYpuHhgCn0_vdUMFwWAKMeD5ofg2jTXbqprIlOO4IXGVn01eQBYmAkh8Ey42Q_",
        imageAlt: "Taller de gastronomía con estudiantes",
        perfilEgreso: "Capacidad para preparar alimentos y bebidas de calidad, aplicando normas de higiene. Conocimientos en costeo de recetas, diseño de menús y administración básica de establecimientos de alimentos y bebidas.",
        campoProfesional: "Restaurantes, comedores industriales, hoteles, banquetes, cruceros, y emprendimiento de negocios gastronómicos propios.",
        destacados: [
          { text: "Bases culinarias y sanidad" },
          { text: "Panadería y repostería" },
          { text: "Cocina internacional y nacional" },
          { text: "Coctelería y enología" },
        ],
      },
      {
        id: "informatica",
        titulo: "Técnico en Informática",
        icon: "computer",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkur42XdqZBZp7TJdgWzC79PzlwrdA54NUni4gRjoWtys5-LlpykIwJlLVjGJXlo0Y184uqrge1-uSdHmSBcmGq9zgWRq8Fd3bvqjIhcITfegtZ8d40AVM_tNbriBRENc5p9ojRiD4XiYRV-kVOuB0_fdnoymKVCyW5QaXZwqDwwxaQ8WnGOKB4qZzD9-GNUGyrYwpNoVy0Ez-oAURptSuGFZq_U4y1ZrQy6SEiBnMpTlaY7YGgbhpWCasQoz6YTozifQ9kacfkH1g",
        imageAlt: "Laboratorio de informática con alumnos",
        perfilEgreso: "Habilidad para ensamblar, configurar y mantener equipos de cómputo. Dominio en el diseño y administración de redes LAN, así como el desarrollo de software básico y gestión de bases de datos.",
        campoProfesional: "Departamentos de soporte técnico, centros de cómputo, empresas de desarrollo de software, telecomunicaciones y asesoría tecnológica independiente.",
        destacados: [
          { text: "Mantenimiento de hardware" },
          { text: "Instalación de redes locales" },
          { text: "Programación estructurada" },
          { text: "Sistemas operativos y ofimática" },
        ],
      },
      {
        id: "diseno",
        titulo: "Técnico en Diseño Asistido por Computadora",
        icon: "architecture",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOs9xWB9D9sP6QopUBeA9foZkZF_gd7xcbF3aETMxzsSsHxASF7JdfRqeTKgjE5JKZif_1yigGTbsiUO5Aye3y_JwGxCyOtTwDQCS1x-tM5E3R00Bzx8wmzjKf5K-_grPn8KSpp-sJyILYDiJwBAHyaPJ3R2Z8unJsNgXavjbJfUGEy9ZVcvM0_idjdHpe7eLpdqi_gtMbNdi4BnZLS_mRhgQaBMnScwD_akLjcPcfRuX5j2GS6aJfYsiQREHeSYmgUi-KzpnTKQ7W",
        imageAlt: "Estudio de diseño asistido por computadora",
        perfilEgreso: "Competencia en la representación gráfica de proyectos arquitectónicos, industriales y mecánicos. Dominio de software especializado para modelado 2D y 3D, elaboración de planos y recorridos virtuales.",
        campoProfesional: "Despachos de arquitectura, empresas constructoras, agencias de diseño industrial, publicidad, y dependencias gubernamentales de obras públicas.",
        destacados: [
          { text: "Dibujo técnico y geometría" },
          { text: "Software CAD (AutoCAD)" },
          { text: "Modelado y renderizado 3D" },
          { text: "Edición de imágenes y vectorización" },
        ],
      },
    ],
  },
  admision: {
    fechaInicio: "2024-01-15",
    fechaCierre: "2024-03-31",
    cupoActual: 100,
    precioInscripcion: 500,
    documentosRequeridos:
      "Certificado de preparatoria, INE de los padres, Comprobante de domicilio",
    linkFormatosAdmision: "https://example.com/formatos",
    avisoImportante: "Las fechas pueden cambiar según necesidad",
    habilitada: true,
  },
  reinscripcion: {
    habilitada: false,
    fechaInicio: "",
    fechaCierre: "",
    cicloEscolar: "2025-2026",
    costoReinscripcion: 0,
    documentosRequeridos: "Boleta de calificaciones, Credencial escolar",
    linkFormatos: "",
    imagenPago: "",
    avisoImportante: "",
  },
  contacto: {
    email: "contacto@cbt5chalco.edu.mx",
    telefono: "+52 (55) 5124 0355",
    telefono2: "",
    direccion: "Rio La Compañía Mz. 79-Lt. 1, Sección VI, Conjunto Hab. Los Héroes Chalco, 56644 Chalco de Díaz Covarrubias, Méx.",
    horarioMatutino: "07:00 AM – 01:00 PM",
    horarioVespertino: "01:00 PM – 07:00 PM",
    mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6334.449767824081!2d-98.84201442904536!3d19.261204329788868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce18ab560fc0b7%3A0xf18fa0c2df554486!2sCBT%20N%C3%BAmero%205%20Chalco!5e0!3m2!1ses!2smx!4v1777535021958!5m2!1ses!2smx",
    redesSociales: { facebook: "", instagram: "", whatsapp: "" },
  },
  avisos: [
    {
      id: 1,
      titulo: "Cierre de captura de calificaciones — Parcial 2",
      tipo: "Urgente",
      estado: "Publicado",
      destinatario: "Todos",
      fecha: "2026-05-03",
      contenido:
        "El cierre de captura será el 3 de mayo a las 14:00 hrs. No habrá prórroga.",
      fotos: [],
    },
    {
      id: 2,
      titulo: "Resultados Parcial 2 disponibles en portal",
      tipo: "Académico",
      estado: "Publicado",
      destinatario: "Alumnos",
      fecha: "2026-04-30",
      contenido:
        "Los alumnos pueden consultar sus calificaciones del segundo parcial en el portal estudiantil.",
      fotos: [],
    },
    {
      id: 3,
      titulo: "Suspensión 15 de mayo — Día del Maestro",
      tipo: "Institucional",
      estado: "Publicado",
      destinatario: "Todos",
      fecha: "2026-04-28",
      contenido:
        "En conmemoración del Día del Maestro, no habrá clases el próximo 15 de mayo.",
      fotos: [],
    },
  ],
  secciones: {
    inicio: { enabled: true, lastUpdated: new Date().toISOString() },
    carreras: { enabled: true, lastUpdated: new Date().toISOString() },
    admision: { enabled: true, lastUpdated: new Date().toISOString() },
    avisos: { enabled: true, lastUpdated: new Date().toISOString() },
    contacto: { enabled: true, lastUpdated: new Date().toISOString() },
    nosotros: { enabled: true, lastUpdated: new Date().toISOString() },
  },
  siteConfig: {
    nombreInstituto: "Centro de Bachillerato Tecnológico Núm. 5",
    municipio: "Chalco",
    estado: "Estado de México",
    director: "María Amparo Viderique de Shein",
    ciclo: "2025-2026",
    turnoMatutino: true,
    turnoVespertino: true,
    registroPublico: true,
    mantenimiento: false,
  },
  ultimaActualizacion: new Date().toISOString(),
};

export function AdminConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AdminConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Merge helper ─────────────────────────────────────────────────────
  function mergeWithDefaults(parsed: Partial<AdminConfig>): AdminConfig {
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      inicio: { ...DEFAULT_CONFIG.inicio, ...(parsed.inicio ?? {}) },
      carreras: { ...DEFAULT_CONFIG.carreras, ...(parsed.carreras ?? {}) },
      nosotros: {
        ...DEFAULT_CONFIG.nosotros,
        ...(parsed.nosotros ?? {}),
        historiaEventos:
          parsed.nosotros?.historiaEventos ??
          DEFAULT_CONFIG.nosotros.historiaEventos,
      },
      admision: { ...DEFAULT_CONFIG.admision, ...(parsed.admision ?? {}) },
      reinscripcion: { ...DEFAULT_CONFIG.reinscripcion, ...(parsed.reinscripcion ?? {}) },
      contacto: {
        ...DEFAULT_CONFIG.contacto,
        ...(parsed.contacto ?? {}),
        redesSociales: {
          ...DEFAULT_CONFIG.contacto.redesSociales,
          ...(parsed.contacto?.redesSociales ?? {}),
        },
      },
      secciones: { ...DEFAULT_CONFIG.secciones, ...(parsed.secciones ?? {}) },
      siteConfig: { ...DEFAULT_CONFIG.siteConfig, ...(parsed.siteConfig ?? {}) },
    };
  }

  // ── Cargar al montar: primero API, localStorage como fallback ─────────
  useEffect(() => {
    async function loadConfig() {
      // 1. Intentar desde la API (Supabase)
      try {
        const res = await fetch("/api/admin/config");
        if (res.ok) {
          const { config: remoteConfig } = await res.json();
          if (remoteConfig) {
            setConfig(mergeWithDefaults(remoteConfig));
            setIsLoaded(true);
            return;
          }
        }
      } catch {
        // Sin conexión o Supabase no configurado → fallback a localStorage
      }

      // 2. Fallback: localStorage
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("admin-config");
          if (stored) {
            setConfig(mergeWithDefaults(JSON.parse(stored)));
          }
        } catch (err) {
          console.error("Error al cargar configuración:", err);
        }
      }
      setIsLoaded(true);
    }

    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Guardar: localStorage (inmediato) + API (en background) ──────────
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    // localStorage — siempre
    try {
      localStorage.setItem("admin-config", JSON.stringify(config));
      window.dispatchEvent(new Event("admin-config-changed"));
    } catch (err) {
      console.error("Error al guardar en localStorage:", err);
    }

    // API — en background (no bloqueante)
    fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    }).catch(() => {
      // Silencioso: si falla la API los datos ya están en localStorage
    });
  }, [config, isLoaded]);

  const updateInicio = (data: Partial<InicioConfig>) => {
    setConfig((prev) => ({
      ...prev,
      inicio: { ...prev.inicio, ...data },
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const updateCarreras = (data: Partial<CarrerasConfig>) => {
    setConfig((prev) => ({
      ...prev,
      carreras: { ...prev.carreras, ...data },
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const updateNosotros = (data: Partial<NosotrosConfig>) => {
    setConfig((prev) => ({
      ...prev,
      nosotros: { ...prev.nosotros, ...data },
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const updateAdmision = (data: Partial<AdmisionConfig>) => {
    setConfig((prev) => ({
      ...prev,
      admision: { ...prev.admision, ...data },
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const updateReinscripcion = (data: Partial<ReinscripcionConfig>) => {
    setConfig((prev) => ({
      ...prev,
      reinscripcion: { ...prev.reinscripcion, ...data },
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const updateContacto = (data: Partial<ContactoConfig>) => {
    setConfig((prev) => ({
      ...prev,
      contacto: {
        ...prev.contacto,
        ...data,
        redesSociales: {
          ...prev.contacto.redesSociales,
          ...(data.redesSociales ?? {}),
        },
      },
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const updateSiteConfig = (data: Partial<SiteConfig>) => {
    setConfig((prev) => ({
      ...prev,
      siteConfig: { ...prev.siteConfig, ...data },
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const addAviso = (aviso: Aviso) => {
    setConfig((prev) => ({
      ...prev,
      avisos: [aviso, ...prev.avisos],
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const updateAviso = (id: number, data: Partial<Aviso>) => {
    setConfig((prev) => ({
      ...prev,
      avisos: prev.avisos.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const deleteAviso = (id: number) => {
    setConfig((prev) => ({
      ...prev,
      avisos: prev.avisos.filter((a) => a.id !== id),
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const updateSectionEnabled = (section: string, enabled: boolean) => {
    setConfig((prev) => ({
      ...prev,
      secciones: {
        ...prev.secciones,
        [section]: {
          enabled,
          lastUpdated: new Date().toISOString(),
        },
      },
      ultimaActualizacion: new Date().toISOString(),
    }));
  };

  const getPublicadosAvisos = () => {
    return config.avisos.filter((a) => a.estado === "Publicado").sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  };

  return (
    <AdminConfigContext.Provider
      value={{
        config,
        updateInicio,
        updateCarreras,
        updateNosotros,
        updateAdmision,
        updateReinscripcion,
        updateContacto,
        updateSiteConfig,
        addAviso,
        updateAviso,
        deleteAviso,
        updateSectionEnabled,
        getPublicadosAvisos,
      }}
    >
      {children}
    </AdminConfigContext.Provider>
  );
}

export function useAdminConfig() {
  const context = useContext(AdminConfigContext);
  if (!context) {
    throw new Error(
      "useAdminConfig debe ser usado dentro de AdminConfigProvider"
    );
  }
  return context;
}
