<template>
  <component :is="dynamicComponent" ref="dynamicComponentRef" v-bind="$attrs" />
</template>

<script>
import { computed, getCurrentInstance, ref } from "vue";
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
    const valueStore = useControlStore();
    const { widgets } = storeToRefs(valueStore);
    const widgetValue = computed(() => {
      console.log("widgetvalue", widgets.getWidget(props.cjvKey).value);
      return widgets.getWidget(props.cjvKey).value;
    });

    const dynamicComponentRef = ref(null);

    const dynamicComponent = computed(() => ({
      template: convertTemplates(props.el),
      setup() {
        const store = useWidgetStore();
        const currentInstance = getCurrentInstance();

        function onEvent(eventName, event) {
          console.log(`Event triggered: ${eventName}`); // 디버깅용 로그
          const fullEventName = `on${
            props.cjvKey.charAt(0).toUpperCase() + props.cjvKey.slice(1)
          }${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
          if (store.hasEvent(fullEventName)) {
            console.log(`Executing store event: ${fullEventName}`); // 디버깅용 로그
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
          show: computed(() => widgetValue),
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
