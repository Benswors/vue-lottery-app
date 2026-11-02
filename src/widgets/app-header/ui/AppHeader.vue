<script setup lang="ts">
import { ThemeSwitch } from '@/features/theme'
import Logo from './Logo.vue'
import AppNavigation from './AppNavigation.vue'
</script>
<template>
  <header class="border-b border-gray-200 bg-white">
    <div class="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
      <Logo /><div class="flex flex-wrap items-center gap-3"><AppNavigation /><ThemeSwitch /></div>
    </div>
  </header>
</template>
