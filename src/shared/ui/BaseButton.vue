<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'md' | 'sm'

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  @apply inline-flex items-center justify-center gap-1 rounded font-semibold transition-colors
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50;

  &:disabled {
    @apply cursor-not-allowed opacity-50;
  }

  &--md {
    @apply px-4 py-2 text-sm;
  }

  &--sm {
    @apply px-2.5 py-1 text-xs;
  }

  &--primary {
    @apply bg-primary text-white;

    &:hover:not(:disabled) {
      @apply bg-primary-dark;
    }
  }

  &--secondary {
    @apply bg-gray-200 text-gray-800;

    &:hover:not(:disabled) {
      @apply bg-gray-300;
    }
  }

  &--danger {
    @apply bg-red-500 text-white;

    &:hover:not(:disabled) {
      @apply bg-red-600;
    }
  }
}
</style>
