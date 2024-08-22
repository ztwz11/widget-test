import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { useWidgetStore } from "./store/widgetStore";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// 전역 위젯 설정 함수
window.widgetStart = function (config) {
  const store = useWidgetStore();

  // 이벤트 등록 함수
  function registerEvents(events) {
    for (const [eventName, handler] of Object.entries(events)) {
      store.setEvent(eventName, handler);
    }
  }

  // DOM 로드 완료 후 실행
  document.addEventListener("DOMContentLoaded", () => {
    // 위젯 객체 store에 저장
    store.setConfig(config);

    // 이벤트 등록
    if (config.v && typeof config.v.events === "object") {
      registerEvents(config.v.events);
    }

    app.provide("envOptions", {
      isProduction: process.env.NODE_ENV,
      isMobile: false,
    });

    // Vue 앱 마운트
    app.mount("#app", true);

    // 초기화 및 컴포넌트 기초 세팅 로직 실행
    if (config.v && typeof config.v.init === "function") {
      config.v.init();
    }
  });
};

// 디버깅을 위한 전역 접근 (개발 환경에서만 사용)
if (process.env.NODE_ENV === "development") {
  window.debugWidgetStore = useWidgetStore;
}
