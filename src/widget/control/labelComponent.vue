<template>
  <labelWidget
    ref="labelWidgetRef"
    :cjvKey="cjvKey"
    :el="el"
    :text="labelValue"
    v-bind="setOption"
  />
</template>

<script setup>
import {
  ref,
  watch,
  defineProps,
  defineEmits,

  // computed,
} from "vue";
import { createWidget } from "../../common/common";
import { useControlStore } from "../../store/controlStore";
import { storeToRefs } from "pinia";

const emit = defineEmits(["update:modelValue", "change", "focus"]);

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

const controlStore = useControlStore();
const { widgets } = storeToRefs(controlStore);
const labelValue = ref("");

const labelWidget = createWidget({
  name: "labelComponent",
  props: props,
  emits: emit,
  setup() {
    return {
      labelValue,
    };
  },
});

watch(
  () => widgets.value[props.cjvKey]?.value,
  (newVal) => {
    if (newVal !== undefined) {
      labelValue.value = newVal;
    }
  },
  { immediate: true }
);
</script>
