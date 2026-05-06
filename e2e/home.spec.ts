import { test, expect } from "@playwright/test";

test.describe("Página de inicio", () => {
  test("carga correctamente", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CBT/);
  });

  test("muestra la navegación principal", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("navega a carreras", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Carreras/i }).click();
    await expect(page).toHaveURL(/\/carreras/);
  });

  test("navega a admisión", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Admisión/i }).click();
    await expect(page).toHaveURL(/\/admision/);
  });

  test("navega a contacto", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Contacto/i }).click();
    await expect(page).toHaveURL(/\/contacto/);
  });
});

test.describe("Página de login", () => {
  test("carga el formulario de login", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /Iniciar Sesión/i })).toBeVisible();
  });

  test("muestra campos del formulario", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/correo|matrícula/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Entrar/i })).toBeVisible();
  });

  test("rechaza login sin credenciales", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Entrar/i }).click();
  });

  test("redirige a login desde ruta protegida", async ({ page }) => {
    await page.goto("/dashboard/alumno");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Accesibilidad", () => {
  test("página tiene lang attribute", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "es");
  });

  test("imágenes tienen alt text", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).not.toBeNull();
    }
  });
});
