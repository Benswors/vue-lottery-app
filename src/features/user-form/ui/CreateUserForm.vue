<script setup lang="ts">
import { notify } from '@/shared/ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from './UserForm.vue'
import { useUsersStore } from '@/entities/user'
import type { CreateUserDto } from '@/entities/user'
const store = useUsersStore(), router = useRouter(), busy = ref(false), error = ref('')
async function save(data: CreateUserDto) {
  busy.value = true; error.value = ''
  try { await store.createUser(data); notify.success('Користувача створено'); await router.push('/users') }
  catch (e) { error.value = (e as Error).message; notify.error(error.value) } finally { busy.value = false }
}
</script>
<template>
  <section class="panel">
    <h1 class="panel-title">
      Register form
    </h1><p
      v-if="error"
      class="form-error"
      role="alert"
    >
      {{ error }}
    </p><UserForm
      :busy="busy"
      @save="save"
    />
  </section>
</template>
