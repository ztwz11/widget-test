<template>
  <input
    ref="testinputComponent"
    :value="inputValue"
    :placeholder="placeholder"
    :type="type"
    :required="required"
    :minlength="minLength"
    :maxlength="maxLength"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    v-bind="$attrs"
  />
  <span v-if="!isValid" class="error-message">입력이 유효하지 않습니다.</span>
</template>
<script setup>
import {
  ref,
  computed,
  watch,
  defineProps,
  defineEmits,
  defineExpose,
} from "vue";
import { useControlStore } from "../../store/controlStore";
import { storeToRefs } from "pinia";
import { endMeasure } from "../../common/performance";

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
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  required: {
    type: Boolean,
    default: false,
  },
  minLength: {
    type: Number,
    default: 0,
  },
  maxLength: {
    type: Number,
    default: Infinity,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "input",
  "change",
  "focus",
  "blur",
]);

const controlStore = useControlStore();
const { widgets } = storeToRefs(controlStore);

const inputValue = ref(props.modelValue);
const testinputComponent = ref(null);

const isValid = computed(() => {
  if (props.required && !inputValue.value) return false;
  if (inputValue.value.length < props.minLength) return false;
  if (inputValue.value.length > props.maxLength) return false;
  return true;
});

watch(
  () => widgets.value[props.cjvKey]?.value,
  (newVal) => {
    if (newVal !== undefined) {
      inputValue.value = newVal;
      endMeasure("eventTime");
    }
  },
  { immediate: true }
);

const handleInput = (event) => {
  const value = event.target.value;
  inputValue.value = value;
  emit("update:modelValue", value);
  emit("input", event);
};

const handleChange = (event) => {
  emit("change", event);
};

const handleFocus = (event) => {
  emit("focus", event);
};

const handleBlur = (event) => {
  emit("blur", event);
};

const focus = () => {
  testinputComponent.value?.focus();
};

// 외부에서 접근 가능한 메서드 노출
defineExpose({
  focus,
  isValid,
});
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}
</style>
