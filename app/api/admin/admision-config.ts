import { NextRequest, NextResponse } from "next/server";

export type SectionKey = "inicio" | "carreras" | "admision" | "avisos" | "contacto" | "nosotros";

interface SectionConfig {
  enabled: boolean;
  lastUpdated: string;
}

interface SectionsConfig {
  [key: string]: SectionConfig;
}

// Configuración en memoria (en producción, usar base de datos)
let sectionsConfig: SectionsConfig = {
  inicio: { enabled: true, lastUpdated: new Date().toISOString() },
  carreras: { enabled: true, lastUpdated: new Date().toISOString() },
  admision: { enabled: true, lastUpdated: new Date().toISOString() },
  avisos: { enabled: true, lastUpdated: new Date().toISOString() },
  contacto: { enabled: true, lastUpdated: new Date().toISOString() },
  nosotros: { enabled: true, lastUpdated: new Date().toISOString() },
};

export async function GET() {
  try {
    return NextResponse.json(sectionsConfig);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, enabled } = body;

    if (!section || typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "Se requieren los campos 'section' y 'enabled'" },
        { status: 400 }
      );
    }

    if (!sectionsConfig[section]) {
      return NextResponse.json(
        { error: `La sección '${section}' no existe` },
        { status: 404 }
      );
    }

    sectionsConfig[section] = {
      enabled,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      config: sectionsConfig,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar configuración" },
      { status: 500 }
    );
  }
}
