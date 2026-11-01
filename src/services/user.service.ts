import { http } from '@/api/http-client'
import type { User, CreateUserDto, UpdateUserDto, UsersResponse } from '@/types/user'
import type { Readable, Creatable, Editable, Deletable } from './interfaces'
export class UserService implements Readable<User>, Creatable<User, CreateUserDto>, Editable<User, UpdateUserDto>, Deletable<User> {
  getPage({ limit = 10, skip = 0, q = '' } = {}): Promise<UsersResponse> {
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    if (q) params.set('q', q)
    return http<UsersResponse>(`/users${q ? '/search' : ''}?${params}`)
  }
  async getAll(params?: { limit?: number; skip?: number }) { return (await this.getPage(params)).users }
  getById(id: number) { return http<User>(`/users/${id}`) }
  create(data: CreateUserDto) { return http<User>('/users/add', { method: 'POST', body: JSON.stringify(data) }) }
  update(id: number, data: UpdateUserDto) { return http<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
  delete(id: number) { return http<User>(`/users/${id}`, { method: 'DELETE' }) }
}
