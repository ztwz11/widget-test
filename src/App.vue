<script>
import BasePage from "./pages/Base/BasePage.vue";

export default {
  name: "App",
  components: {
    BasePage,
  },
  render(h) {
    return h("div", [
      h("img", { attrs: { alt: "Vue logo", src: "./assets/logo.png" } }),
      h(BasePage),
    ]);
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
