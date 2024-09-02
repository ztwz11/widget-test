<template>
  <component
    v-for="component in components"
    :is="component.type"
    :key="component.key"
    :cjv-key="component.key"
    v-bind="component.props"
  />
</template>

<script>
import * as components from "../../widget/control";
import { useControlStore } from "../../store";
//import MyComponent2 from "../../common/";

export default {
  name: "BasePage",
  data() {
    return {
      components: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log("stop");
      const elements = document.querySelectorAll("[cjv-component]");
      elements.forEach((el) => {
        const componentType = el.getAttribute("cjv-component");
        const key =
          el.getAttribute("cjv-key") || Math.random().toString(36).substr(2, 9);
        const props = this.extractProps(el);
        const controlStore = useControlStore();
        let component = null;

        switch (componentType) {
          case "transButtonComponent":
            component = {
              type: components.transButtonComponent,
              props: {
                el: el.outerHTML,
                cjvKey: key,
                ...props,
              },
            };
            break;
          case "inputComponent":
            component = {
              type: components.inputComponent,
              props: {
                el: el.outerHTML,
                cjvKey: key,
                ...props,
              },
            };
            break;
          case "buttonComponent":
            component = {
              type: components.buttonComponent,
              props: {
                el: el.outerHTML,
                cjvKey: key,
                ...props,
              },
            };
            break;
          case "scrollMenuComponent":
            component = {
              type: components.scrollMenuComponent,
              props: {
                el: el.outerHTML,
                cjvKey: key,
                ...props,
              },
            };
            break;
          case "pagingComponent":
            component = {
              type: components.pagingComponent,
              props: {
                el: el.outerHTML,
                cjvKey: key,
                ...props,
              },
            };
            break;
          // 다른 컴포넌트도 추가
        }

        if (component) {
          controlStore.addWidget(component);
          this.components.push(component);
          el.remove();
        }
      });
    },
    extractProps(el) {
      const props = {};
      const attributes = el.attributes;

      for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        const name = attribute.name;
        const value = attribute.value;

        // cjv-component와 이벤트 속성(on으로 시작하는 속성)은 제외
        if (name !== "cjv-component" && !name.startsWith("on")) {
          // 불리언 속성 처리
          if (value === "" || value === "true" || value === name) {
            props[name] = true;
          } else if (value === "false") {
            props[name] = false;
          } else if (!isNaN(Number(value))) {
            // 숫자로 변환 가능한 경우
            props[name] = Number(value);
          } else {
            // 그 외의 경우 문자열로 처리
            props[name] = value;
          }
        }
      }

      return props;
    },
  },
};
</script>
