<script setup>
import { ref } from 'vue';
import { VueGoodTable } from 'vue-good-table-next';
// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  className: { type: String, default: ''},
  classesNames: { type: Array, default: ()=>[] },
  columns: { type: Array, default: ()=>[] },
  rows: { type: Array, default: ()=>[] },
  searchOptions: { type: Object, default: ()=>({enabled: false}) },
  fixedHeader: { type: Boolean, default: false },
  sortOptions: { type: Object, default: ()=>({}) },
  paginationOptions: { type: Object, default: ()=>({}) },
  selectOptions: { type: Object, default: ()=>({}) },
  searchQuery: { type: String, default: '' },
  onSearch: { type: Function, default: ()=>{} },
  theme: { type: String, default: ''}
});

const rowOverId = ref(null);
const rowsSelectedIds = ref([]);

const selectionChanged = params => {
  // emits('selectionChanged', params);
  rowsSelectedIds.value = params.selectedRows.map(row => row.originalIndex);
};
const onRowClick = params => {};
const onRowMouseover = params => rowOverId.value = params.row.originalIndex;
const rowStyleClassFn = row => {
  const id = row.originalIndex;
  if (rowsSelectedIds.value.includes(id)) return 'vgt-row-selected';
  if (id === rowOverId.value) return 'vgt-row-hover';
};
</script>
<template>
  <div id="base-table" :class="['base-table', className, ...classesNames]">
    <vue-good-table
      :columns="columns || []"
      :rows="rows || []"
      :theme="theme || 'default'"
      styleClass="vgt-table condensed"
      :fixed-header="fixedHeader"
      :search-options="searchOptions.enabled ? {
        ...searchOptions,
        enabled: true,
        trigger: '',
        skipDiacritics: true,
        placeholder: 'Поиск по таблице',
        externalQuery: searchQuery || null,
      } : {
        enabled: false,
      }"
      v-on:search="onSearch"
      :select-options="{
        ...selectOptions,
        selectOnCheckboxOnly: true,
        selectionText: 'выбрано',
        clearSelectionText: 'Отменить выбор',
        selectionInfoClass: 'vgt__selected-info-panel'
      }"
      :pagination-options="{
        ...paginationOptions,
        nextLabel: 'Дальше',
        prevLabel: 'Назад',
        rowsPerPageLabel: 'Строк на странице',
        ofLabel: 'из',
        pageLabel: 'Страница',
        allLabel: 'Все',
      }"
      :sort-options="sortOptions"
      v-on:selected-rows-change="selectionChanged"
      v-on:row-mouseenter="onRowMouseover"
      v-on:row-click="onRowClick"
      :row-style-class="rowStyleClassFn"
    >
      <template #emptystate>
        Данные для таблицы отсутствуют или не успели загрузиться.
      </template>
      <template #selected-row-actions>
        <slot name="base-table-selected-row-actions"></slot>
      </template>
      <template #table-row="props">
        <slot name="base-table-table-row" v-bind="props"></slot>
      </template>
      <template #table-column="props">
        <slot name="base-table-column" v-bind="props"></slot>
      </template>
      <template #column-filter="props">
        <slot name="base-table-column-filter" v-bind="props"></slot>
      </template>
    </vue-good-table>
  </div>
</template>

<style lang="scss">
@import "../../../node_modules/vue-good-table-next/src/styles/style.scss";

.base-table {
  padding-top: 1%;
  padding-left: 1%;
  --table-border-color: rgb(221, 227, 230);
}
.vgt-row {
  &-hover {
    background-color: var(--tr-hover-color);
  }
  &-selected {
    background-color: var(--tr-selected-color);
  }
}
.vgt-table {
  & th{
    text-align: left;
    padding: 6px 6px;
  }
  & thead th {
    border-bottom: 3px var(--table-border-color) solid;
  }
}
.vgt__selected-info-panel {
  background-color: var(--tr-selected-color);
  height: 20px;
  padding-top: 10px;
  border-top: 3px var(--table-border-color) solid;
  border-bottom: 3px var(--table-border-color) solid;
}
.vgt-table thead th,
.vgt-wrap__footer{
  background: none;
  background-color: var(--closer-bg-color);
}
.vgt-selection-info-row {
  padding-left: 10px;
  padding-right: 5%; //TODO: % to calc
}
.table-btn {
  padding: 0px 0px;
  margin-top: -3px;
  width: 24px;
  height: 24px;
}
th.vgt-checkbox-col {
  padding: 3px !important;
  width: 12px;
  background: none !important;
  background-color: var(--closer-bg-color);
  border-bottom: 1px solid var(--table-border-color);
  & checkbox {
    margin: 0px;
    padding: 0px;
  }
}
.vgt-table th.sortable button {
  width: 95%;
}
</style>