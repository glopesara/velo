import { Page, expect } from "@playwright/test";

export function createHomeActions(page: Page) {
  return {
    async goto() {
      await page.goto("http://localhost:5173/");
      await expect(
        page.getByTestId("hero-section").getByRole("heading"),
      ).toContainText("Velô Sprint");
    },
  };
}

