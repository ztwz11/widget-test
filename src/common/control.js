// storeInterface.js
import { useControlStore } from "../store/controlStore";
import { startMeasure, endMeasure, getMeasure } from "./performance";

let store;

function initializeStore() {
  store = useControlStore();
}

export const control = {
  init() {
    initializeStore();
  },

  addWidget(widget) {
    initializeStore();
    store.addWidget(widget);
  },

  getWidget(key) {
    initializeStore();
    return {
      getValue: () => {
        const widget = store.getWidget(key);
        return widget ? widget.value : undefined;
      },
      setValue: (value) => {
        const widget = store.setWidget(key, value);
        if (widget) {
          widget.value = value;
        }
      },
    };
  },

  getAllWidgets() {
    initializeStore();
    return store.getAllWidgets();
  },
  setTimeCheckStart(value) {
    return startMeasure(value);
  },

  setTimeCheckEnd(value) {
    return endMeasure(value);
  },

  getTimeCheck(value) {
    return getMeasure(value);
  },
};
