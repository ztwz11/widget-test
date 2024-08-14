<script>
export default {
  name: "ExampleComponent",
  props: {
    title: {
      type: String,
      default: "Example Title",
    },
    description: {
      type: String,
      default: "This is an example description.",
    },
  },
  render(h) {
    return h("div", { class: "example-component" }, [
      h("h1", this.title),
      h("p", this.description),
    ]);
  },
};
</script>

<style scoped>
.example-component {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
}
</style>
