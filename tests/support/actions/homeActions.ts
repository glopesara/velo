import { Page, expect } from "@playwright/test";

export function createHomeActions(page: Page) {
  return {
    async goto() {
      await page.goto("/");
      await expect(
        page.getByTestId("hero-section").getByRole("heading"),
      ).toContainText("Velô Sprint");
    },
  };
}

