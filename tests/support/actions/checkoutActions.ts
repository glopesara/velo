import { Page, expect } from "@playwright/test";

export function createCheckoutActions(page: Page) {
  return {
    async validateUrl() {
      await expect(page).toHaveURL(/\/order$/);
    },

    async validateSummary(expected: {
      color: string;
      interior: string;
      wheels: string;
      optionals: string[];
      total: string;
    }) {
      const summary = page.locator("div", { has: page.getByRole("heading", { name: "Resumo" }) });
      const summaryList = summary.locator("ul");

      await expect(summaryList.getByText(expected.color)).toBeVisible();
      await expect(summaryList.getByText(expected.interior, { exact: false })).toBeVisible();
      await expect(summaryList.getByText(expected.wheels, { exact: false })).toBeVisible();

      for (const opt of expected.optionals) {
        await expect(summaryList.getByText(opt)).toBeVisible();
      }

      await expect(summary.getByTestId("summary-total-price")).toHaveText(expected.total);
    },
  };
}
