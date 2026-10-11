<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const dialog = useTemplateRef<HTMLElement>('dialog')

// Фокус на вікні, щоб ключовий модифікатор .esc отримував події клавіатури
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    dialog.value?.focus()
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal__backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="emit('close')"
      >
        <div
          ref="dialog"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          class="modal__dialog w-full max-w-lg rounded bg-white shadow-xl outline-none"
          @keydown.esc="emit('close')"
        >
          <header class="flex items-center justify-between border-b border-gray-200 px-5 py-3">
            <h3 class="text-base font-bold text-gray-900">
              <slot name="header" />
            </h3>
            <button
              type="button"
              class="text-xl leading-none text-gray-400 hover:text-gray-700"
              aria-label="Close"
              @click="emit('close')"
            >
              &times;
            </button>
          </header>
          <div class="px-5 py-4">
            <slot />
          </div>
          <footer
            v-if="$slots.footer"
            class="flex justify-end gap-2 border-t border-gray-200 px-5 py-3"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal__dialog {
    transition: transform 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal__dialog {
    transform: translateY(-1rem) scale(0.97);
  }
}
</style>
