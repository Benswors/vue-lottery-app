export interface Participant {
  id: string
  name: string
  birthDate: string
  email: string
  phone: string
}

export type ParticipantInput = Omit<Participant, 'id'>

export type SortKey = 'name' | 'birthDate'
export type SortDirection = 'asc' | 'desc'
