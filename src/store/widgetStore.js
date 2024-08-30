import { ref } from "vue";
import { defineStore } from "pinia";
import { control } from "../common/control";

export const useWidgetStore = defineStore("widget", {
  state: () => ({
    config: null,
    components: {},
    //TODO 정환: 제거하고 flat하게 관리할
    events: ref({}),
  }),
  actions: {
    setConfig(config) {
      this.config = config;
    },
    registerComponent(id, component) {
      this.components[id] = component;
    },

    setEvent(eventName, handler) {
      this.events[eventName] = handler;

      console.log(eventName + " clicked!", handler);
    },
    getEvent(eventName) {
      return this.events[eventName];
    },
    hasEvent(eventName) {
      return !!this.events[eventName];
    },
    executeEvent(eventName, ...args) {
      console.log(eventName + "executeEvent", args);
      if (this.hasEvent(eventName)) {
        control.init();
        return this.events[eventName].apply(control, args);
      }
    },
  },
});
