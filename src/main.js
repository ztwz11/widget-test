import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

window.widgetStart = function (config) {
  document.addEventListener("DOMContentLoaded", () => {
    const event = new CustomEvent("widgetStart", { detail: config });
    document.dispatchEvent(event);
  });

  document.addEventListener("widgetStart", (event) => {
    const app = createApp(App);
    const pinia = createPinia();

    // 메뉴js에서 설정된 페이지 옵션 객체들 주입
    const widgetConfig = event.detail;
    app.config.globalProperties.$widgetConfig = widgetConfig;
    app.use(pinia);
    app.mount("#app");
  });
};
