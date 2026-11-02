<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/entities/settings'
import { AppButton } from '@/shared/ui'
const settings = useSettingsStore()
const { isDark } = storeToRefs(settings)
</script>
<template>
  <AppButton
    size="sm"
    variant="secondary"
    :aria-pressed="isDark"
    aria-label="Перемкнути тему"
    @click="settings.toggleTheme"
  >
    {{ isDark ? 'Світла тема' : 'Темна тема' }}
  </AppButton>
</template>
