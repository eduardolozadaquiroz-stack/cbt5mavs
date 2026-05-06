import { NextResponse } from "next/server";

export interface ApiSuccess<T = unknown> {
  ok: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };
}

export interface ApiError {
  ok: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: ApiSuccess["meta"]
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { ok: true, data, meta },
    { status }
  );
}

export function errorResponse(
  message: string,
  status = 400,
  code?: string,
  details?: Record<string, unknown>
): NextResponse<ApiError> {
  return NextResponse.json(
    { ok: false, error: message, code, details },
    { status }
  );
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiSuccess<T[]>> {
  const total_pages = Math.ceil(total / limit);
  return successResponse(data, 200, { page, limit, total, total_pages });
}

export function handleApiError(
  error: unknown,
  context = "api"
): NextResponse<ApiError> {
  console.error(`[${context}]`, error);

  if (error instanceof Error) {
    return errorResponse(error.message, 500, "INTERNAL_ERROR");
  }

  return errorResponse("Error interno del servidor", 500, "UNKNOWN_ERROR");
}

export async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new Error("Cuerpo de solicitud inválido");
    }
    return body as Record<string, unknown>;
  } catch {
    throw new Error("Cuerpo de solicitud inválido");
  }
}
