import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export const runtime = 'edge';

const log = createLogger("api/csp-report");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const report = body["csp-report"] ?? body;
    log.warn("CSP Violation", {
      blocked: report["blocked-uri"],
      violated: report["violated-directive"],
      source: report["source-file"],
    });
  } catch {
    // Ignorar reports malformados
  }

  return NextResponse.json({ ok: true }, { status: 204 });
}
