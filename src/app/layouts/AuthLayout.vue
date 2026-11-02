<script setup lang="ts">
import { AppHeader } from '@/widgets/app-header'
</script>
<template>
  <AppHeader />
  <main class="mx-auto max-w-3xl px-4 py-10">
    <section class="panel mx-auto max-w-lg">
      <slot />
    </section>
  </main>
</template>
