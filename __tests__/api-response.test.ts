import { describe, it, expect } from "vitest";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  parseJsonBody,
} from "@/lib/api-response";

describe("successResponse", () => {
  it("crea respuesta exitosa con data", async () => {
    const res = successResponse({ id: 1, name: "test" });
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data).toEqual({ id: 1, name: "test" });
    expect(res.status).toBe(200);
  });

  it("acesta status custom", () => {
    const res = successResponse({ created: true }, 201);
    expect(res.status).toBe(201);
  });

  it("incluye metadata cuando se proporciona", async () => {
    const res = successResponse([1, 2], 200, { page: 1, total: 10 });
    const json = await res.json();
    expect(json.meta).toEqual({ page: 1, total: 10 });
  });
});

describe("errorResponse", () => {
  it("crea respuesta de error", async () => {
    const res = errorResponse("Not found", 404);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("Not found");
    expect(res.status).toBe(404);
  });

  it("incluye código y detalles", async () => {
    const res = errorResponse("Validation failed", 400, "VALIDATION_ERROR", {
      field: "email",
    });
    const json = await res.json();
    expect(json.code).toBe("VALIDATION_ERROR");
    expect(json.details).toEqual({ field: "email" });
  });
});

describe("paginatedResponse", () => {
  it("calcula total_pages correctamente", async () => {
    const items = Array.from({ length: 5 }, (_, i) => ({ id: i }));
    const res = paginatedResponse(items, 1, 10, 45);
    const json = await res.json();
    expect(json.meta?.total_pages).toBe(5);
    expect(json.meta?.total).toBe(45);
  });

  it("maneja página vacía", async () => {
    const res = paginatedResponse([], 3, 10, 25);
    const json = await res.json();
    expect(json.data).toEqual([]);
    expect(json.meta?.total_pages).toBe(3);
  });
});

describe("parseJsonBody", () => {
  it("parsea JSON válido", async () => {
    const req = new Request("http://test.com", {
      method: "POST",
      body: JSON.stringify({ name: "test" }),
    });
    const result = await parseJsonBody(req);
    expect(result).toEqual({ name: "test" });
  });

  it("rechaza arrays", async () => {
    const req = new Request("http://test.com", {
      method: "POST",
      body: JSON.stringify([1, 2, 3]),
    });
    await expect(parseJsonBody(req)).rejects.toThrow("Cuerpo de solicitud inválido");
  });

  it("rechaza JSON inválido", async () => {
    const req = new Request("http://test.com", {
      method: "POST",
      body: "not json",
    });
    await expect(parseJsonBody(req)).rejects.toThrow("Cuerpo de solicitud inválido");
  });
});
