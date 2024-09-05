<template>
  <div class="grid-component" v-html="renderedGrid"></div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from "vue";
//import * as componentMap from "../../widget/control";

const props = defineProps({
  el: {
    type: String,
    required: true,
  },
  cjvKey: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
});

const renderedGrid = ref("");
const gridStructure = ref(null);

onMounted(() => {
  parseGridStructure();
  renderGrid();
});

watch(() => props.data, renderGrid, { deep: true });

function parseGridStructure() {
  const parser = new DOMParser();
  const doc = parser.parseFromString(props.el, "text/html");
  const gridElement = doc.body.firstElementChild;

  if (!gridElement) {
    console.error("Invalid grid structure");
    return;
  }

  const headerRow = gridElement.querySelector("thead tr");
  const bodyTemplate = gridElement.querySelector('[cjt-grid-targert="true"]');
  const rowTemplate = bodyTemplate ? bodyTemplate.firstElementChild : null;

  if (!headerRow || !rowTemplate) {
    console.error("Invalid grid structure: missing header or row template");
    return;
  }

  gridStructure.value = {
    rootElement: gridElement.cloneNode(true),
    headerRow: headerRow.cloneNode(true),
    rowTemplate: rowTemplate.cloneNode(true),
  };
}

function renderGrid() {
  if (!gridStructure.value) return;

  const { rootElement, headerRow, rowTemplate } = gridStructure.value;
  const tbody = rootElement.querySelector("tbody");
  tbody.innerHTML = "";

  // Render header
  rootElement.querySelector("thead").appendChild(headerRow);

  // Render rows
  props.data.forEach((item) => {
    const row = rowTemplate.cloneNode(true);
    Array.from(row.children).forEach((cell) => {
      const colId = cell.getAttribute("cjt-grid-col-id");
      if (colId && item[colId] !== undefined) {
        cell.textContent = item[colId];
      }
    });
    tbody.appendChild(row);
  });

  renderedGrid.value = rootElement.outerHTML;
}

// 추가: 데이터 업데이트 함수 (필요한 경우 사용)
//   function updateItem(index, field, value) {
//     if (props.data[index]) {
//       props.data[index][field] = value;
//       renderGrid();
//     }
//   }
</script>

<style scoped>
.grid-component {
  font-family: Arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.grid-component table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.grid-component th,
.grid-component td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
  text-align: left;
}

.grid-component thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
  background-color: #f8f9fa;
  font-weight: bold;
  color: #495057;
}

.grid-component tbody + tbody {
  border-top: 2px solid #dee2e6;
}

.grid-component tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, 0.05);
}

.grid-component tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

/* Responsive styles */
@media screen and (max-width: 600px) {
  .grid-component table {
    border: 0;
  }

  .grid-component table caption {
    font-size: 1.3em;
  }

  .grid-component table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .grid-component table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  .grid-component table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
  }

  .grid-component table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  .grid-component table td:last-child {
    border-bottom: 0;
  }
}
</style>
