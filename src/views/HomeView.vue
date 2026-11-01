<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import ParticipantForm from '@/components/ParticipantForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterFormBlock from '@/components/RegisterFormBlock.vue'
import WinnersList from '@/components/WinnersList.vue'
import { useParticipants } from '@/composables/useParticipants'
import type { Participant, ParticipantInput } from '@/types'

const {
  participants,
  winners,
  canPickWinner,
  isEmailTaken,
  addParticipant,
  updateParticipant,
  removeParticipant,
  pickWinner,
  removeWinner,
} = useParticipants()

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
        Про застосунок
      </h2>
      <p class="mb-3 text-sm text-gray-500">
        Lottery — застосунок для реєстрації учасників і випадкового вибору переможців.
        У розділі Users можна шукати користувачів, переглядати їхні профілі,
        додавати, редагувати та видаляти записи після входу.
      </p>
      <p class="mb-3 text-sm text-gray-500">
        Технології: Vue 3, TypeScript, Composition API, Vue Router, Pinia,
        VeeValidate, yup, Tailwind CSS, SCSS та REST API DummyJSON.
      </p>
      <a
        href="https://github.com/Benswors/vue-lottery-app"
        class="text-sm text-primary hover:text-primary-dark hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub проєкту
      </a>
    </section>
  </div>

  <BaseModal
    :open="isEditOpen"
    @close="isEditOpen = false"
  >
    <template #header>
      Редагування учасника
    </template>
    <ParticipantForm
      v-if="editingParticipant"
      :key="editingParticipant.id"
      :initial-values="editingParticipant"
      submit-label="Оновити дані"
      :is-email-taken="isEmailTakenByOther"
      @submit="submitEdit"
    />
  </BaseModal>

  <BaseModal
    :open="isDeleteOpen"
    @close="isDeleteOpen = false"
  >
    <template #header>
      Видалення учасника
    </template>
    <p
      v-if="deletingParticipant"
      class="text-sm"
    >
      Ви дійсно бажаєте видалити учасника "{{ deletingParticipant.name }}",
      "{{ deletingParticipant.email }}"?
    </p>
    <template #footer>
      <BaseButton @click="confirmDelete">
        Так
      </BaseButton>
      <BaseButton
        variant="secondary"
        @click="isDeleteOpen = false"
      >
        Ні
      </BaseButton>
    </template>
  </BaseModal>
</template>
