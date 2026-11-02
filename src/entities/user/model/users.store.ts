import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import { USER_SERVICE } from '../api/user.service'
import type { User, CreateUserDto, UpdateUserDto } from './types'
export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]), total = ref(0), isLoading = ref(false), error = ref('')
  const changed = ref<Record<number, User>>({}), created = ref<User[]>([]), deleted = ref<number[]>([])
  const winners = ref<User[]>([])
  let requestId = 0, localId = -1
  const matches = (u: User, q: string) => Object.values(u).some(v => typeof v === 'string' && v.toLowerCase().includes(q.toLowerCase()))
  async function fetchUsers(page: number, q: string) {
    const ticket = ++requestId; isLoading.value = true; error.value = ''
    try {
      const hasChanges = created.value.length || deleted.value.length || Object.keys(changed.value).length
      const result = await ServiceProvider.get(USER_SERVICE).getPage({ limit: hasChanges ? 0 : 10, skip: hasChanges ? 0 : (page - 1) * 10, q: hasChanges ? '' : q })
      if (ticket !== requestId) return
      if (hasChanges) {
        const all = [...created.value, ...result.users.map(u => changed.value[u.id] || u)]
          .filter(u => !deleted.value.includes(u.id) && (!q || matches(u, q)))
        total.value = all.length; users.value = all.slice((page - 1) * 10, page * 10)
      } else { users.value = result.users; total.value = result.total }
    } catch (e) { if (ticket === requestId) { error.value = (e as Error).message; users.value = [] } }
    finally { if (ticket === requestId) isLoading.value = false }
  }
  async function fetchUser(id: number) {
    if (deleted.value.includes(id)) throw new Error('Користувача видалено в цій сесії')
    const local = created.value.find(u => u.id === id) || changed.value[id]
    if (local) return local
    if (!Number.isInteger(id) || id <= 0) throw new Error('Некоректний ID користувача')
    return ServiceProvider.get(USER_SERVICE).getById(id)
  }
  async function createUser(data: CreateUserDto) {
    const result = await ServiceProvider.get(USER_SERVICE).create(data)
    const item = { ...result, id: localId-- }; delete item.password
    created.value.unshift(item); users.value = [item, ...users.value].slice(0, 10); total.value++; return item
  }
  async function updateUser(id: number, data: UpdateUserDto) {
    const original = await fetchUser(id)
    const result = id < 0 ? { ...original, ...data } : await ServiceProvider.get(USER_SERVICE).update(id, data)
    const item = { ...original, ...result, id }; delete item.password
    if (id < 0) created.value = created.value.map(u => u.id === id ? item : u)
    else changed.value[id] = item
    users.value = users.value.map(u => u.id === id ? item : u)
    winners.value = winners.value.map(u => u.id === id ? item : u)
  }
  async function removeUser(id: number) {
    if (id > 0) await ServiceProvider.get(USER_SERVICE).delete(id)
    users.value = users.value.filter(u => u.id !== id); total.value = Math.max(0, total.value - 1)
    deleted.value.push(id); created.value = created.value.filter(u => u.id !== id)
    winners.value = winners.value.filter(u => u.id !== id)
  }
  function pickWinner() {
    const pool = users.value.filter(u => !winners.value.some(w => w.id === u.id))
    if (winners.value.length < 3 && pool.length) winners.value.push(pool[Math.floor(Math.random() * pool.length)])
  }
  const hasUsers = computed(() => users.value.length > 0)
  return { users, total, isLoading, error, winners, hasUsers, fetchUsers, fetchUser, createUser, updateUser, removeUser, pickWinner }
})
