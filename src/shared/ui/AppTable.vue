<script setup lang="ts" generic="T extends { id: number | string }">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { TableColumn } from './table'
defineProps<{ rows: T[]; columns: TableColumn[] }>()
</script>
<template><DataTable :value="rows" data-key="id" size="small" class="app-table"><Column v-for="column in columns" :key="column.key" :field="column.key" :header="column.title"><template #body="{ data, index }"><slot :name="column.key" :row="data as T" :index="index">{{ data[column.key] }}</slot></template></Column><template #empty><span class="block py-3 text-center text-sm text-gray-400">No participants</span></template></DataTable></template>
<style lang="scss" scoped>.app-table { :deep(.p-datatable-thead > tr > th) { font-size: .75rem; padding: .5rem; } :deep(.p-datatable-tbody > tr > td) { font-size: .875rem; padding: .5rem; } }</style>
