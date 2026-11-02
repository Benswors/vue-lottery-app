export interface Address {
  address: string; city: string; state: string; stateCode: string; postalCode: string
  coordinates: { lat: number; lng: number }; country: string
}
export interface User {
  id: number; firstName: string; lastName: string; maidenName?: string; age: number
  gender: 'male' | 'female' | 'other'; email: string; phone: string; username: string
  password?: string; birthDate?: string; image?: string; bloodGroup?: string
  height?: number; weight?: number; eyeColor?: string; hair?: { color: string; type: string }
  ip?: string; address?: Address; macAddress?: string; university?: string
  bank?: { cardExpire: string; cardNumber: string; cardType: string; currency: string; iban: string }
  company?: { department: string; name: string; title: string; address: Address }
  ein?: string; ssn?: string; userAgent?: string
  crypto?: { coin: string; wallet: string; network: string }; role?: string
}
export type CreateUserDto = Pick<User, 'firstName' | 'lastName' | 'email' | 'username' | 'age' | 'gender' | 'phone'> & { password: string }
export type UpdateUserDto = Partial<CreateUserDto>
export interface UsersResponse { users: User[]; total: number; skip: number; limit: number }
export interface Tokens { accessToken: string; refreshToken: string }
export type AuthResponse = User & Tokens
