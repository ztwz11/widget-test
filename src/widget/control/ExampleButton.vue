<template>
  <button @click="handleClick">{{ label }}</button>
</template>

<script>
export default {
  name: "ExampleButton",
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      default: "버튼",
    },
  },
  methods: {
    handleClick() {
      this.onClick();
    },
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
