import { ServiceProvider } from '@/shared/api'
import { UserService, USER_SERVICE } from '@/entities/user'
import { AuthService, AUTH_SERVICE } from '@/entities/session'
export function registerServices(): void {
  ServiceProvider.register(USER_SERVICE, () => new UserService())
  ServiceProvider.register(AUTH_SERVICE, () => new AuthService())
}
