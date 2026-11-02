import { API_URL } from '@/shared/config'
import type { Tokens } from './types'
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message) }
}
interface AuthBridge {
  access: () => string | null
  refresh: () => string | null
  save: (tokens: Tokens) => void
  clear: () => void
}
let auth: AuthBridge | undefined
let refreshing: Promise<void> | null = null
export function configureAuth(bridge: AuthBridge) { auth = bridge }
async function request<T>(path: string, options: RequestInit, protectedRequest: boolean): Promise<T> {
  const base = API_URL
  if (!base) throw new Error('Налаштуйте VITE_API_URL у файлі .env')
  const headers = new Headers(options.headers)
  if (options.body) headers.set('Content-Type', 'application/json')
  if (protectedRequest && auth?.access()) headers.set('Authorization', `Bearer ${auth.access()}`)
  const response = await fetch(`${base}${path}`, { ...options, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string }
    throw new HttpError(response.status, body.message || `HTTP ${response.status}`)
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>
}
export async function http<T>(path: string, options: RequestInit = {}, protectedRequest = false): Promise<T> {
  try { return await request<T>(path, options, protectedRequest) }
  catch (error) {
    if (!(error instanceof HttpError) || error.status !== 401 || !protectedRequest) throw error
    if (!auth?.refresh()) { auth?.clear(); throw error }
    refreshing ??= request<Tokens>('/auth/refresh', {
      method: 'POST', body: JSON.stringify({ refreshToken: auth.refresh(), expiresInMins: 30 }),
    }, false).then(tokens => auth?.save(tokens)).catch(e => { auth?.clear(); throw e }).finally(() => { refreshing = null })
    await refreshing
    try { return await request<T>(path, options, true) }
    catch (retryError) {
      if (retryError instanceof HttpError && retryError.status === 401) auth?.clear()
      throw retryError
    }
  }
}
