<template>
  <InputWidget
    ref="inputWidgetRef"
    :cjvKey="cjvKey"
    :el="el"
    :value="inputValue"
    @input="onInput"
    v-bind="info"
  />
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from "vue";
import { createWidget } from "../../common/common";
import { useControlStore } from "../../store/controlStore";
import { storeToRefs } from "pinia";

/**
 * @typedef {Object} InputInfo
 * @property {string} type - 입력 필드의 타입 (예: 'text', 'number' 등)
 * @property {string} placeholder - 입력 필드의 플레이스홀더 텍스트
 * @property {boolean} disabled - 입력 필드의 비활성화 여부
 * @property {boolean} required - 입력 필드의 필수 입력 여부
 * @property {number} minLength - 입력 값의 최소 길이
 * @property {number} maxLength - 입력 값의 최대 길이
 */

/**
 * InputComponent의 props 정의
 * @type {Object}
 * @property {string} cjvKey - 위젯의 고유 키
 * @property {string} el - 위젯의 HTML 템플릿
 * @property {string|number} modelValue - v-model을 위한 입력 값
 * @property {InputInfo} info - 입력 필드의 추가 정보
 */
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

/**
 * InputComponent의 이벤트 정의
 * @type {string[]}
 */
const emit = defineEmits([
  "update:modelValue",
  "input",
  "change",
  "focus",
  "blur",
]);

// 컨트롤 스토어 초기화
const controlStore = useControlStore();
// 위젯 상태를 반응형으로 가져오기
const { widgets } = storeToRefs(controlStore);
// 입력 값을 저장할 반응형 변수
const inputValue = ref(props.modelValue);

// 컴포넌트 참조를 위한 ref 생성
const inputWidgetRef = ref(null);

/**
 * InputWidget 컴포넌트 생성
 * @type {import('vue').Component}
 */
const InputWidget = createWidget({
  name: "InputComponent",
  props,
  emits: emit,
  setup(props, { emit }) {
    // 위젯 값 변경 감지
    watch(
      () => widgets.value[props.cjvKey]?.value,
      (newVal) => {
        if (newVal !== undefined) {
          inputValue.value = newVal;
        }
      },
      { immediate: true }
    );

    /**
     * 입력 이벤트 핸들러
     * @param {Event} event - 입력 이벤트 객체
     */
    const onInput = (event) => {
      // 이벤트 타겟의 값을 가져옴
      const value = event.target.value;
      // inputValue 업데이트
      inputValue.value = value;
      // 컨트롤 스토어의 위젯 값 업데이트
      controlStore.setWidget(props.cjvKey, value);
      // v-model 업데이트를 위한 이벤트 발생
      emit("update:modelValue", value);
      // input 이벤트 발생
      emit("input", event);
    };

    // setup 함수에서 반환할 객체
    return {
      inputValue,
      onInput,
    };
  },
});
</script>
