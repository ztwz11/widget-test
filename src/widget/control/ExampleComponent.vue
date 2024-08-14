<script>
export default {
  name: "ExampleButton",
  props: {
    label: {
      type: String,
      default: "버튼",
    },
    onClick: {
      type: Function,
      required: true,
    },
  },
  methods: {
    handleClick() {
      this.onClick();
    },
  },
  render() {
    return <button onClick={this.handleClick}>{this.label}</button>;
  },
};
</script>

<style scoped>
button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
}

button:hover {
  background-color: #45a049;
}
</style>
