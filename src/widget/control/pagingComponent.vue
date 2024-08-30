<template>
  <div
    :class="['paginate', { 'hide-arrows': options.firstAndLastPaginationHide }]"
  >
    <a
      v-if="!options.firstAndLastPaginationHide || options.currentPage !== 1"
      class="first"
      @click="goToPage(1, $event)"
      >[&lt;&lt;]</a
    >
    <a class="prev" @click="goToPage(prevPage, $event)">[&lt;]</a>
    <template v-for="page in displayedPages" :key="page">
      <a
        href="javascript:;"
        :class="{ active: page === options.currentPage }"
        @click="goToPage(page, $event)"
      >
        <strong v-if="page === options.currentPage">{{ page }}</strong>
        <template v-else>{{ page }}</template>
      </a>
    </template>
    <a class="next" @click="goToPage(nextPage, $event)">[&gt;]</a>
    <a
      v-if="
        !options.firstAndLastPaginationHide ||
        options.currentPage !== totalPages
      "
      class="last"
      @click="goToPage(totalPages, $event)"
      >[&gt;&gt;]</a
    >
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useControlStore } from "@/store/controlStore";
import { useWidgetStore } from "@/store/widgetStore";

export default {
  name: "PagingComponent",
  props: {
    cjvKey: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const controlStore = useControlStore();
    const options = ref({
      totalItems: 0,
      pageSize: 20,
      maxPages: 10,
      currentPage: 1,
      firstAndLastPaginationHide: false,
    });

    onMounted(() => {
      const widgetOptions = controlStore.getWidget(props.cjvKey);
      if (widgetOptions) {
        options.value = { ...options.value, ...widgetOptions };
      }
    });

    watch(
      () => controlStore.getWidget(props.cjvKey),
      (newOptions) => {
        if (newOptions) {
          options.value = { ...options.value, ...newOptions };
        }
      },
      { deep: true }
    );

    const totalPages = computed(() =>
      Math.ceil(options.value.totalItems / options.value.pageSize)
    );

    const displayedPages = computed(() => {
      const halfMax = Math.floor(options.value.maxPages / 2);
      let start = Math.max(options.value.currentPage - halfMax, 1);
      let end = Math.min(start + options.value.maxPages - 1, totalPages.value);

      if (end - start + 1 < options.value.maxPages) {
        start = Math.max(end - options.value.maxPages + 1, 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });

    const prevPage = computed(() => Math.max(1, options.value.currentPage - 1));
    const nextPage = computed(() =>
      Math.min(totalPages.value, options.value.currentPage + 1)
    );

    const goToPage = (page, event) => {
      if (
        page !== options.value.currentPage &&
        page >= 1 &&
        page <= totalPages.value
      ) {
        const store = useWidgetStore();
        const eventName = `on${props.cjvKey}${event.target.innerText
          .trim()
          .charAt(0)
          .toUpperCase()}Change`;
        store.executeEvent(eventName, page);
      }
    };

    return {
      options,
      totalPages,
      displayedPages,
      prevPage,
      nextPage,
      goToPage,
    };
  },
};
</script>

<style scoped>
.paginate {
  display: flex;
  justify-content: center;
  align-items: center;
}

.paginate a {
  margin: 0 5px;
  cursor: pointer;
}

.paginate a.active {
  font-weight: bold;
}

.hide-arrows .first,
.hide-arrows .last {
  display: none;
}
</style>
