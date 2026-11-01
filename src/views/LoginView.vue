<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore(), route = useRoute(), router = useRouter(), error = ref('')
const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: yup.object({ username: yup.string().trim().required('Вкажіть логін'), password: yup.string().min(6, 'Мінімум 6 символів').required('Вкажіть пароль') }),
  initialValues: { username: '', password: '' },
})
const [username, usernameAttrs] = defineField('username'), [password, passwordAttrs] = defineField('password')
const submit = handleSubmit(async values => {
  error.value = ''
  try {
    await auth.login(values.username, values.password)
    const target = route.query.redirect
    await router.replace(typeof target === 'string' && target.startsWith('/users') ? target : '/users')
  } catch (e) { error.value = (e as Error).message }
})
</script>
<template>
  <h1 class="panel-title">
    Login
  </h1>
  <form
    novalidate
    @submit="submit"
  >
    <div class="mb-3">
      <label
        for="login-username"
        class="form-label"
      >Username</label><input
        id="login-username"
        v-model="username"
        v-bind="usernameAttrs"
        class="form-input"
        autocomplete="username"
        placeholder="Enter username"
        :aria-invalid="!!errors.username"
      ><p
        v-if="errors.username"
        class="form-error"
        role="alert"
      >
        {{ errors.username }}
      </p>
    </div>
    <div class="mb-3">
      <label
        for="login-password"
        class="form-label"
      >Password</label><input
        id="login-password"
        v-model="password"
        v-bind="passwordAttrs"
        class="form-input"
        type="password"
        autocomplete="current-password"
        placeholder="Enter password"
        :aria-invalid="!!errors.password"
      ><p
        v-if="errors.password"
        class="form-error"
        role="alert"
      >
        {{ errors.password }}
      </p>
    </div>
    <p
      v-if="error"
      role="alert"
      class="form-error"
    >
      {{ error }}
    </p>
    <div class="mt-6 flex justify-end">
      <BaseButton
        type="submit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Loading…' : 'Login' }}
      </BaseButton>
    </div>
  </form>
</template>
