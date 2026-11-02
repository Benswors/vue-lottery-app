export const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_REGEXP = /^\+380\d{9}$/

const REQUIRED = 'This value is required.'

export function todayISO(): string {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function validateName(value: string): string | null {
  return value.trim() ? null : REQUIRED
}

export function validateBirthDate(value: string): string | null {
  if (!value) return REQUIRED
  if (value > todayISO()) return 'Date of birth cannot be in the future.'
  return null
}

export function validateEmail(value: string): string | null {
  const email = value.trim()
  if (!email) return REQUIRED
  return EMAIL_REGEXP.test(email) ? null : 'Enter a valid email.'
}

export function validatePhone(value: string): string | null {
  const phone = value.trim()
  if (!phone) return REQUIRED
  return PHONE_REGEXP.test(phone) ? null : 'Use the format +380XXXXXXXXX.'
}
