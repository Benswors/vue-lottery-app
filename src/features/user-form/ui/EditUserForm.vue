<script setup lang="ts">
import { notify } from '@/shared/ui'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from './UserForm.vue'
import { useUsersStore } from '@/entities/user'
import type { User, CreateUserDto, UpdateUserDto } from '@/entities/user'
const props = defineProps<{ id: string }>()
const store = useUsersStore(), router = useRouter(), user = ref<User>(), busy = ref(false), error = ref('')
watch(() => props.id, async id => { user.value = undefined; error.value = ''; try { user.value = await store.fetchUser(Number(id)) } catch (e) { error.value = (e as Error).message; notify.error(error.value) } }, { immediate: true })
async function save(data: CreateUserDto) {
  busy.value = true; error.value = ''
  const update: UpdateUserDto = { ...data }; if (!update.password) delete update.password
  try { await store.updateUser(Number(props.id), update); notify.success('Користувача оновлено'); await router.push('/users') }
  catch (e) { error.value = (e as Error).message; notify.error(error.value) } finally { busy.value = false }
}
</script>
<template>
  <section class="panel">
    <h2 class="panel-title">
      Р РµРґР°РіСѓРІР°РЅРЅСЏ СѓС‡Р°СЃРЅРёРєР°
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
      LoadingвЂ¦
    </p>
  </section>
</template>
