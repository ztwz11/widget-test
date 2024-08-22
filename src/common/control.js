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
        const widget = store.getWidget(key);
        if (widget) {
          widget.value = value;
        }
      },
      // 필요한 다른 메서드들...
    };
  },

  getAllWidgets() {
    initializeStore();
    return store.getAllWidgets();
  },

  executeMethod(methodName, ...args) {
    initializeStore();
    return store.executeMethod(methodName, ...args);
  },
};
