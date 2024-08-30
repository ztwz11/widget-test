// storeInterface.js
import { useControlStore } from "../store/controlStore";

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
};
