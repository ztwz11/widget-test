<template>
  <InputWidget
    ref="inputWidgetRef"
    :cjvKey="cjvKey"
    :el="el"
    :value="inputValue"
    @input="onInput"
    v-bind="setOption"
  />
</template>

<script setup>
import {
  ref,
  watch,
  defineProps,
  defineEmits,
  defineExpose,
  // computed,
} from "vue";
import { createWidget } from "../../common/common";
import { useControlStore } from "../../store/controlStore";
import { storeToRefs } from "pinia";

const emit = defineEmits([
  "update:modelValue",
  "input",
  "change",
  "focus",
  "blur",
]);

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
const inputValue = ref(props.modelValue);

const InputWidget = createWidget({
  name: "InputComponent",
  props: props,
  emits: emit,
  setup() {
    return {
      inputValue,
    };
  },
});

watch(
  () => widgets.value[props.cjvKey]?.value,
  (newVal) => {
    if (newVal !== undefined) {
      inputValue.value = newVal;
    }
  },
  { immediate: true }
);

const onInput = (event) => {
  const value = event.target.value;
  inputValue.value = value;
  controlStore.setWidget(props.cjvKey, value);
};

// const setOption = computed(() => ({
//   const info = widgets.value[props.cjvKey]?.value;
//   if (info.readonly !== undefined) {
//      useReadOnly(info.readonly);
//   }

//   if (info.inputType !== undefined) {
//     useNumberOnly(info.inputType);
//   }

//   return info;
// }));

// const inputAttrs = computed(() => ({
//   ...readOnlyAttr.value,
//   // ... 기타 속성
// }));

// // 1. readonly 옵션 함수
// function useReadOnly(isReadOnly = false) {
//   return {
//     readonly: isReadOnly,
//     readOnlyAttr: computed(() => (isReadOnly ? { readonly: true } : {})),
//   };
// }

// // 2. 숫자만 입력 허용 함수
// function useNumberOnly() {
//   const filterNumber = (value) => {
//     return value.replace(/[^0-9]/g, "");
//   };

//   const onNumberInput = (event) => {
//     const input = event.target;
//     const filteredValue = filterNumber(input.value);
//     input.value = filteredValue;
//     return filteredValue;
//   };

//   return {
//     onNumberInput,
//   };
// }

defineExpose({ inputValue: inputValue });
</script>
