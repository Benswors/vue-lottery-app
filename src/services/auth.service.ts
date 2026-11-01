import { http } from '@/api/http-client'
import type { AuthResponse, User } from '@/types/user'
export class AuthService {
  login(username: string, password: string) {
    return http<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password, expiresInMins: 30 }) })
  }
  me() { return http<User>('/auth/me', {}, true) }
}
