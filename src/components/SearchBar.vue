<script setup lang="ts">
import { ref, watch } from 'vue'

const DEBOUNCE_MS = 300

const emit = defineEmits<{ 'filter-by-name': [value: string] }>()
const query = ref('')
watch(query, (value, _old, onCleanup) => {
  const timer = setTimeout(() => emit('filter-by-name', value.trim()), DEBOUNCE_MS)
  onCleanup(() => clearTimeout(timer))
})
</script>

<template>
  <input
    v-model="query"
    type="search"
    placeholder="Search by name"
    aria-label="Search by name"
    class="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white"
  >
</template>
