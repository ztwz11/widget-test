import { createRouter, createWebHistory } from "vue-router";
import BasePage from "../pages/Layout/BasePage.vue";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    component: BasePage,
    props: (route) => ({ pageUrl: route.fullPath }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 페이지 컨텐츠를 로드하는 함수를 외부로 이동
export async function loadPageContent(url) {
  const response = await fetch(url, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  return await response.text();
}

export default router;
