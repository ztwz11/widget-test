<template>
  <component :is="dynamicComponent" ref="dynamicComponentRef" v-bind="$attrs" />
</template>

<script>
import { computed, getCurrentInstance, ref, toRef } from "vue";
import { createWidgetComponent, convertTemplates } from "../../common/common";
import { useWidgetStore } from "../../store/widgetStore";
import { useControlStore } from "../../store/controlStore";
import { storeToRefs } from "pinia";

export default createWidgetComponent({
  props: {
    cjvKey: {
      type: String,
      required: true,
    },
    el: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const controlStore = useControlStore();
    const { widgets } = storeToRefs(controlStore);

    const widgetValue = computed(() => {
      const widget = widgets.value[props.cjvKey];
      return widget ? widget.value : undefined;
    });

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
          show: toRef(widgetValue),
        };
      },
    }));

    return {
      dynamicComponent,
      dynamicComponentRef,
    };
  },
});
</script>
