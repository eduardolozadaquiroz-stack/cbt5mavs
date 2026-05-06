import { describe, it, expect } from "vitest";
import {
  sanitize,
  isUUID,
  isEmail,
  isCURP,
  normalizeCURP,
  isSafeImageUrl,
  isValidDate,
  safeInt,
  loginSchema,
  contactoSchema,
  paginatedResponseSchema,
  UUID_RE,
  EMAIL_RE,
  CURP_RE,
  MATRICULA_RE,
} from "@/lib/schemas";

describe("sanitize", () => {
  it("recorta espacios y limita longitud", () => {
    expect(sanitize("  hello  ", 10)).toBe("hello");
    expect(sanitize("a".repeat(300), 200)).toBe("a".repeat(200));
  });

  it("elimina caracteres de control", () => {
    expect(sanitize("hello\x00world")).toBe("helloworld");
  });

  it("retorna string vacío para no-strings", () => {
    expect(sanitize(null)).toBe("");
    expect(sanitize(42)).toBe("");
    expect(sanitize(undefined)).toBe("");
  });
});

describe("isUUID", () => {
  it("acepta UUIDs válidos", () => {
    expect(isUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(isUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
  });

  it("rechaza UUIDs inválidos", () => {
    expect(isUUID("not-a-uuid")).toBe(false);
    expect(isUUID("")).toBe(false);
    expect(isUUID("550e8400-e29b-41d4-a716")).toBe(false);
  });
});

describe("isEmail", () => {
  it("acepta emails válidos", () => {
    expect(isEmail("test@example.com")).toBe(true);
    expect(isEmail("user.name+tag@domain.co.uk")).toBe(true);
  });

  it("rechaza emails inválidos", () => {
    expect(isEmail("not-an-email")).toBe(false);
    expect(isEmail("@domain.com")).toBe(false);
    expect(isEmail("")).toBe(false);
  });
});

describe("isCURP", () => {
  it("acepta CURPs válidos", () => {
    expect(isCURP("AAAA000101HDFRRL09")).toBe(true);
  });

  it("acepta CURPs en minúsculas", () => {
    expect(isCURP("aaaa000101hdfrnl09")).toBe(true);
  });

  it("rechaza CURPs inválidos", () => {
    expect(isCURP("not-a-curp")).toBe(false);
    expect(isCURP("")).toBe(false);
  });
});

describe("normalizeCURP", () => {
  it("convierte a mayúsculas y recorta", () => {
    expect(normalizeCURP("  abcd123456hdfrrl00  ")).toBe("ABCD123456HDFRRL00");
  });
});

describe("isSafeImageUrl", () => {
  it("acepta URLs de Supabase", () => {
    expect(isSafeImageUrl("https://abc123.supabase.co/storage/img.jpg")).toBe(true);
  });

  it("acepta URLs vacías", () => {
    expect(isSafeImageUrl("")).toBe(true);
  });

  it("rechaza URLs no-HTTPS", () => {
    expect(isSafeImageUrl("http://example.com/img.jpg")).toBe(false);
  });

  it("rechaza hosts no permitidos", () => {
    expect(isSafeImageUrl("https://evil.com/img.jpg")).toBe(false);
  });

  it("rechaza URLs inválidas", () => {
    expect(isSafeImageUrl("not-a-url")).toBe(false);
  });
});

describe("isValidDate", () => {
  it("acepta fechas válidas en formato YYYY-MM-DD", () => {
    expect(isValidDate("2025-01-15")).toBe(true);
  });

  it("rechaza fechas inválidas", () => {
    expect(isValidDate("2025-13-01")).toBe(false);
    expect(isValidDate("not-a-date")).toBe(false);
    expect(isValidDate("01-01-2025")).toBe(false);
  });
});

describe("safeInt", () => {
  it("convierte a entero dentro de límites", () => {
    expect(safeInt("5", 1, 1, 100)).toBe(5);
    expect(safeInt("200", 1, 1, 100)).toBe(100);
    expect(safeInt("0", 1, 1, 100)).toBe(1);
  });

  it("usa valor por defecto para inválidos", () => {
    expect(safeInt("abc", 42)).toBe(42);
    expect(safeInt(null, 10)).toBe(10);
  });
});

describe("Zod schemas", () => {
  it("loginSchema valida datos correctos", () => {
    const result = loginSchema.safeParse({
      identifier: "123456",
      password: "password123",
      rol: "alumno",
    });
    expect(result.success).toBe(true);
  });

  it("loginSchema rechaza datos inválidos", () => {
    const result = loginSchema.safeParse({
      identifier: "ab",
      password: "short",
      rol: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("contactoSchema valida datos correctos", () => {
    const result = contactoSchema.safeParse({
      nombre: "Juan",
      email: "juan@test.com",
      asunto: "Consulta",
      mensaje: "Hola",
    });
    expect(result.success).toBe(true);
  });

  it("paginatedResponseSchema valida estructura", () => {
    const result = paginatedResponseSchema.safeParse({
      page: 1,
      limit: 10,
      total: 100,
      total_pages: 10,
    });
    expect(result.success).toBe(true);
  });
});
