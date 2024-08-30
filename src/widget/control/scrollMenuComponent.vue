<template>
  <div class="sideBann" :class="{ fixed: isFixed }" :style="bannerStyle"></div>
</template>

<script>
export default {
  data() {
    return {
      floatPosition: 50, // 기본 위치(top)값
      bannerTop: 50,
      isFixed: false,
      containerOffset: 0,
    };
  },
  computed: {
    bannerStyle() {
      if (this.isFixed) {
        return { top: this.floatPosition + "px" };
      } else {
        return { top: this.bannerTop + "px" };
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    // container 요소의 offset을 계산합니다.
    const container = document.getElementById("container");
    if (container) {
      this.containerOffset = container.offsetTop + 300;
    }
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const currentTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // fixed/absolute 상태 결정
      this.isFixed = currentTop >= this.containerOffset;

      // absolute 상태일 때만 top 값을 업데이트
      if (!this.isFixed) {
        this.bannerTop = currentTop + this.floatPosition;
      }
    },
  },
};
</script>

<style scoped>
.sideBann {
  position: absolute;
  width: 150px;
  height: 150px;
  background-color: #d2df1e;
  color: #fff;
  transition: top 0.5s;
}

.sideBann.fixed {
  position: fixed;
}
</style>
