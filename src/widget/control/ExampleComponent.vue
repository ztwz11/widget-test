<template>
    <div class="example-component">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ExampleComponent',
    props: {
      title: {
        type: String,
        default: 'Example Title'
      },
      description: {
        type: String,
        default: 'This is an example description.'
      }
    }
  }
  </script>
  
  <style scoped>
  .example-component {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px;
  }
  </style>
  