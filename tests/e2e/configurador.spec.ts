import { test } from "../support/fixtures";

test.describe("Configurador de Veículo", () => {
  test.beforeEach(async ({ app }) => {
    await app.home.goto();
    await app.configure.open();
  });

  test("deve selecionar Lunar White e Sport Wheels atualizando imagem e preço", async ({
    app,
  }) => {
    await app.configure.validateCarImage(".*", ".*");
    await app.configure.validateTotalPrice("R$ 40.000,00");

    await app.configure.selectColor("Lunar White");

    await app.configure.validateCarImage("lunar-white", "aero");
    await app.configure.validateTotalPrice("R$ 40.000,00");

    await app.configure.selectWheels(/Sport Wheels/i);

    await app.configure.validateCarImage("lunar-white", "sport");
    await app.configure.validateTotalPrice("R$ 42.000,00");
  });

  test("deve selecionar opcionais e validar o valor total no checkout", async ({
    app,
  }) => {
    await app.configure.selectColor("Lunar White");
    await app.configure.selectWheels(/Sport Wheels/i);

    await app.configure.toggleOptional("opt-precision-park");

    await app.configure.validateTotalPrice("R$ 47.500,00");

    await app.configure.toggleOptional("opt-flux-capacitor");

    await app.configure.validateTotalPrice("R$ 52.500,00");

    await app.configure.submitConfiguration();

    await app.checkout.validateUrl();
    await app.checkout.validateSummary({
      color: "Lunar White",
      interior: "carbon black",
      wheels: "sport Wheels",
      optionals: ["Precision Park", "Flux Capacitor"],
      total: "R$ 52.500,00",
    });
  });
});
