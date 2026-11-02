import { UserService } from '@/entities/user'
import { AuthService } from '@/entities/session'
export class ServiceProvider {
  private static userService?: UserService
  private static authService?: AuthService
  static get users() { return this.userService ??= new UserService() }
  static get auth() { return this.authService ??= new AuthService() }
}
