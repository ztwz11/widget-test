<template>
  <TransButtonWidget
    :is="dynamicComponent"
    ref="dynamicComponentRef"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed, ref, toRef, defineExpose } from "vue";
import { createWidget, convertTemplates } from "../../common/common";
import { useControlStore } from "../../store/controlStore";
import { storeToRefs } from "pinia";

const TransButtonWidget = createWidget({
  name: "TransButtonComponent",
  setup(props) {
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
        return {
          show: toRef(widgetValue),
        };
      },
    }));

    return {
      dynamicComponent,
      dynamicComponentRef,
      widgetValue,
    };
  },
});

// Expose the onEvent method and dynamicComponent
const transButtonWidgetRef = ref(null);
defineExpose({
  onEvent: () => transButtonWidgetRef.value?.onEvent,
  dynamicComponent: () => transButtonWidgetRef.value?.dynamicComponent,
});
</script>
