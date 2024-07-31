import { createApp } from "vue";
import App from "./App.vue";

window.widgetStart = function (config) {
  document.addEventListener("DOMContentLoaded", () => {
    const event = new CustomEvent("widgetStart", { detail: config });
    document.dispatchEvent(event);
  });

  document.addEventListener("widgetStart", (event) => {
    const app = createApp(App);

    // event.detail을 통해 home.js에서 전달된 데이터를 가져올 수 있습니다.
    const widgetConfig = event.detail;
    app.config.globalProperties.$widgetConfig = widgetConfig;

    app.mount("#app");
  });
};
