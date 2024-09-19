<template>
  <LabelWidget
    ref="labelWidgetRef"
    :cjvKey="cjvKey"
    :el="el"
    :value="labelValue"
    @change="onChange"
    @focus="onFocus"
    v-bind="info"
  />
</template>

<script setup>
import { ref, watch, defineExpose, defineProps, defineEmits } from "vue";
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
  modelValue: {
    type: [String, Number],
    default: "",
  },
  info: {
    type: Object,
    default() {
      return {
        type: "text",
        placeholder: "",
        disabled: false,
        required: false,
        minLength: 0,
        maxLength: String.MAX_SAFE_INTEGER,
      };
    },
  },
});

const emit = defineEmits(["update:modelValue", "change", "focus"]);

const controlStore = useControlStore();
const { widgets } = storeToRefs(controlStore);
const labelValue = ref("");

const LabelWidget = createWidget({
  name: "LabelComponent",
  props,
  emits: emit,
  setup(props, { emit }) {
    watch(
      () => widgets.value[props.cjvKey]?.value,
      (newVal) => {
        if (newVal !== undefined) {
          labelValue.value = newVal;
        }
      },
      { immediate: true }
    );

    const onChange = (event) => {
      emit("change", event);
    };

    const onFocus = (event) => {
      emit("focus", event);
    };

    return {
      labelValue,
      onChange,
      onFocus,
    };
  },
});

// Expose the onEvent method if needed
const labelWidgetRef = ref(null);
defineExpose({
  onEvent: (eventName, event) =>
    labelWidgetRef.value?.onEvent(eventName, event),
});
</script>
