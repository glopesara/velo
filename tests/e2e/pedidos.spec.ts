import { expect, test } from "../support/fixtures";
import { generateOrderCode } from "../support/helpers";

/// AAA - Arrange, Act, Assert

test.describe("Consulta de Pedido", () => {
  test.beforeEach(async ({ app }) => {
    // Home (passos 1–2)
    // await app.home.goto();

    // // Navbar (passo 3)
    // await app.navbar.goToConsultarPedido();

    // OrderLookupPage (passo 4)
    await app.orderLockup.open();
  });

  test("deve consultar um pedido aprovado", async ({ app }) => {
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
    await app.orderLockup.searchOrder(order.number);

    // Assert
    await app.orderLockup.validateOrderDatails(order);

    // Validação do badge de status encapsulada na Action
    await app.orderLockup.validateStatusBadge(order.status);
  });

  test("deve consultar um pedido reprovado", async ({ app }) => {
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
    await app.orderLockup.searchOrder(order.number);

    // Assert
    await app.orderLockup.validateOrderDatails(order);

    // Validação do badge de status encapsulada na Action
    await app.orderLockup.validateStatusBadge(order.status);
  });

  test("deve consultar um pedido em analise", async ({ app }) => {
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
    await app.orderLockup.searchOrder(order.number);

    // Assert
    await app.orderLockup.validateOrderDatails(order);

    // Validação do badge de status encapsulada na Action
    await app.orderLockup.validateStatusBadge(order.status);
  });

  test("deve exibir mensagem quando o pedido não é encontrado", async ({
    app,
  }) => {
    const order = generateOrderCode();

    await app.orderLockup.searchOrder(order);

    await app.orderLockup.validateOrderNotFound();
  });

  test("deve exibir mensagem quando o pedido em qualquer formato não é encontrado", async ({
    app,
  }) => {
    await app.orderLockup.searchOrder("abc12345");

    await app.orderLockup.validateOrderNotFound();
  });

  test("deve manter o botão de busca desabilitado com o input vazio ou apenas espaços", async ({
    app,
    page,
  }) => {
    const button = app.orderLockup.elements.orderButton;

    await expect(button).toBeDisabled();
  });
});
