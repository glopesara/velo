import { test, expect } from "../support/fixtures";
import { OrderFactory } from "../support/database";

test.describe("Checkout", () => {

  test.describe("Validação de Campos Obrigatórios e Dados Inválidos", () => {

    test.beforeEach(async ({ app }) => {
      await app.checkout.open();
    });

    test("deve validar campos em branco e não avançar", async ({ app }) => {
      // Act
      await app.checkout.submitOrder();

      // Assert
      await app.checkout.validateError("name", "Nome deve ter pelo menos 2 caracteres");
      await app.checkout.validateError("surname", "Sobrenome deve ter pelo menos 2 caracteres");
      await app.checkout.validateError("email", "Email inválido");
      await app.checkout.validateError("phone", "Telefone inválido");
      await app.checkout.validateError("cpf", "CPF inválido");
      await app.checkout.validateError("store", "Selecione uma loja");
      await app.checkout.validateError("terms", "Aceite os termos");
    });

    test("deve validar nome e sobrenome com apenas 1 caractere", async ({ app }) => {
      // Act
      await app.checkout.fillName("A");
      await app.checkout.fillSurname("B");
      await app.checkout.submitOrder();

      // Assert
      await app.checkout.validateError("name", "Nome deve ter pelo menos 2 caracteres");
      await app.checkout.validateError("surname", "Sobrenome deve ter pelo menos 2 caracteres");
    });

    test("deve validar formato incorreto de e-mail", async ({ app }) => {
      // Act
      await app.checkout.fillEmail("cliente@.com");
      await app.checkout.submitOrder();

      // Assert
      await app.checkout.validateError("email", "Email inválido");
    });

    test("deve validar CPF incompleto ou inválido", async ({ app }) => {
      // Act
      await app.checkout.fillCpf("123");
      await app.checkout.submitOrder();

      // Assert
      await app.checkout.validateError("cpf", "CPF inválido");
    });

    test("deve exigir o aceite dos termos mesmo com dados corretos", async ({ app }) => {
      // Act
      await app.checkout.fillName("João");
      await app.checkout.fillSurname("Silva");
      await app.checkout.fillEmail("joao@email.com");
      await app.checkout.fillPhone("11999999999");
      await app.checkout.fillCpf("12345678909");
      // Selecionar Loja
      await app.checkout.selectStore("Velô Paulista");

      // Sem aceitar os termos
      await app.checkout.submitOrder();

      // Assert
      await app.checkout.validateError("terms", "Aceite os termos");
    });
  });

  test.describe("Checkout e Confirmação", () => {
    let creditScore = 800;

    test.beforeEach(async ({ app, page }) => {
      // Simular análise de crédito com score dinâmico
      await page.route('***/functions/v1/credit-analysis', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: "Done",
            score: creditScore
          })
        });
      });

      // 1. Navegar até o configurador
      await app.home.goto();
      await app.configure.open();

      // 2. Configurar o veículo (preço padrão de R$ 40.000,00) e enviar
      await app.configure.validateTotalPrice("R$ 40.000,00");
      await app.configure.submitConfiguration();
    });

    test("Checkout e Confirmação - Pagamento à Vista (Fluxo Feliz)", async ({ app, page }) => {
      const orderData = {
        name: "Carlos",
        surname: "Eduardo",
        email: "carlos.eduardo@email.com",
        phone: "11988887777",
        document: "12345678909",
        store: "Velô Faria Lima",
        price: "R$ 40.000,00"
      };
      await OrderFactory.deleteOrderByCPF(orderData.document);

      // Confirma que chegou no checkout
      await app.checkout.validateUrl();

      // Preencher formulário e selecionar pagamento à vista
      await app.checkout.fillCustomerForm({
        name: orderData.name,
        surname: orderData.surname,
        email: orderData.email,
        phone: orderData.phone,
        cpf: orderData.document,
        store: orderData.store,
      });

      await app.checkout.selectPaymentMethod("avista");

      // Assert intermediário - O valor total de "Resumo" e "À Vista" exibem R$ 40.000,00
      await app.checkout.validatePaymentValue("avista", orderData.price);
      await app.checkout.validateSummary({
        color: "Glacier Blue",
        interior: "black",
        wheels: "aero",
        optionals: [],
        total: orderData.price,
      });

      // Confirmar pedido
      await app.checkout.acceptTerms();
      await app.checkout.submitOrder();

      // Assert - Confirmação do pedido
      await expect(page).toHaveURL(/\/success/);
      await expect(page.getByRole("heading", { name: "Pedido Aprovado!" })).toBeVisible();
    });

    test("Deve aprovar o automáticamente o crédito quando o score do CPF for maior que 700 no financiamento.", async ({ app, page }) => {
      creditScore = 800;
      const orderData = {
        name: "Mariana",
        surname: "Oliveira",
        email: "teste@financiado.com",
        phone: "11977776666",
        document: "98765432109",
        store: "Velô Paulista",
      };

      await OrderFactory.deleteOrderByCPF(orderData.document);

      // Preencher dados
      await app.checkout.fillCustomerForm({
        name: orderData.name,
        surname: orderData.surname,
        email: orderData.email,
        phone: orderData.phone,
        cpf: orderData.document,
        store: orderData.store,
      });

      await app.checkout.selectPaymentMethod("financiamento");
      await app.checkout.acceptTerms();
      await app.checkout.submitOrder();

      await expect(page).toHaveURL(/\/success/);
      await expect(page.getByRole("heading", { name: "Pedido Aprovado!" })).toBeVisible();
    });

    test("Deve colocar o pedido em análise (EM_ANALISE) quando o score do CPF estiver entre 501 e 700 no financiamento.", async ({ app, page }) => {
      creditScore = 600;
      const orderData = {
        name: "Gabriel",
        surname: "Lopes",
        email: "gabriel.lopes@email.com",
        phone: "11988887777",
        document: "76166008082",
        store: "Velô Paulista",
      };

      await OrderFactory.deleteOrderByCPF(orderData.document);

      // Preencher dados e enviar
      await app.checkout.fillCustomerForm({
        name: orderData.name,
        surname: orderData.surname,
        email: orderData.email,
        phone: orderData.phone,
        cpf: orderData.document,
        store: orderData.store,
      });

      await app.checkout.selectPaymentMethod("financiamento");
      await app.checkout.acceptTerms();
      await app.checkout.submitOrder();

      await expect(page).toHaveURL(/\/success/);
      await expect(page.getByRole("heading", { name: "Pedido em Análise" })).toBeVisible();
    });

    test("Deve reprovar o crédito quando o score do CPF for menor ou igual a 500 e a entrada for inferior a 50% do valor do veículo.", async ({ app, page }) => {
      creditScore = 500;
      const orderData = {
        name: "Lucas",
        surname: "Oliveira",
        email: "teste@reprovado.com",
        phone: "11966665555",
        document: "12345678901",
        store: "Velô Paulista",
        downPayment: "R$ 10.000,00"
      };

      await OrderFactory.deleteOrderByCPF(orderData.document);

      // Preencher dados e enviar
      await app.checkout.fillCustomerForm({
        name: orderData.name,
        surname: orderData.surname,
        email: orderData.email,
        phone: orderData.phone,
        cpf: orderData.document,
        store: orderData.store,
      });

      await app.checkout.selectPaymentMethod("financiamento");
      await app.checkout.fillDownPayment(orderData.downPayment);
      await app.checkout.acceptTerms();
      await app.checkout.submitOrder();

      await expect(page).toHaveURL(/\/success/);
      await expect(page.getByRole("heading", { name: "Crédito Reprovado" })).toBeVisible();
    });

    test("Deve Aprovar o crédito quando o score do CPF for menor ou igual a 500 e a entrada for igual a 50% do valor do veículo.", async ({ app, page }) => {
      creditScore = 500;
      const orderData = {
        name: "Lucas",
        surname: "Oliveira",
        email: "teste@aprovado1.com",
        phone: "11966665555",
        document: "12345678903",
        store: "Velô Paulista",
        downPayment: "R$ 20.000,00"
      };

      await OrderFactory.deleteOrderByCPF(orderData.document);

      // Preencher dados e enviar
      await app.checkout.fillCustomerForm({
        name: orderData.name,
        surname: orderData.surname,
        email: orderData.email,
        phone: orderData.phone,
        cpf: orderData.document,
        store: orderData.store,
      });

      await app.checkout.selectPaymentMethod("financiamento");
      await app.checkout.fillDownPayment(orderData.downPayment);
      await app.checkout.acceptTerms();
      await app.checkout.submitOrder();

      await expect(page).toHaveURL(/\/success/);
      await expect(page.getByRole("heading", { name: "Pedido Aprovado!" })).toBeVisible();
    });

    test("Deve Aprovar o crédito quando o score do CPF for menor ou igual a 500 e a entrada for maior que 50% do valor do veículo.", async ({ app, page }) => {
      creditScore = 500;
      const orderData = {
        name: "Lucas",
        surname: "Oliveira",
        email: "teste@aprovado5.com",
        phone: "11966665555",
        document: "12345678904",
        store: "Velô Paulista",
        downPayment: "R$ 25.000,00"
      };

      await OrderFactory.deleteOrderByCPF(orderData.document);

      // Preencher dados e enviar
      await app.checkout.fillCustomerForm({
        name: orderData.name,
        surname: orderData.surname,
        email: orderData.email,
        phone: orderData.phone,
        cpf: orderData.document,
        store: orderData.store,
      });

      await app.checkout.selectPaymentMethod("financiamento");
      await app.checkout.fillDownPayment(orderData.downPayment);
      await app.checkout.acceptTerms();
      await app.checkout.submitOrder();

      await expect(page).toHaveURL(/\/success/);
      await expect(page.getByRole("heading", { name: "Pedido Aprovado!" })).toBeVisible();
    });

    test("Deve validar o comportamento do crédito quando o score do CPF for menor ou igual a 500.", async ({ app, page }) => {
      creditScore = 499;
      const orderData = {
        name: "Lucas",
        surname: "Oliveira",
        email: "teste@reprovado50.com",
        phone: "11966664444",
        document: "12345678902",
        store: "Velô Paulista",
      };

      await OrderFactory.deleteOrderByCPF(orderData.document);

      // Preencher dados e enviar
      await app.checkout.fillCustomerForm({
        name: orderData.name,
        surname: orderData.surname,
        email: orderData.email,
        phone: orderData.phone,
        cpf: orderData.document,
        store: orderData.store,
      });

      await app.checkout.selectPaymentMethod("financiamento");
      await app.checkout.acceptTerms();
      await app.checkout.submitOrder();

      await expect(page).toHaveURL(/\/success/);
      await expect(page.getByRole("heading", { name: "Crédito Reprovado" })).toBeVisible();
    });
  });
});

