<script>
import {
  ExampleComponent,
  ExampleButton,
  transButtonComponent,
} from "../../widget/control";

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
      console.log("Parsing HTML elements...");

      const elements = document.querySelectorAll("[chunjae-cid]");
      elements.forEach((el) => {
        const cid = el.getAttribute("chunjae-cid");
        const key =
          el.getAttribute("key") || Math.random().toString(36).substr(2, 9);
        const events = this.extractEvents(el);
        const props = this.extractProps(el);

        let component = null;

        switch (cid) {
          case "exampleComponent":
            component = (
              <ExampleComponent
                key={key}
                {...props}
                {...events}
                title="타이틀"
                description="설명"
              />
            );
            break;
          case "exampleButton":
            component = (
              <ExampleButton
                key={key}
                {...props}
                {...events}
                onClick={this.addButtonComponent}
                label="눌러요"
              />
            );
            break;
          case "transButtonComponent":
            component = (
              <transButtonComponent
                key={key}
                el={el.outerHTML}
                {...props}
                {...events}
              />
            );
            break;
          // 다른 컴포넌트도 추가
        }

        if (component) {
          this.components.push(component);
          el.remove();
        }
      });
    },

    extractEvents(el) {
      const eventProps = {};
      const eventAttributes = ["onclick", "onchange", "oninput"];

      eventAttributes.forEach((attr) => {
        const eventName = attr.slice(2); // "onClick"에서 "click"만 추출
        if (el.hasAttribute(attr)) {
          eventProps[eventName] = this[el.getAttribute(attr)].bind(this);
        }
      });

      return eventProps;
    },

    extractProps(el) {
      const propAttributes = ["key"];
      const props = {};

      propAttributes.forEach((attr) => {
        if (el.hasAttribute(attr)) {
          props[attr] = el.getAttribute(attr);
        }
      });

      return props;
    },

    addButtonComponent() {
      this.components.push(<ExampleButton onClick={this.addButtonComponent} />);
    },
  },
  render() {
    return <div>{this.components}</div>;
  },
};
</script>
