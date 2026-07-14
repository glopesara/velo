import { Page, expect } from "@playwright/test";

export function createConfigureActions(page: Page) {
  const carImage = page.getByRole("img", {
    name: /Velô Sprint - .* with .* wheels/i,
  });
  const totalPrice = page.getByTestId("total-price");

  return {
    async open() {
      await page.getByRole("link", { name: "Monte o Seu Agora" }).click();
      await expect(page).toHaveURL(/\/configure$/);
      await expect(
        page.getByRole("heading", { level: 1, name: "Velô Sprint" }),
      ).toBeVisible();
    },

    async selectColor(colorName: string | RegExp) {
      await page.getByRole("button", { name: colorName }).click();
    },

    async selectWheels(wheelsName: string | RegExp) {
      await page.getByRole("button", { name: wheelsName }).click();
    },

    async validateCarImage(color: string, wheels: string) {
      await expect(carImage).toBeVisible();
      await expect(carImage).toHaveAttribute(
        "alt",
        new RegExp(`Velô Sprint - ${color} with ${wheels} wheels`, "i"),
      );
    },

    async validateTotalPrice(price: string) {
      await expect(totalPrice).toHaveText(price);
    },

    async toggleOptional(testId: string) {
      await page.getByTestId(testId).click();
    },

    async submitConfiguration() {
      await page.getByRole("button", { name: "Monte o Seu" }).click();
    },
  };
}
