import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

window.widgetStart = function (config) {
  document.addEventListener("DOMContentLoaded", () => {
    const event = new CustomEvent("widgetStart", { detail: config });
    document.dispatchEvent(event);
  });

  document.addEventListener("widgetStart", (event) => {
    const app = createApp({
      render: (h) => h(App),
    });
    const pinia = createPinia();

    const widgetConfig = event.detail;
    app.config.globalProperties.$widgetConfig = widgetConfig;
    app.use(pinia);

    const appElement = document.querySelector("#app");
    if (appElement) {
      app.mount(appElement);
    }
  });
};
