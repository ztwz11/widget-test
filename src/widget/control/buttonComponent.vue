<template>
  <ButtonWidget
    ref="buttonWidgetRef"
    :cjvKey="cjvKey"
    :el="el"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed, ref, defineExpose } from "vue";
import { createWidget } from "../../common/common";
import { useControlStore } from "../../store/controlStore";
import { storeToRefs } from "pinia";

const valueStore = useControlStore();
const { widgets } = storeToRefs(valueStore);

const ButtonWidget = createWidget({
  name: "ButtonComponent",
  setup(props) {
    const widgetValue = computed(() => {
      console.log("widgetvalue", widgets.value.getWidget(props.cjvKey).value);
      return widgets.value.getWidget(props.cjvKey).value;
    });

    return {
      show: widgetValue,
    };
  },
});

// Expose the onEvent method
const buttonWidgetRef = ref(null);
defineExpose({
  onEvent: () => buttonWidgetRef.value?.onEvent,
});
</script>
