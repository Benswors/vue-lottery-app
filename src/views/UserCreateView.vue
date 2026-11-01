<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '@/components/UserForm.vue'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'
const store = useUsersStore(), router = useRouter(), busy = ref(false), error = ref('')
async function save(data: CreateUserDto) {
  busy.value = true; error.value = ''
  try { await store.create(data); await router.push('/users') }
  catch (e) { error.value = (e as Error).message } finally { busy.value = false }
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
