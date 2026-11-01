import { UserService } from './user.service'
import { AuthService } from './auth.service'
export class ServiceProvider {
  private static userService?: UserService
  private static authService?: AuthService
  static get users() { return this.userService ??= new UserService() }
  static get auth() { return this.authService ??= new AuthService() }
}
