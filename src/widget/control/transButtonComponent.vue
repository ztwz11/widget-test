<template>
  <dynamic-component />
</template>

// script
<script>
//import { ref } from "vue";

const dynamicComponent = {
  template: `<div>dynamic-component {{ message }}</div>`,
  data: () => ({
    message: "created!",
  }),
};
export default {
  components: { dynamicComponent },
};

// export default {
//   setup() {
//     const show = ref(false);

//     const toggleShow = () => {
//       show.value = !show.value;
//     };

//     return {
//       show,
//       toggleShow,
//     };
//   },
//   props: {
//     el: {
//       type: String,
//       required: true,
//     },
//   },
// };
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
