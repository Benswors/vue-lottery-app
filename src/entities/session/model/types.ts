import type { Tokens } from '@/shared/api'
export interface SessionUser {
  id: number; username: string; firstName: string; lastName: string; email: string
  image?: string; password?: string
}
export type AuthResponse = SessionUser & Tokens
