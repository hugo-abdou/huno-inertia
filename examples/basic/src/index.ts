import { Hono } from "hono";
import { always, createInertia, lazy, optional } from "../../../src";
import { RootView } from "./inertia-view";

const app = new Hono();
const inertia = createInertia({
  rootView: RootView,
  title: (page) => `${page.component} - Hono Inertia`,
  version: "dev",
  sharedProps: {
    appName: "Hono Inertia",
  },
});

app.get("/", (c) => {
  return inertia.render(c, "Home", {
    message: "Hello from Hono + Inertia",
    timestamp: always(() => new Date().toISOString()),
    expensiveData: lazy(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      return ["only evaluated when included", "supports async props"];
    }),
    onlyWhenRequested: optional("request with X-Inertia-Partial-Data to include me"),
  });
});

app.post("/logout", (c) => {
  return inertia.redirect(c, "/");
});

export default app;
