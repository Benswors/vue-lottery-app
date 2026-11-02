import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
const LotteryTheme = definePreset(Aura, {
  semantic: { primary: { 50: '#effaff', 100: '#dff3fc', 200: '#bce7f7', 300: '#87d4ed', 400: '#51bfe1', 500: '#3aafdc', 600: '#2b97c1', 700: '#23799d', 800: '#236581', 900: '#22546b', 950: '#163648' } },
})
export function setupUi(app: App) {
  app.use(PrimeVue, { theme: { preset: LotteryTheme, options: { darkModeSelector: '.dark', cssLayer: { name: 'primevue', order: 'tailwind-base, primevue, tailwind-utilities' } } } })
}
