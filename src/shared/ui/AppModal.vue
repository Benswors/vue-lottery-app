<script setup lang="ts">
import Dialog from 'primevue/dialog'
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>
<template>
  <Dialog
    :visible="open"
    modal
    :style="{ width: '32rem', maxWidth: 'calc(100vw - 2rem)' }"
    @update:visible="emit('close')"
  >
    <template #header>
      <h3 class="font-bold">
        <slot name="header" />
      </h3>
    </template><slot /><template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </Dialog>
</template>
