<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { WinnersList } from '@/entities/lottery'
import { AppButton, AppInput, AppTable, AppConfirmDialog, notify } from '@/shared/ui'
import type { TableColumn } from '@/shared/ui'
const store = useUsersStore(), route = useRoute(), router = useRouter()
const { users, total, isLoading, error: loadError, winners: winnerUsers } = storeToRefs(store)
const page = computed(() => { const value = Number(route.query.page); return Number.isFinite(value) ? Math.max(1, Math.floor(value || 1)) : 1 })
const query = computed(() => typeof route.query.q === 'string' ? route.query.q : '')
const search = ref(query.value), deleting = ref<User | null>(null), busy = ref(false), error = ref('')
const pages = computed(() => Math.max(1, Math.ceil(total.value / 10)))
const winners = computed(() => winnerUsers.value.map(u => ({ id: String(u.id), name: `${u.firstName} ${u.lastName}`, email: u.email, phone: u.phone, birthDate: u.birthDate || '' })))
const canPick = computed(() => !isLoading.value && winnerUsers.value.length < 3 && users.value.some(u => !winnerUsers.value.some(w => w.id === u.id)))
const columns: TableColumn[] = [{ key: 'number', title: '#' }, { key: 'name', title: 'Name' }, { key: 'age', title: 'Age' }, { key: 'email', title: 'Email' }, { key: 'phone', title: 'Phone number' }, { key: 'actions', title: '' }]
async function navigate(next: number, q = query.value) { await router.push({ name: 'users', query: { ...(next > 1 ? { page: String(next) } : {}), ...(q ? { q } : {}) } }) }
async function load() { await store.fetchUsers(page.value, query.value); if (!loadError.value && page.value > pages.value) await navigate(pages.value) }
watch([page, query], () => { search.value = query.value; void load() }, { immediate: true })
async function remove() {
  if (!deleting.value) return
  busy.value = true; error.value = ''
  try { await store.removeUser(deleting.value.id); deleting.value = null; notify.success('Користувача видалено'); await load() }
  catch (e) { error.value = (e as Error).message; notify.error(error.value) } finally { busy.value = false }
}
function removeWinner(id: string) { winnerUsers.value = winnerUsers.value.filter(u => String(u.id) !== id) }
</script>
<template>
  <WinnersList
    :winners="winners"
    :can-pick="canPick"
    @new-winner="store.pickWinner"
    @remove-winner="removeWinner"
  /><section class="panel">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <form
        class="flex flex-wrap items-center gap-2"
        @submit.prevent="navigate(1, search.trim())"
      >
        <AppInput
          id="search"
          v-model="search"
          aria-label="Пошук учасників"
          placeholder="Search by name"
          type="search"
          class="!w-48"
        /><AppButton
          type="submit"
          size="sm"
        >
          Search
        </AppButton>
      </form><RouterLink
        to="/users/new"
        class="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
      >
        Register
      </RouterLink>
    </div><p
      v-if="isLoading"
      role="status"
      class="text-sm text-gray-400"
    >
      Loading…
    </p><div
      v-else-if="loadError"
      role="alert"
    >
      <p class="form-error">
        {{ loadError }}
      </p><AppButton
        size="sm"
        @click="load"
      >
        Повторити
      </AppButton>
    </div><AppTable
      v-else
      :rows="users"
      :columns="columns"
    >
      <template #number="{ index }">
        {{ (page - 1) * 10 + index + 1 }}
      </template><template #name="{ row }">
        <RouterLink
          :to="`/users/${row.id}`"
          class="hover:text-primary"
        >
          {{ row.firstName }} {{ row.lastName }}
        </RouterLink>
      </template><template #actions="{ row }">
        <div class="flex items-center gap-2">
          <RouterLink
            :to="`/users/${row.id}/edit`"
            class="inline-block whitespace-nowrap rounded bg-primary px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-dark"
          >
            Редагувати дані
          </RouterLink><AppButton
            size="sm"
            variant="danger"
            @click="deleting = row; error = ''"
          >
            Видалити учасника
          </AppButton>
        </div>
      </template>
    </AppTable><div class="mt-4 flex items-center justify-between gap-2 text-xs text-gray-400">
      <AppButton
        size="sm"
        variant="secondary"
        :disabled="page <= 1 || isLoading"
        @click="navigate(page - 1)"
      >
        Назад
      </AppButton><span>Сторінка {{ page }} / {{ pages }} · Усього {{ total }}</span><AppButton
        size="sm"
        variant="secondary"
        :disabled="page >= pages || isLoading"
        @click="navigate(page + 1)"
      >
        Далі
      </AppButton>
    </div>
  </section><AppConfirmDialog
    :open="!!deleting"
    :loading="busy"
    @confirm="remove"
    @close="deleting = null"
  >
    <p class="text-sm">
      Ви дійсно бажаєте видалити учасника "{{ deleting?.firstName }} {{ deleting?.lastName }}"?
    </p><p
      v-if="error"
      class="form-error"
      role="alert"
    >
      {{ error }}
    </p>
  </AppConfirmDialog>
</template>
