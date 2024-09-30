<template>
  <anchorWidget
    ref="anchorWidgetRef"
    :cjvKey="cjvKey"
    :el="el"
    :value="linkValue"
    v-bind="$attrs"
  />
</template>

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

const linkValue = computed(() => {
  return widgets.value[props.cjvKey]?.value;
});

const anchorWidget = createWidget({
  name: "anchorComponent",
  props,
  emits: emit,
  setup(props, { emit }) {
    const onClick = (event) => {
      emit("click", event);
    };

    return {
      linkValue,
      onClick,
    };
  },
});

// Expose the onEvent method
const anchorWidgetRef = ref(null);
defineExpose({
  onEvent: (eventName, event) =>
    anchorWidgetRef.value?.onEvent(eventName, event),
});
</script>
