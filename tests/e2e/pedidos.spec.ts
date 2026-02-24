import { test } from "@playwright/test";

import { generateOrderCode } from "../support/helpers";
import { HomePage } from "../support/pages/HomePage";
import { NavbarComponent } from "../support/components/NavbarComponent";
import { OrderLockupPage } from "../support/pages/OrderLockupPage";

/// AAA - Arrange, Act, Assert

test.describe("Consulta de Pedido", () => {
  let orderLockupPage: OrderLockupPage;

  test.beforeEach(async ({ page }) => {
    // Home (passos 1–2)
    const homePage = new HomePage(page).goto();

    // Navbar (passo 3)
    const navbar = new NavbarComponent(page);
    await navbar.goToConsultarPedido();

    // OrderLookupPage (passo 4)
    orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.expectPageLoaded();
  });

  test("deve consultar um pedido aprovado", async ({ page }) => {
    // Test Data
    const order = {
      number: "VLO-2OE0BV",
      status: "APROVADO" as const,
      color: "Glacier Blue",
      wheels: "aero Wheels",
      customer: {
        name: "Teste Aprovado",
        email: "teste@teste.com",
      },
      payment: "À Vista",
    };

    // Act
    await orderLockupPage.searchOrder(order.number);

    // Assert
    await orderLockupPage.validateOrderDatails(order);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status);
  });

  test("deve consultar um pedido reprovado", async ({ page }) => {
    // Test Data
    const order = {
      number: "VLO-ZYMRS8",
      status: "REPROVADO" as const,
      color: "Glacier Blue",
      wheels: "aero Wheels",
      customer: {
        name: "Teste Araujo",
        email: "teste@teste.com",
      },
      payment: "À Vista",
    };

    // Act

    await orderLockupPage.searchOrder(order.number);

    // Assert
    await orderLockupPage.validateOrderDatails(order);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status);
  });

  test("deve consultar um pedido em analise", async ({ page }) => {
    // Test Data
    const order = {
      number: "VLO-3FC09T",
      status: "EM_ANALISE" as const,
      color: "Glacier Blue",
      wheels: "aero Wheels",
      customer: {
        name: "Teste Analise",
        email: "teste@teste.com",
      },
      payment: "À Vista",
    };

    // Act

    await orderLockupPage.searchOrder(order.number);

    // Assert
    await orderLockupPage.validateOrderDatails(order);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status);
  });

  test("deve exibir mensagem quando o pedido não é encontrado", async ({
    page,
  }) => {
    const order = generateOrderCode();

    await orderLockupPage.searchOrder(order);

    await orderLockupPage.validateOrderNotFound();
  });

  test("deve exibir mensagem quando o pedido em qualquer formato não é encontrado", async ({
    page,
  }) => {
    await orderLockupPage.searchOrder("abc12345");

    await orderLockupPage.validateOrderNotFound();
  });
});
