<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '@/components/UserForm.vue'
import { useUsersStore } from '@/stores/users'
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user'
const props = defineProps<{ id: string }>()
const store = useUsersStore(), router = useRouter(), user = ref<User>(), busy = ref(false), error = ref('')
watch(() => props.id, async id => { user.value = undefined; error.value = ''; try { user.value = await store.get(Number(id)) } catch (e) { error.value = (e as Error).message } }, { immediate: true })
async function save(data: CreateUserDto) {
  busy.value = true; error.value = ''
  const update: UpdateUserDto = { ...data }; if (!update.password) delete update.password
  try { await store.update(Number(props.id), update); await router.push('/users') }
  catch (e) { error.value = (e as Error).message } finally { busy.value = false }
}
</script>
<template>
  <section class="panel">
    <h2 class="panel-title">
      Редагування учасника
    </h2><p
      v-if="error"
      class="form-error"
      role="alert"
    >
      {{ error }}
    </p><UserForm
      v-if="user"
      :key="id"
      :initial="user"
      :busy="busy"
      @save="save"
    /><p
      v-else-if="!error"
      class="text-sm text-gray-400"
      role="status"
    >
      Loading…
    </p>
  </section>
</template>
