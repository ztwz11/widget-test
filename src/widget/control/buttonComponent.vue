<script setup>
import { ref, computed, defineExpose, defineProps, defineEmits } from "vue";
import { createWidget } from "../../common/common";
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

const emit = defineEmits(["click"]);

const controlStore = useControlStore();
const { widgets } = storeToRefs(controlStore);

const buttonValue = computed(() => {
  return widgets.value[props.cjvKey]?.value;
});

const ButtonWidget = createWidget({
  name: "ButtonComponent",
  props,
  emits: emit,
  setup(props, { emit }) {
    const onClick = (event) => {
      emit("click", event);
    };

    return {
      buttonValue,
      onClick,
    };
  },
});

// Expose the onEvent method
const buttonWidgetRef = ref(null);
defineExpose({
  onEvent: (eventName, event) =>
    buttonWidgetRef.value?.onEvent(eventName, event),
});
</script>

<template>
  <ButtonWidget
    ref="buttonWidgetRef"
    :cjvKey="cjvKey"
    :el="el"
    :value="buttonValue"
    v-bind="$attrs"
  />
</template>
