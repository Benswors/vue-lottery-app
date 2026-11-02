import { createServiceKey, http } from '@/shared/api'
import type { AuthResponse, SessionUser } from '../model/types'
export class AuthService {
  login(username: string, password: string) {
    return http<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password, expiresInMins: 30 }) })
  }
  me() { return http<SessionUser>('/auth/me', {}, true) }
}

export const AUTH_SERVICE = createServiceKey<AuthService>('auth')
