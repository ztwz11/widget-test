<script>
import { ref, onMounted, onUpdated } from "vue";

export default {
  props: {
    el: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const show = ref(false);
    const content = ref(null);

    const toggleShow = () => {
      show.value = !show.value;
      console.log("Toggle Show:", show.value);
    };

    const bindEventListeners = () => {
      if (content.value) {
        const buttons = content.value.querySelectorAll(
          "button[onclick='toggleShow']"
        );
        buttons.forEach((button) => {
          button.addEventListener("click", toggleShow);
          button.removeAttribute("onclick"); // onclick 속성 제거
        });
      }
    };

    onMounted(() => {
      if (content.value) {
        content.value.innerHTML = props.el; // 동적으로 HTML을 삽입
        bindEventListeners();
      }
    });

    onUpdated(() => {
      bindEventListeners();
    });

    return {
      show,
      content,
    };
  },
  render(h) {
    return h("div", { ref: "content" });
  },
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
