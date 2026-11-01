<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import WinnersList from '@/components/WinnersList.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import type { User } from '@/types/user'
const store = useUsersStore(), route = useRoute(), router = useRouter()
const page = computed(() => Math.max(1, Math.floor(Number(route.query.page) || 1)))
const query = computed(() => typeof route.query.q === 'string' ? route.query.q : '')
const search = ref(query.value), deleting = ref<User | null>(null), busy = ref(false), error = ref('')
const pages = computed(() => Math.max(1, Math.ceil(store.total / 10)))
const winners = computed(() => store.winners.map(u => ({ id: String(u.id), name: `${u.firstName} ${u.lastName}`, email: u.email, phone: u.phone, birthDate: u.birthDate || '' })))
const canPick = computed(() => !store.loading && store.winners.length < 3 && store.rows.some(u => !store.winners.some(w => w.id === u.id)))
async function navigate(next: number, q = query.value) { await router.push({ name: 'users', query: { ...(next > 1 ? { page: String(next) } : {}), ...(q ? { q } : {}) } }) }
async function load() {
  await store.load(page.value, query.value)
  if (!store.error && page.value > pages.value) await navigate(pages.value)
}
watch([page, query], () => { search.value = query.value; void load() }, { immediate: true })
async function remove() {
  if (!deleting.value) return
  busy.value = true; error.value = ''
  try { await store.remove(deleting.value.id); deleting.value = null; await load() }
  catch (e) { error.value = (e as Error).message } finally { busy.value = false }
}
function removeWinner(id: string) { store.winners = store.winners.filter(u => String(u.id) !== id) }
</script>
<template>
  <WinnersList
    :winners="winners"
    :can-pick="canPick"
    @new-winner="store.pickWinner"
    @remove-winner="removeWinner"
  />
  <section class="panel">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <form
        class="flex flex-wrap items-center gap-2"
        @submit.prevent="navigate(1, search.trim())"
      >
        <label
          for="search"
          class="sr-only"
        >Search</label><input
          id="search"
          v-model="search"
          class="form-input !w-48"
          type="search"
          placeholder="Search by name"
        ><BaseButton
          type="submit"
          size="sm"
        >
          Search
        </BaseButton>
      </form><RouterLink
        to="/users/new"
        class="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
      >
        Register
      </RouterLink>
    </div>
    <p
      v-if="store.loading"
      role="status"
      class="text-sm text-gray-400"
    >
      Loading…
    </p><div
      v-else-if="store.error"
      role="alert"
    >
      <p class="form-error">
        {{ store.error }}
      </p><BaseButton
        size="sm"
        @click="load"
      >
        Повторити
      </BaseButton>
    </div>
    <div
      v-else
      class="overflow-x-auto"
    >
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-xs font-bold text-gray-800">
            <th class="px-2 py-2 font-normal text-gray-400">
              #
            </th><th class="px-2 py-2">
              Name
            </th><th class="px-2 py-2">
              Age
            </th><th class="px-2 py-2">
              Email
            </th><th class="px-2 py-2">
              Phone number
            </th><th class="px-2 py-2" /><th class="px-2 py-2" />
          </tr>
        </thead><tbody>
          <tr
            v-for="(user, index) in store.rows"
            :key="user.id"
            class="border-b border-gray-100 text-gray-500"
          >
            <td class="px-2 py-2 text-gray-400">
              {{ (page - 1) * 10 + index + 1 }}
            </td><td class="px-2 py-2">
              <RouterLink
                :to="`/users/${user.id}`"
                class="hover:text-primary"
              >
                {{ user.firstName }} {{ user.lastName }}
              </RouterLink>
            </td><td class="px-2 py-2">
              {{ user.age }}
            </td><td class="px-2 py-2">
              {{ user.email }}
            </td><td class="whitespace-nowrap px-2 py-2">
              {{ user.phone }}
            </td><td class="px-2 py-2">
              <RouterLink
                :to="`/users/${user.id}/edit`"
                class="inline-block whitespace-nowrap rounded bg-primary px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-dark"
              >
                Редагувати дані
              </RouterLink>
            </td><td class="px-2 py-2">
              <BaseButton
                size="sm"
                variant="danger"
                @click="deleting = user; error = ''"
              >
                Видалити учасника
              </BaseButton>
            </td>
          </tr><tr v-if="!store.rows.length">
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
    <div class="mt-4 flex items-center justify-between gap-2 text-xs text-gray-400">
      <BaseButton
        size="sm"
        variant="secondary"
        :disabled="page <= 1 || store.loading"
        @click="navigate(page - 1)"
      >
        Назад
      </BaseButton><span>Сторінка {{ page }} / {{ pages }} · Усього {{ store.total }}</span><BaseButton
        size="sm"
        variant="secondary"
        :disabled="page >= pages || store.loading"
        @click="navigate(page + 1)"
      >
        Далі
      </BaseButton>
    </div>
  </section>
  <BaseModal
    :open="!!deleting"
    @close="deleting = null"
  >
    <template #header>
      Видалення учасника
    </template><p class="text-sm">
      Ви дійсно бажаєте видалити учасника "{{ deleting?.firstName }} {{ deleting?.lastName }}"?
    </p><p
      v-if="error"
      class="form-error"
      role="alert"
    >
      {{ error }}
    </p><template #footer>
      <BaseButton
        :disabled="busy"
        @click="remove"
      >
        Так
      </BaseButton><BaseButton
        variant="secondary"
        :disabled="busy"
        @click="deleting = null"
      >
        Ні
      </BaseButton>
    </template>
  </BaseModal>
</template>
