<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ParticipantInput } from '@/entities/lottery'
import ParticipantForm from './ParticipantForm.vue'

defineProps<{ isEmailTaken: (email: string) => boolean }>()
const emit = defineEmits<{ register: [value: ParticipantInput] }>()

const form = useTemplateRef<InstanceType<typeof ParticipantForm>>('form')

function onSubmit(value: ParticipantInput): void {
  emit('register', value)
  form.value?.reset()
}
</script>

<template>
  <section class="rounded border border-gray-200 bg-white p-4 shadow-sm">
    <h2 class="text-sm font-bold uppercase text-gray-900">
      Register form
    </h2>
    <p class="mb-4 text-sm text-gray-400">
      Please fill in all the fields.
    </p>
    <ParticipantForm
      ref="form"
      submit-label="Save"
      :is-email-taken="isEmailTaken"
      @submit="onSubmit"
    />
  </section>
</template>
