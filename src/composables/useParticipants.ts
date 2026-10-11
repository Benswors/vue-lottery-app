import { computed, ref, watch } from 'vue'
import type { Participant, ParticipantInput } from '@/types'

const PARTICIPANTS_KEY = 'vue-lottery-app:participants'
const WINNERS_KEY = 'vue-lottery-app:winners'
export const MAX_WINNERS = 3

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return ['id', 'name', 'birthDate', 'email', 'phone'].every((k) => typeof p[k] === 'string')
}

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useParticipants() {
  // Відновлення при завантаженні застосунку
  const stored = readStorage<unknown[]>(PARTICIPANTS_KEY, [])
  const storedParticipants = Array.isArray(stored) ? stored.filter(isParticipant) : []
  const participants = ref<Participant[]>(storedParticipants)

  const knownIds = new Set(storedParticipants.map((p) => p.id))
  const storedWinners = readStorage<unknown[]>(WINNERS_KEY, [])
  const winnerIds = ref<string[]>(
    (Array.isArray(storedWinners) ? storedWinners : [])
      .filter((id): id is string => typeof id === 'string' && knownIds.has(id))
      .slice(0, MAX_WINNERS),
  )

  // Збереження за допомогою watcher з опцією deep
  watch(
    participants,
    (value) => localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(value)),
    { deep: true },
  )
  watch(
    winnerIds,
    (value) => localStorage.setItem(WINNERS_KEY, JSON.stringify(value)),
    { deep: true },
  )

  const winners = computed(() =>
    winnerIds.value
      .map((id) => participants.value.find((p) => p.id === id))
      .filter((p): p is Participant => p !== undefined),
  )

  const candidates = computed(() =>
    participants.value.filter((p) => !winnerIds.value.includes(p.id)),
  )

  const canPickWinner = computed(
    () => winnerIds.value.length < MAX_WINNERS && candidates.value.length > 0,
  )

  function isEmailTaken(email: string, excludeId?: string): boolean {
    const normalized = email.trim().toLowerCase()
    return participants.value.some(
      (p) => p.id !== excludeId && p.email.trim().toLowerCase() === normalized,
    )
  }

  function addParticipant(input: ParticipantInput): void {
    participants.value.push({ id: createId(), ...input })
  }

  function updateParticipant(id: string, input: ParticipantInput): void {
    const index = participants.value.findIndex((p) => p.id === id)
    if (index !== -1) participants.value[index] = { id, ...input }
  }

  function removeParticipant(id: string): void {
    participants.value = participants.value.filter((p) => p.id !== id)
    winnerIds.value = winnerIds.value.filter((wid) => wid !== id)
  }

  function pickWinner(): void {
    if (!canPickWinner.value) return
    const pool = candidates.value
    const winner = pool[Math.floor(Math.random() * pool.length)]
    winnerIds.value.push(winner.id)
  }

  function removeWinner(id: string): void {
    winnerIds.value = winnerIds.value.filter((wid) => wid !== id)
  }

  return {
    participants,
    winners,
    canPickWinner,
    isEmailTaken,
    addParticipant,
    updateParticipant,
    removeParticipant,
    pickWinner,
    removeWinner,
  }
}
