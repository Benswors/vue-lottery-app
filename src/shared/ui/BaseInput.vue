<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    label: string
    type?: string
    placeholder?: string
    max?: string
    error?: string | null
  }>(),
  { type: 'text', placeholder: '', max: undefined, error: null },
)

const emit = defineEmits<{ blur: [] }>()
const model = defineModel<string>({ required: true })
const inputId = useId()
</script>

<template>
  <div class="mb-3">
    <label
      :for="inputId"
      class="mb-1 block text-sm font-semibold text-gray-900"
    >
      {{ label }}
    </label>
    <input
      :id="inputId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :max="max"
      :aria-invalid="error ? 'true' : 'false'"
      class="base-input"
      :class="{ 'base-input--error': error }"
      @blur="emit('blur')"
    >
    <p
      v-if="error"
      class="mt-1 text-xs text-red-500"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.base-input {
  @apply w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800
    placeholder-gray-400 outline-none transition-colors;

  &:focus {
    @apply border-primary bg-white;
  }

  &--error {
    @apply border-red-400 bg-white;

    &:focus {
      @apply border-red-500;
    }
  }
}
</style>
