import { test as base } from "@playwright/test";
import { createHomeActions } from "./actions/homeActions";
import { createNavbarActions } from "./actions/navbarActions";
import { createOrderLockupActions } from "./actions/orderLockupActions";
import { createConfigureActions } from "./actions/configureActions";
import { createCheckoutActions } from "./actions/checkoutActions";
type App = {
  home: ReturnType<typeof createHomeActions>;
  navbar: ReturnType<typeof createNavbarActions>;
  orderLockup: ReturnType<typeof createOrderLockupActions>;
  configure: ReturnType<typeof createConfigureActions>;
  checkout: ReturnType<typeof createCheckoutActions>;
};

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      home: createHomeActions(page),
      navbar: createNavbarActions(page),
      orderLockup: createOrderLockupActions(page),
      configure: createConfigureActions(page),
      checkout: createCheckoutActions(page),
    };

    await use(app);
  },
});

export { expect } from "@playwright/test";

