<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <BasePage />
</template>

<script>
import BasePage from "./pages/Layout/BasePage.vue";

export default {
  name: "App",
  components: {
    BasePage,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
