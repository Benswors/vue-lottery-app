<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AppButton, AppInput, notify } from '@/shared/ui'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
const auth = useSessionStore(), route = useRoute(), router = useRouter()
const { error, isLoading } = storeToRefs(auth)
const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: yup.object({ username: yup.string().trim().required('Р’РєР°Р¶С–С‚СЊ Р»РѕРіС–РЅ'), password: yup.string().min(6, 'РњС–РЅС–РјСѓРј 6 СЃРёРјРІРѕР»С–РІ').required('Р’РєР°Р¶С–С‚СЊ РїР°СЂРѕР»СЊ') }),
  initialValues: { username: '', password: '' },
})
const [username, usernameAttrs] = defineField('username'), [password, passwordAttrs] = defineField('password')
const submit = handleSubmit(async values => {
  try {
    await auth.login(values.username, values.password)
    notify.success('Вхід виконано')
    const target = route.query.redirect
    await router.replace(typeof target === 'string' && target.startsWith('/users') ? target : '/users')
  } catch (e) { notify.error((e as Error).message) }
})
</script>
<template><h1 class="panel-title">Login</h1><form novalidate @submit="submit"><AppInput id="login-username" v-model="username" v-bind="usernameAttrs" label="Username" autocomplete="username" placeholder="Enter username" :error="errors.username" /><AppInput id="login-password" v-model="password" v-bind="passwordAttrs" label="Password" type="password" autocomplete="current-password" placeholder="Enter password" :error="errors.password" /><p v-if="error" class="form-error" role="alert">{{ error }}</p><div class="mt-6 flex justify-end"><AppButton type="submit" :loading="isLoading" :disabled="isSubmitting || isLoading">Login</AppButton></div></form></template>
