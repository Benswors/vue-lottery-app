<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
const props = defineProps<{ id: string }>()
const route = useRoute(), store = useUsersStore(), user = ref<User>(), error = ref(''), loading = ref(false)
let ticket = 0
watch(() => props.id, async id => {
  const current = ++ticket; loading.value = true; error.value = ''; user.value = undefined
  try { const result = await store.fetchUser(Number(id)); if (current === ticket) user.value = result }
  catch (e) { if (current === ticket) error.value = (e as Error).message }
  finally { if (current === ticket) loading.value = false }
}, { immediate: true })
</script>
<template>
  <RouterLink
    to="/users"
    class="text-link text-sm"
  >
    ← Users
  </RouterLink>
  <p
    v-if="loading"
    class="text-sm text-gray-400"
    role="status"
  >
    Loading…
  </p><p
    v-if="error"
    class="form-error"
    role="alert"
  >
    {{ error }}
  </p>
  <section
    v-if="user"
    class="panel"
  >
    <h1 class="panel-title">
      {{ user.firstName }} {{ user.lastName }}
    </h1>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      <dt class="text-gray-400">
        Username
      </dt><dd>{{ user.username }}</dd><dt class="text-gray-400">
        Email
      </dt><dd class="break-all">
        {{ user.email }}
      </dd><dt class="text-gray-400">
        Phone number
      </dt><dd>{{ user.phone }}</dd><dt class="text-gray-400">
        Age
      </dt><dd>{{ user.age }}</dd><dt class="text-gray-400">
        Gender
      </dt><dd>{{ user.gender }}</dd><template v-if="user.birthDate">
        <dt class="text-gray-400">
          Date of Birth
        </dt><dd>{{ user.birthDate }}</dd>
      </template><template v-if="user.address">
        <dt class="text-gray-400">
          Address
        </dt><dd>{{ user.address.address }}, {{ user.address.city }}, {{ user.address.country }}</dd>
      </template><template v-if="user.company">
        <dt class="text-gray-400">
          Company
        </dt><dd>{{ user.company.name }} · {{ user.company.title }}</dd>
      </template><template v-if="user.university">
        <dt class="text-gray-400">
          University
        </dt><dd>{{ user.university }}</dd>
      </template>
    </dl>
    <RouterLink
      v-if="route.name !== 'user-edit'"
      class="text-link mt-4 inline-block text-sm"
      :to="`/users/${id}/edit`"
    >
      Редагувати
    </RouterLink>
    <details class="mt-4 text-sm">
      <summary class="cursor-pointer text-gray-500">
        Усі дані
      </summary><dl class="mt-3 space-y-2">
        <template
          v-for="(value, key) in user"
          :key="key"
        >
          <div
            v-if="key !== 'password'"
            class="border-b border-gray-100 py-1"
          >
            <dt class="text-gray-400">
              {{ key }}
            </dt><dd class="break-all whitespace-pre-wrap">
              {{ typeof value === 'object' ? JSON.stringify(value, null, 2) : value }}
            </dd>
          </div>
        </template>
      </dl>
    </details>
  </section>
  <RouterView />
</template>
