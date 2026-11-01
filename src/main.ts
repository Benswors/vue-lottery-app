import { createApp, watch } from 'vue'
import App from './App.vue'
import { pinia } from './stores'
import { router } from './router'
import { useAuthStore } from './stores/auth'
import { configureAuth } from './api/http-client'
import './assets/main.scss'
const app = createApp(App).use(pinia)
const auth = useAuthStore(pinia)
configureAuth({ access: () => auth.accessToken, refresh: () => auth.refreshToken, save: auth.save, clear: auth.logout })
watch(() => auth.isAuthenticated, authenticated => {
  if (!authenticated && router.currentRoute.value.meta.requiresAuth) {
    void router.replace({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  }
})
app.use(router).mount('#app')
