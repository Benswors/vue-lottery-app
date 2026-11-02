import { ref } from 'vue'
export interface Notification { id: number; severity: 'success' | 'error'; message: string }
export const notifications = ref<Notification[]>([])
let sequence = 0
export function dismissNotification(id: number) { notifications.value = notifications.value.filter(item => item.id !== id) }
function add(severity: Notification['severity'], message: string) {
  const id = ++sequence
  notifications.value.push({ id, severity, message })
  setTimeout(() => dismissNotification(id), 5000)
}
export const notify = { success: (message: string) => add('success', message), error: (message: string) => add('error', message) }
