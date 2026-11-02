<script setup lang="ts">
import { AppHeader } from '@/widgets/app-header'
</script>
<template>
  <AppHeader />
  <main class="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-10">
    <slot />
  </main>
</template>
