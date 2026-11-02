import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { Tokens } from '@/shared/api'
import type { SessionUser } from './types'
import { AUTH_SERVICE } from '../api/auth.service'
const KEY = 'lottery:auth'
export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<SessionUser | null>(null)
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (typeof saved?.accessToken === 'string' && typeof saved?.refreshToken === 'string' && typeof saved?.user?.id === 'number') {
      accessToken.value = saved.accessToken; refreshToken.value = saved.refreshToken; user.value = saved.user
    }
  } catch { localStorage.removeItem(KEY) }
  const isAuthenticated = computed(() => !!accessToken.value)
  function persist() { localStorage.setItem(KEY, JSON.stringify({ accessToken: accessToken.value, refreshToken: refreshToken.value, user: user.value })) }
  function save(tokens: Tokens) { accessToken.value = tokens.accessToken; refreshToken.value = tokens.refreshToken; persist() }
  function logout() { accessToken.value = null; refreshToken.value = null; user.value = null; localStorage.removeItem(KEY) }
  async function login(username: string, password: string) {
    const result = await ServiceProvider.get(AUTH_SERVICE).login(username, password)
    const { accessToken: access, refreshToken: refresh, ...profile } = result
    delete profile.password
    user.value = profile; save({ accessToken: access, refreshToken: refresh })
    try { const me = await ServiceProvider.get(AUTH_SERVICE).me(); delete me.password; user.value = me; persist() } catch (e) { logout(); throw e }
  }
  return { accessToken, refreshToken, user, isAuthenticated, save, logout, login }
})
