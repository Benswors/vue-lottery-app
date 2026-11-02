export interface Readable<T> {
  getAll(params?: { limit?: number; skip?: number }): Promise<T[]>
  getById(id: number): Promise<T>
}
export interface Creatable<T, TCreate = Partial<T>> { create(data: TCreate): Promise<T> }
export interface Editable<T, TUpdate = Partial<T>> { update(id: number, data: TUpdate): Promise<T> }
export interface Deletable<T> { delete(id: number): Promise<T> }
