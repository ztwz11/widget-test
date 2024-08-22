// store/index.js
import { defineStore } from "pinia";

export const useControlStore = defineStore("control", {
  state: () => ({
    widgets: {},
  }),
  actions: {
    addWidget(widget) {
      if (widget) {
        this.widgets[widget.props.cjvKey] = widget;
      } else {
        console.error("Widget must have a key property");
      }
    },

    getWidget(key) {
      return this.widgets[key];
    },

    getAllWidgets() {
      return Object.values(this.widgets);
    },

    executeMethod(methodName, ...args) {
      if (typeof window[methodName] === "function") {
        return window[methodName](...args);
      } else {
        console.error(`Method ${methodName} not found`);
      }
    },
  },
});
