<!-- Contents.vue -->
<template>
  <component
    v-for="(component, index) in dynamicComponents"
    :is="component.type"
    :key="index"
    v-bind="component.props"
  />
</template>

<script setup>
// import { onMounted, defineProps } from "vue";
// import { useComponentTree } from "../../common/common";

// const props = defineProps({
//   htmlContent: {
//     type: String,
//     required: true,
//   },
// });

// const { dynamicComponents, initializePage } = useComponentTree();

// onMounted(() => {
//   const contentsRoot = document.createElement("div");
//   contentsRoot.innerHTML = props.htmlContent;
//   initializePage(contentsRoot);

//   const rootElement = document.getElementById("contents");

//   if (rootElement) {
//     rootElement.appendChild(contentsRoot);
//   }
// });
</script>
