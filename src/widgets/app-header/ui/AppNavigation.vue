<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/auth'
const session = useSessionStore()
const { isAuthenticated } = storeToRefs(session)
</script>
<template>
  <nav
    class="flex flex-wrap items-center gap-4 text-sm"
    aria-label="Р“РѕР»РѕРІРЅР° РЅР°РІС–РіР°С†С–СЏ"
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
    <LogoutButton v-if="isAuthenticated" />
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
