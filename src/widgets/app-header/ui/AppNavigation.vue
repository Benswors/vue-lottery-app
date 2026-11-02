<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/entities/session'
import { BaseButton } from '@/shared/ui'
const auth = useAuthStore(), router = useRouter()
async function logout() { auth.logout(); await router.replace('/login') }
</script>
<template>
  <nav
    class="flex flex-wrap items-center gap-4 text-sm"
    aria-label="Головна навігація"
  >
    <RouterLink
      to="/"
      class="text-gray-500"
      exact-active-class="!text-primary font-semibold"
    >
      Home
    </RouterLink>
    <RouterLink
      to="/about"
      class="text-gray-500"
      active-class="!text-primary font-semibold"
    >
      About author
    </RouterLink>
    <RouterLink
      to="/users"
      class="text-gray-500"
      active-class="!text-primary font-semibold"
    >
      Users
    </RouterLink>
    <BaseButton
      v-if="auth.isAuthenticated"
      size="sm"
      variant="secondary"
      @click="logout"
    >
      Logout
    </BaseButton>
    <RouterLink
      v-else
      to="/login"
      class="text-gray-500"
      active-class="!text-primary font-semibold"
    >
      Login
    </RouterLink>
  </nav>
</template>
