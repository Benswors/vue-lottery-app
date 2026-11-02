import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<'light' | 'dark'>('light')
  const isDark = computed(() => theme.value === 'dark')
  function toggleTheme() { theme.value = isDark.value ? 'light' : 'dark' }
  return { theme, isDark, toggleTheme }
}, { persist: { key: 'lottery:settings', pick: ['theme'] } })
