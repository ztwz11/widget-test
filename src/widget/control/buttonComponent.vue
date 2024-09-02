<template>
  <component :is="dynamicComponent" ref="dynamicComponentRef" v-bind="$attrs" />
</template>

<script setup>
import { computed, getCurrentInstance, ref, defineProps } from "vue";
import { convertTemplates } from "../../common/common";
import { useWidgetStore } from "../../store/widgetStore";
import { useControlStore } from "../../store/controlStore";
import { storeToRefs } from "pinia";

const props = defineProps({
  cjvKey: {
    type: String,
    required: true,
  },
  el: {
    type: String,
    required: true,
  },
});

const valueStore = useControlStore();
const { widgets } = storeToRefs(valueStore);
const widgetValue = computed(() => {
  console.log("widgetvalue", widgets.value.getWidget(props.cjvKey).value);
  return widgets.value.getWidget(props.cjvKey).value;
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
        store.executeEvent.apply(null, [fullEventName, event, currentInstance]);
      }
      // emit(eventName, event);
    }

    // emit("event", onEvent);

    return {
      onEvent,
      show: computed(() => widgetValue.value),
    };
  },
}));
</script>
