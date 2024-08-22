import { defineComponent } from "vue";
import { useWidgetStore } from "../store/widgetStore";

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

export default { convertTemplates, createWidgetComponent };
