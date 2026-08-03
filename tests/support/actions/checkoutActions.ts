import { Page, expect } from "@playwright/test";

export function createCheckoutActions(page: Page) {
  return {
    async open() {
      await page.goto("http://localhost:5173/order");
    },

    async submitOrder() {
      await page.getByRole("button", { name: "Confirmar Pedido" }).click();
    },

    async fillName(name: string) {
      await page.getByLabel("Nome", { exact: true }).fill(name);
    },

    async fillSurname(surname: string) {
      await page.getByLabel("Sobrenome", { exact: true }).fill(surname);
    },

    async fillEmail(email: string) {
      const emailInput = page.getByLabel("Email", { exact: true });
      await emailInput.fill(email);
      await emailInput.blur();
    },

    async fillPhone(phone: string) {
      await page.getByLabel("Telefone", { exact: true }).fill(phone);
    },

    async fillCpf(cpf: string) {
      const cpfInput = page.getByLabel("CPF", { exact: true });
      await cpfInput.fill(cpf);
      await cpfInput.blur();
    },

    async selectStore(store: string) {
      await page.locator("button").filter({ hasText: "Selecione uma loja" }).click();
      await page.getByText(store).last().click();
    },

    async validateError(field: "name" | "surname" | "email" | "phone" | "cpf" | "store" | "terms", expectedMessage: string) {
      await expect(page.getByTestId(`error-${field}`)).toHaveText(expectedMessage);
    },

    async selectPaymentMethod(method: "avista" | "financiamento") {
      const buttonName = method === "avista" ? /À Vista/i : /Financiamento/i;
      await page.getByRole("button", { name: buttonName }).click();
    },

    async validatePaymentValue(method: "avista" | "financiamento", expectedValue: string) {
      const buttonName = method === "avista" ? /À Vista/i : /Financiamento/i;
      await expect(page.getByRole("button", { name: buttonName })).toContainText(expectedValue);
    },

    async acceptTerms() {
      await page.locator('button[role="checkbox"]').click();
    },

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
