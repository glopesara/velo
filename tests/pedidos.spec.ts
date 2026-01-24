import { test, expect } from '@playwright/test';

test('deve consultar pedido', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' }).click();
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  await page.getByTestId('search-order-id').click();
  await page.getByTestId('search-order-id').fill('VLO-2OE0BV');
  await page.getByTestId('search-order-button').click();

  await expect(page.getByText('VLO-2OE0BV')).toBeVisible();

  await expect(page.getByText('APROVADO')).toBeVisible();
  await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible();
});