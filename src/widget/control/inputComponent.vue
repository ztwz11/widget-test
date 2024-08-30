<template>
  <component
    :is="dynamicComponent"
    ref="dynamicComponentRef"
    v-bind="$attrs"
    @input="onInput"
    :value="inputValue"
  />
</template>

<script>
import { ref, watch } from "vue";
import {
  createWidgetComponent,
  createDynamicComponent,
} from "../../common/common";
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

    const inputValue = ref("");

    watch(
      () => widgets.value[props.cjvKey]?.value,
      (newVal) => {
        if (newVal !== undefined) {
          inputValue.value = newVal;
        }
      },
      { immediate: true }
    );

    const { dynamicComponentRef, dynamicComponent } = createDynamicComponent(
      props,
      context
    );

    function onInput(event) {
      inputValue.value = event.target.value;
      controlStore.setWidget(props.cjvKey, inputValue.value);
    }

    return {
      dynamicComponent,
      dynamicComponentRef,
      inputValue,
      onInput,
    };
  },
});
</script>
