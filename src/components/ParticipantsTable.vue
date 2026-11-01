<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant, SortDirection, SortKey } from '@/types'
import BaseButton from './BaseButton.vue'
import SearchBar from './SearchBar.vue'

const props = defineProps<{ participants: Participant[] }>()

const emit = defineEmits<{
  edit: [participant: Participant]
  delete: [participant: Participant]
}>()

const nameFilter = ref('')
const sortKey = ref<SortKey | null>(null)
const sortDirection = ref<SortDirection>('asc')
const visibleParticipants = computed<Participant[]>(() => {
  const query = nameFilter.value.toLowerCase()
  const filtered = props.participants.filter((p) => p.name.toLowerCase().includes(query))

  const key = sortKey.value
  if (!key) return filtered

  const factor = sortDirection.value === 'asc' ? 1 : -1
  return [...filtered].sort((a, b) => {
    const result =
      key === 'name'
        ? a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        : a.birthDate.localeCompare(b.birthDate)
    return result * factor
  })
})

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

function sortLabel(key: SortKey): string {
  const title = key === 'name' ? 'name' : 'date of birth'
  const next = sortKey.value === key && sortDirection.value === 'asc' ? 'descending' : 'ascending'
  return `Sort by ${title} ${next}`
}

function onFilter(value: string): void {
  nameFilter.value = value
}
</script>

<template>
  <section class="rounded border border-gray-200 bg-white p-4 shadow-sm">
    <div class="mb-3">
      <SearchBar @filter-by-name="onFilter" />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-xs font-bold text-gray-800">
            <th class="px-2 py-2 font-normal text-gray-400">
              #
            </th>
            <th class="px-2 py-2">
              <button
                type="button"
                class="sort-button"
                :class="{ 'sort-button--active': sortKey === 'name' }"
                :aria-label="sortLabel('name')"
                @click="toggleSort('name')"
              >
                Name
                <span class="text-[10px]">A-Z</span>
                <svg
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    v-if="sortKey === 'name' && sortDirection === 'desc'"
                    d="M12 19V5m0 0-6 6m6-6 6 6"
                  />
                  <path
                    v-else
                    d="M12 5v14m0 0-6-6m6 6 6-6"
                  />
                </svg>
              </button>
            </th>
            <th class="px-2 py-2">
              <button
                type="button"
                class="sort-button"
                :class="{ 'sort-button--active': sortKey === 'birthDate' }"
                :aria-label="sortLabel('birthDate')"
                @click="toggleSort('birthDate')"
              >
                Date of Birth
                <svg
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    v-if="sortKey === 'birthDate' && sortDirection === 'desc'"
                    d="M12 19V5m0 0-6 6m6-6 6 6"
                  />
                  <path
                    v-else
                    d="M12 5v14m0 0-6-6m6 6 6-6"
                  />
                </svg>
              </button>
            </th>
            <th class="px-2 py-2">
              Email
            </th>
            <th class="px-2 py-2">
              Phone number
            </th>
            <th class="px-2 py-2" />
            <th class="px-2 py-2" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(participant, index) in visibleParticipants"
            :key="participant.id"
            class="border-b border-gray-100 text-gray-500"
          >
            <td class="px-2 py-2 text-gray-400">
              {{ index + 1 }}
            </td>
            <td class="px-2 py-2">
              {{ participant.name }}
            </td>
            <td class="whitespace-nowrap px-2 py-2">
              {{ participant.birthDate }}
            </td>
            <td class="px-2 py-2">
              {{ participant.email }}
            </td>
            <td class="whitespace-nowrap px-2 py-2">
              {{ participant.phone }}
            </td>
            <td class="px-2 py-2">
              <BaseButton
                size="sm"
                @click="emit('edit', participant)"
              >
                Редагувати дані
              </BaseButton>
            </td>
            <td class="px-2 py-2">
              <BaseButton
                size="sm"
                variant="danger"
                @click="emit('delete', participant)"
              >
                Видалити учасника
              </BaseButton>
            </td>
          </tr>
          <tr v-if="visibleParticipants.length === 0">
            <td
              colspan="7"
              class="px-2 py-4 text-center text-gray-400"
            >
              No participants
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.sort-button {
  @apply inline-flex items-center gap-1 text-gray-800 hover:text-primary;

  &--active {
    @apply text-primary;
  }
}
</style>
