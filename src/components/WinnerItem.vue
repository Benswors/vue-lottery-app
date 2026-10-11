<script setup lang="ts">
defineProps<{ name: string }>()
const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <span class="inline-flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">
    {{ name }}
    <button
      type="button"
      class="leading-none hover:text-gray-200"
      :aria-label="`Remove winner ${name}`"
      @click="emit('remove')"
    >
      x
    </button>
  </span>
</template>
