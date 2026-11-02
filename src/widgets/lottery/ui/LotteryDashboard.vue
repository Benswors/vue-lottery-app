<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { BaseButton } from '@/shared/ui'
import { BaseModal } from '@/shared/ui'
import { ParticipantForm } from '@/features/participant-form'
import ParticipantsTable from './ParticipantsTable.vue'
import { RegisterFormBlock } from '@/features/participant-form'
import { WinnersList } from '@/entities/lottery'
import { useLotteryStore } from '@/entities/lottery'
import type { Participant, ParticipantInput } from '@/entities/lottery'

const lottery = useLotteryStore()
const { participants, winners, canPickWinner } = storeToRefs(lottery)
const { isEmailTaken, addParticipant, updateParticipant, removeParticipant, pickWinner, removeWinner } = lottery

const editingParticipant = ref<Participant | null>(null)
const isEditOpen = ref(false)
const deletingParticipant = ref<Participant | null>(null)
const isDeleteOpen = ref(false)

function openEdit(participant: Participant): void {
  editingParticipant.value = participant
  isEditOpen.value = true
}

function submitEdit(value: ParticipantInput): void {
  if (editingParticipant.value) updateParticipant(editingParticipant.value.id, value)
  isEditOpen.value = false
}

function openDelete(participant: Participant): void {
  deletingParticipant.value = participant
  isDeleteOpen.value = true
}

function confirmDelete(): void {
  if (deletingParticipant.value) removeParticipant(deletingParticipant.value.id)
  isDeleteOpen.value = false
}
function isEmailTakenByOther(email: string): boolean {
  return isEmailTaken(email, editingParticipant.value?.id)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <WinnersList
      :winners="winners"
      :can-pick="canPickWinner"
      @new-winner="pickWinner"
      @remove-winner="removeWinner"
    />
    <RegisterFormBlock
      :is-email-taken="isEmailTaken"
      @register="addParticipant"
    />
    <ParticipantsTable
      :participants="participants"
      @edit="openEdit"
      @delete="openDelete"
    />
    <section class="rounded border border-gray-200 bg-white p-4 shadow-sm">
      <h2 class="mb-2 text-sm font-bold uppercase text-gray-900">
        РџСЂРѕ Р·Р°СЃС‚РѕСЃСѓРЅРѕРє
      </h2>
      <p class="mb-3 text-sm text-gray-500">
        Lottery вЂ” Р·Р°СЃС‚РѕСЃСѓРЅРѕРє РґР»СЏ СЂРµС”СЃС‚СЂР°С†С–С— СѓС‡Р°СЃРЅРёРєС–РІ С– РІРёРїР°РґРєРѕРІРѕРіРѕ РІРёР±РѕСЂСѓ РїРµСЂРµРјРѕР¶С†С–РІ.
        РЈ СЂРѕР·РґС–Р»С– Users РјРѕР¶РЅР° С€СѓРєР°С‚Рё РєРѕСЂРёСЃС‚СѓРІР°С‡С–РІ, РїРµСЂРµРіР»СЏРґР°С‚Рё С—С…РЅС– РїСЂРѕС„С–Р»С–,
        РґРѕРґР°РІР°С‚Рё, СЂРµРґР°РіСѓРІР°С‚Рё С‚Р° РІРёРґР°Р»СЏС‚Рё Р·Р°РїРёСЃРё РїС–СЃР»СЏ РІС…РѕРґСѓ.
      </p>
      <p class="mb-3 text-sm text-gray-500">
        РўРµС…РЅРѕР»РѕРіС–С—: Vue 3, TypeScript, Composition API, Vue Router, Pinia,
        VeeValidate, yup, Tailwind CSS, SCSS С‚Р° REST API DummyJSON.
      </p>
      <a
        href="https://github.com/Benswors/vue-lottery-app"
        class="text-sm text-primary hover:text-primary-dark hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub РїСЂРѕС”РєС‚Сѓ
      </a>
    </section>
  </div>

  <BaseModal
    :open="isEditOpen"
    @close="isEditOpen = false"
  >
    <template #header>
      Р РµРґР°РіСѓРІР°РЅРЅСЏ СѓС‡Р°СЃРЅРёРєР°
    </template>
    <ParticipantForm
      v-if="editingParticipant"
      :key="editingParticipant.id"
      :initial-values="editingParticipant"
      submit-label="РћРЅРѕРІРёС‚Рё РґР°РЅС–"
      :is-email-taken="isEmailTakenByOther"
      @submit="submitEdit"
    />
  </BaseModal>

  <BaseModal
    :open="isDeleteOpen"
    @close="isDeleteOpen = false"
  >
    <template #header>
      Р’РёРґР°Р»РµРЅРЅСЏ СѓС‡Р°СЃРЅРёРєР°
    </template>
    <p
      v-if="deletingParticipant"
      class="text-sm"
    >
      Р’Рё РґС–Р№СЃРЅРѕ Р±Р°Р¶Р°С”С‚Рµ РІРёРґР°Р»РёС‚Рё СѓС‡Р°СЃРЅРёРєР° "{{ deletingParticipant.name }}",
      "{{ deletingParticipant.email }}"?
    </p>
    <template #footer>
      <BaseButton @click="confirmDelete">
        РўР°Рє
      </BaseButton>
      <BaseButton
        variant="secondary"
        @click="isDeleteOpen = false"
      >
        РќС–
      </BaseButton>
    </template>
  </BaseModal>
</template>
