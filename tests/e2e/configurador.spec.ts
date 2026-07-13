import { expect, test } from "../support/fixtures";

test.describe("Configurador de Veículo", () => {
  test.beforeEach(async ({ app, page }) => {
    // Estado inicial validado na home
    await app.home.goto();

    // Navegação para o configurador
    await page.getByRole("link", { name: "Monte o Seu Agora" }).click();
    await expect(page).toHaveURL(/\/configure$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Velô Sprint" }),
    ).toBeVisible();
  });

  test("CT02 - deve selecionar Lunar White e Sport Wheels atualizando imagem e preço", async ({
    page,
  }) => {
    // Arrange
    const carImage = page.getByRole("img", {
      name: /Velô Sprint - .* with .* wheels/i,
    });

    await expect(carImage).toBeVisible();
    await expect(page.getByTestId("total-price")).toHaveText("R$ 40.000,00");

    // Act - seleção da cor
    await page.getByRole("button", { name: "Lunar White" }).click();

    // Assert (checkpoint 1)
    await expect(carImage).toHaveAttribute(
      "alt",
      /Velô Sprint - lunar-white with aero wheels/i,
    );
    await expect(page.getByTestId("total-price")).toHaveText("R$ 40.000,00");

    // Act - seleção das rodas
    await page.getByRole("button", { name: /Sport Wheels/i }).click();

    // Assert (checkpoint 2/final)
    await expect(carImage).toHaveAttribute(
      "alt",
      /Velô Sprint - lunar-white with sport wheels/i,
    );
    await expect(page.getByTestId("total-price")).toHaveText("R$ 42.000,00");
  });
});
