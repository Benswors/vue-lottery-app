import { createApp, watch } from 'vue'
import App from './App.vue'
import { pinia } from './providers/pinia'
import { router } from './providers/router/index'
import { useSettingsStore } from '@/entities/settings'
import { useSessionStore } from '@/entities/session'
import { configureAuth } from '@/shared/api'
import './styles/main.scss'
import { setupUi } from './providers/ui'
import { registerServices } from './providers/services'
registerServices()
const app = createApp(App).use(pinia)
setupUi(app)
const settings = useSettingsStore(pinia)
watch(() => settings.isDark, value => document.documentElement.classList.toggle('dark', value), { immediate: true })
const auth = useSessionStore(pinia)
configureAuth({ access: () => auth.accessToken, refresh: () => auth.refreshToken, save: auth.save, clear: auth.clearSession })
watch(() => auth.isAuthenticated, authenticated => {
  if (!authenticated && router.currentRoute.value.meta.requiresAuth) {
    void router.replace({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  }
})
app.use(router).mount('#app')
