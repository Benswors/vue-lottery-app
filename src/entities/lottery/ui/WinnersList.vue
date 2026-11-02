<script setup lang="ts">
import type { Participant } from '../model/types'
import { BaseButton } from '@/shared/ui'
import WinnerItem from './WinnerItem.vue'

defineProps<{
  winners: Participant[]
  canPick: boolean
}>()

const emit = defineEmits<{
  'new-winner': []
  'remove-winner': [id: string]
}>()
</script>

<template>
  <section class="flex items-center gap-3 rounded border border-gray-200 bg-white p-3 shadow-sm">
    <div
      class="flex min-h-[2.25rem] flex-1 flex-wrap items-center gap-2 rounded border border-gray-200 px-2 py-1"
      aria-label="Winners"
    >
      <WinnerItem
        v-for="winner in winners"
        :key="winner.id"
        :name="winner.name"
        @remove="emit('remove-winner', winner.id)"
      />
      <span
        v-if="winners.length === 0"
        class="text-sm text-gray-400"
      >Winners</span>
    </div>
    <BaseButton
      :disabled="!canPick"
      @click="emit('new-winner')"
    >
      New winner
    </BaseButton>
  </section>
</template>
