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
    test("CT05 - Checkout e Confirmação - Pagamento à Vista (Fluxo Feliz)", async ({ app, page }) => {
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


      // Arrange - Fluxo de ponta a ponta
      await app.home.goto();
      await app.configure.open();

      // Valida configuração padrão de R$ 40.000,00 e prossegue para checkout
      await app.configure.validateTotalPrice(orderData.price);
      await app.configure.submitConfiguration();

      // Confirma que chegou no checkout
      await app.checkout.validateUrl();

      // Act
      await app.checkout.fillName(orderData.name);
      await app.checkout.fillSurname(orderData.surname);
      await app.checkout.fillEmail(orderData.email);
      await app.checkout.fillPhone(orderData.phone);
      await app.checkout.fillCpf(orderData.document);
      await app.checkout.selectStore(orderData.store);

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

      // Continue Act
      await app.checkout.acceptTerms();
      await app.checkout.submitOrder();

      // Assert - Confirmação do pedido
      await expect(page).toHaveURL(/\/success/);
      await expect(page.getByRole("heading", { name: "Pedido Aprovado!" })).toBeVisible();
    });
  });
});
