import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { Tokens } from '@/shared/api'
import type { SessionUser } from './types'
import { AUTH_SERVICE } from '../api/auth.service'
const KEY = 'lottery:auth'
export const useSessionStore = defineStore('session', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<SessionUser | null>(null)
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (typeof saved?.accessToken === 'string' && typeof saved?.refreshToken === 'string' && typeof saved?.user?.id === 'number') {
      accessToken.value = saved.accessToken; refreshToken.value = saved.refreshToken; user.value = saved.user
    }
  } catch { localStorage.removeItem(KEY) }
  const isLoading = ref(false), error = ref('')
  const isAuthenticated = computed(() => !!accessToken.value)
  function persist() { localStorage.setItem(KEY, JSON.stringify({ accessToken: accessToken.value, refreshToken: refreshToken.value, user: user.value })) }
  function save(tokens: Tokens) { accessToken.value = tokens.accessToken; refreshToken.value = tokens.refreshToken; persist() }
  function clearSession() { accessToken.value = null; refreshToken.value = null; user.value = null; localStorage.removeItem(KEY) }
  function setSession(tokens: Tokens, profile: SessionUser) { user.value = profile; save(tokens) }
  async function login(username: string, password: string) {
    isLoading.value = true; error.value = ''
    try {
    const result = await ServiceProvider.get(AUTH_SERVICE).login(username, password)
    const { accessToken: access, refreshToken: refresh, ...profile } = result
    delete profile.password
    user.value = profile; save({ accessToken: access, refreshToken: refresh })
    const me = await ServiceProvider.get(AUTH_SERVICE).me(); delete me.password; setSession({ accessToken: accessToken.value!, refreshToken: refreshToken.value! }, me)
    } catch (e) { clearSession(); error.value = (e as Error).message; throw e } finally { isLoading.value = false }
  }
  return { accessToken, refreshToken, user, isAuthenticated, isLoading, error, save, setSession, clearSession, login }
})
