import { test as base } from "@playwright/test";
import { createHomeActions } from "./actions/homeActions";
import { createNavbarActions } from "./actions/navbarActions";
import { createOrderLockupActions } from "./actions/orderLockupActions";

type App = {
  home: ReturnType<typeof createHomeActions>;
  navbar: ReturnType<typeof createNavbarActions>;
  orderLockup: ReturnType<typeof createOrderLockupActions>;
};

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      home: createHomeActions(page),
      navbar: createNavbarActions(page),
      orderLockup: createOrderLockupActions(page),
    };

    await use(app);
  },
});

export { expect } from "@playwright/test";

