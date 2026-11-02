import { http } from '@/shared/api'
import type { AuthResponse, User } from '@/entities/user'
export class AuthService {
  login(username: string, password: string) {
    return http<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password, expiresInMins: 30 }) })
  }
  me() { return http<User>('/auth/me', {}, true) }
}
