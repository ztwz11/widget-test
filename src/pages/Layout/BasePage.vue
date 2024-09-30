<template>
  <component
    v-for="comp in dynamicComponents"
    :key="comp.key"
    :is="comp.type"
    v-bind="comp.props"
  />
</template>

<script setup>
import { shallowRef, onMounted, nextTick, markRaw } from "vue";
import * as componentMap from "../../widget/control";
import { useControlStore } from "../../store";
import {
  startMeasure,
  endMeasure,
  logAllMeasures,
} from "../../common/performance";

const controlStore = useControlStore();
const dynamicComponents = shallowRef([]);

onMounted(() => {
  startMeasure("BasePage-mounted");
  initComponents();
});

async function initComponents() {
  console.log("stop");

  startMeasure("processElements");
  const elements = Array.from(document.querySelectorAll("[cjt-comp]"));
  const processedComponents = [];

  const chunkSize = 200; // 조정 가능한 청크 크기
  for (let i = 0; i < elements.length; i += chunkSize) {
    const chunk = elements.slice(i, i + chunkSize);
    processedComponents.push(...processElementChunk(chunk));

    // 브라우저가 다른 작업을 처리할 수 있도록 잠시 대기
    if (i + chunkSize < elements.length) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  // 모든 컴포넌트를 한 번에 설정
  dynamicComponents.value = processedComponents;

  endMeasure("processElements");

  nextTick(() => {
    replaceElements();
    endMeasure("BasePage-mounted");
    logAllMeasures();
  });
}

function processElementChunk(elements) {
  return elements
    .map((el) => {
      const componentType = `${el.getAttribute("cjt-comp")}Component`;
      const key =
        el.getAttribute("cjt-key") || Math.random().toString(36).substr(2, 9);
      const props = extractProps(el);

      if (!componentMap[componentType]) {
        console.warn(`Unknown component type: ${componentType}`);
        return null;
      }

      const component = {
        type: markRaw(componentMap[componentType]),
        key,
        props: {
          el: el.outerHTML,
          cjvKey: key,
          ...props,
        },
      };

      // Widget 등록
      controlStore.addWidget(component);

      return component;
    })
    .filter(Boolean);
}

function extractProps(el) {
  return Array.from(el.attributes).reduce((props, attr) => {
    if (attr.name !== "cjt-comp" && !attr.name.startsWith("on")) {
      const value = attr.value;
      if (value === "" || value === "true" || value === attr.name) {
        props[attr.name] = true;
      } else if (value === "false") {
        props[attr.name] = false;
      } else if (!isNaN(Number(value))) {
        props[attr.name] = Number(value);
      } else {
        props[attr.name] = value;
      }
    }
    return props;
  }, {});
}

function replaceElements() {
  dynamicComponents.value.forEach((comp) => {
    const originalEl = document.querySelector(`[cjt-key="${comp.key}"]`);
    if (originalEl) {
      const placeholder = document.createElement("div");
      placeholder.id = `placeholder-${comp.key}`;
      originalEl.parentNode.replaceChild(placeholder, originalEl);
    }
  });
}

// 컴포넌트가 마운트된 후 올바른 위치로 이동
onMounted(() => {
  nextTick(() => {
    dynamicComponents.value.forEach((comp) => {
      const placeholder = document.getElementById(`placeholder-${comp.key}`);
      if (placeholder) {
        const componentElement = document.querySelector(
          `[data-key="${comp.key}"]`
        );
        if (componentElement) {
          placeholder.parentNode.replaceChild(componentElement, placeholder);
        }
      }
    });
  });
});
</script>
