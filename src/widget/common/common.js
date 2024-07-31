export default {
  registerEvents(appElement, eventHandlers) {
    const components = Object.keys(eventHandlers);

    components.forEach((component) => {
      const eventName = `on${
        component.charAt(0).toUpperCase() + component.slice(1)
      }Click`;
      appElement.addEventListener(eventName, eventHandlers[component]);
    });
  },

  createCustomComponent(tagName, template, methods = {}) {
    class CustomComponent extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = template;
        this.methods = methods;
        this.bindMethods();
      }

      bindMethods() {
        Object.keys(this.methods).forEach((methodName) => {
          this[methodName] = this.methods[methodName].bind(this);
          const elements = this.shadowRoot.querySelectorAll(
            `[data-method="${methodName}"]`
          );
          elements.forEach((element) => {
            element.addEventListener("click", this[methodName]);
          });
        });
      }
    }

    customElements.define(tagName, CustomComponent);
  },
};
