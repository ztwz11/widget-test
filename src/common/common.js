import { defineComponent, ref, computed, getCurrentInstance } from "vue";
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
    const componentElements = element.querySelectorAll("[cjv-component]");

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
    const componentType = el.getAttribute("cjv-component");
    const key =
      el.getAttribute("cjv-key") || Math.random().toString(36).substring(2, 9);
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
      if (name !== "cjv-component" && !name.startsWith("on")) {
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

    rootElement
      .querySelectorAll("[cjv-component]")
      .forEach((el) => el.remove());
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

//동적 위젯 생성 공통 함수
export function createWidgetComponent(options) {
  return defineComponent({
    name: options.name,
    props: {
      cjvKey: {
        type: String,
        required: true,
      },
      el: {
        type: String,
        required: false,
      },
      ...options.props,
    },
    setup(props, context) {
      const store = useWidgetStore();
      const customSetup = options.setup ? options.setup(props, context) : {};

      function onEvent(eventName, event) {
        console.log(`Event triggered: ${eventName}`); // 디버깅용 로그
        const fullEventName = `on${props.cjvKey}${
          eventName.charAt(0).toUpperCase() + eventName.slice(1)
        }`;
        if (store.hasEvent(fullEventName)) {
          console.log(`Executing store event: ${fullEventName}`); // 디버깅용 로그
          store.executeEvent(fullEventName, event).bind(store);
        }
        context.emit(eventName, event);
      }

      context.emit("event", onEvent);

      return {
        ...customSetup,
        onEvent,
      };
    },
  });
}

//동적 생성 위젯 이벤트호출 로직
export function createDynamicComponent(props, context) {
  const dynamicComponentRef = ref(null);

  const dynamicComponent = computed(() => ({
    template: convertTemplates(props.el),
    setup() {
      const store = useWidgetStore();
      const currentInstance = getCurrentInstance();

      function onEvent(eventName, event) {
        console.log(`Event triggered: ${eventName}`);
        const fullEventName = `on${
          props.cjvKey.charAt(0).toUpperCase() + props.cjvKey.slice(1)
        }${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
        if (store.hasEvent(fullEventName)) {
          console.log(`Executing store event: ${fullEventName}`);
          store.executeEvent.apply(this, [
            fullEventName,
            event,
            currentInstance,
          ]);
        }
        context.emit(eventName, event);
      }

      context.emit("event", onEvent);
      return {
        onEvent,
      };
    },
  }));

  return {
    dynamicComponentRef,
    dynamicComponent,
  };
}

export default {
  convertTemplates,
  createWidgetComponent,
  createDynamicComponent,
  useComponentTree,
};
