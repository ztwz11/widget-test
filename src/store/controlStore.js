import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useControlStore = defineStore("control", () => {
  const widgets = reactive({});

  function addWidget(widget) {
    if (widget) {
      widgets[widget.props.cjvKey] = ref(widget);
    }
  }

  function getWidget(key) {
    return widgets[key];
  }

  function setWidget(key, value) {
    if (widgets[key]) {
      widgets[key].value = value;
    }
  }

  function getAllWidgets() {
    return Object.values(widgets);
  }

  return {
    widgets,
    addWidget,
    getWidget,
    setWidget,
    getAllWidgets,
  };
});
