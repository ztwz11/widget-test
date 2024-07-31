<template>
  <div>
    <component
      v-for="(component, index) in components"
      :is="component.type"
      :key="index"
      v-bind="component.props"
    ></component>
  </div>
</template>

<script>
import ExampleComponent from "../../widget/control/ExampleComponent.vue";
import ExampleButton from "../../widget/control/ExampleButton.vue";

export default {
  name: "BasePage",
  data() {
    return {
      components: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log("stop");
      const elements = document.querySelectorAll("[chunjae-cid]");
      elements.forEach((el) => {
        const cid = el.getAttribute("chunjae-cid");
        let component = null;

        switch (cid) {
          case "exampleComponent":
            component = {
              type: ExampleComponent,
              props: { title: "타이틀", description: "설명" },
            };
            break;
          case "exampleButton":
            component = {
              type: ExampleButton,
              props: {
                onClick: this.addButtonComponent,
                label: "눌러요",
              },
            };
            break;
          // 다른 컴포넌트도 추가
        }

        if (component) {
          this.components.push(component);
          el.remove();
        }
      });
    },
    addButtonComponent() {
      this.components.push({
        type: ExampleButton,
        props: {
          onClick: this.addButtonComponent,
        },
      });
    },
  },
};
</script>
