<script setup lang="ts">
import Message from 'primevue/message'
import { notifications, dismissNotification } from './notifications'
</script>
<template>
  <div
    class="fixed bottom-4 right-4 z-[10000] flex max-w-[calc(100vw-2rem)] flex-col gap-2"
    aria-live="polite"
  >
    <Message
      v-for="item in notifications"
      :key="item.id"
      :severity="item.severity"
      closable
      :role="item.severity === 'error' ? 'alert' : 'status'"
      @close="dismissNotification(item.id)"
    >
      {{ item.message }}
    </Message>
  </div>
</template>
