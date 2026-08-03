import { expect, test } from "../support/fixtures";
import { generateOrderCode } from "../support/helpers";
import { OrderFactory } from "../support/database";
import ordersData from "../support/fixtures/orders.json" with { type: "json" };

/// AAA - Arrange, Act, Assert

test.describe("Consulta de Pedido", () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open();
  });

  test("deve consultar um pedido aprovado", async ({ app }) => {
    // Test Data
    const order = ordersData.aprovado as any;

    await OrderFactory.deleteOrder(order.number);
    await OrderFactory.insertOrder({
      order_number: order.number,
      status: order.status,
      customer_name: order.customer.name,
    });

    // Act
    await app.orderLockup.searchOrder(order.number);

    // Assert
    await app.orderLockup.validateOrderDatails(order);

    // Validação do badge de status encapsulada na Action
    await app.orderLockup.validateStatusBadge(order.status);


  });

  test("deve consultar um pedido reprovado", async ({ app }) => {
    // Test Data
    const order = ordersData.reprovado as any;

    await OrderFactory.deleteOrder(order.number);
    await OrderFactory.insertOrder({
      order_number: order.number,
      status: order.status,
      customer_name: order.customer.name,
    });

    // Act
    await app.orderLockup.searchOrder(order.number);

    // Assert
    await app.orderLockup.validateOrderDatails(order);

    // Validação do badge de status encapsulada na Action
    await app.orderLockup.validateStatusBadge(order.status);


  });

  test("deve consultar um pedido em analise", async ({ app }) => {
    // Test Data
    const order = ordersData.em_analise as any;

    await OrderFactory.deleteOrder(order.number);
    await OrderFactory.insertOrder({
      order_number: order.number,
      status: order.status,
      customer_name: order.customer.name,
    });

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
