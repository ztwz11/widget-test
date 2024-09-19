import { defineComponent, ref, markRaw } from "vue";
import { useControlStore, useWidgetStore } from "../store";
import * as components from "../widget/control";

export function useComponentTree() {
  const controlStore = useControlStore();
  const dynamicComponents = ref([]);

  const createComponentTree = async (element, depth = 0, maxDepth = 1000) => {
    if (depth > maxDepth) {
      console.warn(`위젯 노드 뎁스는 ${maxDepth}번을 넘을 수 없습니다.`);
      return [];
    }

    const componentTree = [];
    const componentElements = element.querySelectorAll("[cjt-comp]");

    for (const el of componentElements) {
      const componentInfo = createComponentInfo(el);
      if (componentInfo) {
        componentInfo.children = await createComponentTree(
          el,
          depth + 1,
          maxDepth
        );
        componentTree.push(componentInfo);
      }

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    return componentTree;
  };

  const createComponentInfo = (el) => {
    const componentType = el.getAttribute("cjt-comp");
    const key =
      el.getAttribute("cjt-key") || Math.random().toString(36).substring(2, 9);
    const props = extractProps(el);

    if (!components[componentType]) {
      console.error(`"${componentType}"는 지원되지 않는 위젯입니다.`);
      return null;
    }

    return {
      type: components[componentType],
      key,
      props: {
        el: el.outerHTML,
        cjvKey: key,
        ...props,
      },
      children: [],
    };
  };

  const extractProps = (el) => {
    const props = {};
    Array.from(el.attributes).forEach((attr) => {
      const { name, value } = attr;
      if (name !== "cjt-comp" && !name.startsWith("on")) {
        props[name] =
          value === "" || value === "true" || value === name
            ? true
            : value === "false"
            ? false
            : !isNaN(Number(value))
            ? Number(value)
            : value;
      }
    });
    return props;
  };

  const initializePage = async (rootElement) => {
    const componentTree = await createComponentTree(rootElement);

    componentTree.forEach((component) => {
      if (component) {
        controlStore.addWidget(component);
      }
    });

    dynamicComponents.value = componentTree.filter(Boolean);

    rootElement.querySelectorAll("[cjt-comp]").forEach((el) => el.remove());
  };

  return {
    dynamicComponents,
    initializePage,
    createComponentTree,
    createComponentInfo,
    extractProps,
  };
}

// 동적 컴포넌트 템플릿 생성
export function convertTemplates(template) {
  const events = [
    "click",
    "dblclick",
    "mousedown",
    "mouseup",
    "mousemove",
    "mouseenter",
    "mouseleave",
    "mouseover",
    "mouseout",
    "keydown",
    "keyup",
    "keypress",
    "change",
    "input",
    "submit",
    "reset",
    "focus",
    "blur",
    "dragstart",
    "drag",
    "dragend",
    "dragenter",
    "dragleave",
    "dragover",
    "drop",
    "touchstart",
    "touchmove",
    "touchend",
    "touchcancel",
    "scroll",
    "resize",
    "contextmenu",
    "wheel",
  ];

  let result = template;
  const firstTagIndex = result.indexOf(">");
  if (firstTagIndex !== -1) {
    const insertPosition = firstTagIndex;
    const eventAttributes = events
      .map((event) => `@${event}="onEvent('${event}', $event)"`)
      .join(" ");
    result =
      result.slice(0, insertPosition) +
      " " +
      eventAttributes +
      result.slice(insertPosition);
  }
  return result;
}

export function createWidget(options) {
  return defineComponent({
    name: options.name || "DynamicWidget",
    props: {
      cjvKey: {
        type: String,
        required: true,
      },
      el: {
        type: String,
        required: true,
      },
      ...options.props,
    },
    emits: ["update:modelValue", ...Object.keys(options.emits || {})],
    setup(props, context) {
      const widgetStore = useWidgetStore();

      const setupResult = options.setup ? options.setup(props, context) : {};

      function onEvent(eventName, event) {
        const fullEventName = `on${
          props.cjvKey.charAt(0).toUpperCase() + props.cjvKey.slice(1)
        }${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
        if (widgetStore.hasEvent(fullEventName)) {
          widgetStore.executeEvent(fullEventName, event);
        }
        context.emit(eventName, event);
      }

      const dynamicComponent = markRaw({
        template: convertTemplates(props.el),
        setup() {
          return {
            ...setupResult,
            onEvent,
          };
        },
      });

      return {
        dynamicComponent,
      };
    },
    template:
      '<component :is="dynamicComponent" v-bind="$props" v-on="$listeners" />',
  });
}

export default {
  convertTemplates,
  createWidget,
  useComponentTree,
};
