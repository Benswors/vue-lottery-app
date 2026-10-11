<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { ParticipantInput } from '@/types'
import {
  todayISO,
  validateBirthDate,
  validateEmail,
  validateName,
  validatePhone,
} from '@/utils/validation'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'

type Field = keyof ParticipantInput

const props = withDefaults(
  defineProps<{
    initialValues?: ParticipantInput
    submitLabel?: string
    isEmailTaken: (email: string) => boolean
  }>(),
  { initialValues: undefined, submitLabel: 'Save' },
)

const emit = defineEmits<{ submit: [value: ParticipantInput] }>()

const FIELDS: Field[] = ['name', 'birthDate', 'email', 'phone']
const emptyValues = (): ParticipantInput => ({ name: '', birthDate: '', email: '', phone: '' })

const values = reactive<ParticipantInput>({ ...(props.initialValues ?? emptyValues()) })
const touched = reactive<Record<Field, boolean>>({
  name: false,
  birthDate: false,
  email: false,
  phone: false,
})

const maxDate = todayISO()

const errors = computed<Record<Field, string | null>>(() => ({
  name: validateName(values.name),
  birthDate: validateBirthDate(values.birthDate),
  email:
    validateEmail(values.email) ??
    (props.isEmailTaken(values.email) ? 'A participant with this email already exists.' : null),
  phone: validatePhone(values.phone),
}))

const isValid = computed(() => FIELDS.every((field) => errors.value[field] === null))

// Помилка показується лише для полів, з якими користувач вже взаємодіяв
function visibleError(field: Field): string | null {
  return touched[field] ? errors.value[field] : null
}

function touch(field: Field): void {
  touched[field] = true
}

function onSubmit(): void {
  FIELDS.forEach(touch)
  if (!isValid.value) return
  emit('submit', {
    name: values.name.trim(),
    birthDate: values.birthDate,
    email: values.email.trim(),
    phone: values.phone.trim(),
  })
}

// Очищення без спрацювання валідації: скидаємо і значення, і прапорці "touched"
function reset(): void {
  Object.assign(values, emptyValues())
  FIELDS.forEach((field) => {
    touched[field] = false
  })
}

defineExpose({ reset })
</script>

<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
    @keydown.enter.prevent="onSubmit"
  >
    <BaseInput
      v-model="values.name"
      label="Name"
      placeholder="Enter user name"
      :error="visibleError('name')"
      @blur="touch('name')"
    />
    <BaseInput
      v-model="values.birthDate"
      label="Date of Birth"
      type="date"
      :max="maxDate"
      placeholder="yyyy-mm-dd"
      :error="visibleError('birthDate')"
      @blur="touch('birthDate')"
    />
    <BaseInput
      v-model="values.email"
      label="Email"
      type="email"
      placeholder="Enter email"
      :error="visibleError('email')"
      @blur="touch('email')"
    />
    <BaseInput
      v-model="values.phone"
      label="Phone number"
      type="tel"
      placeholder="+380XXXXXXXXX"
      :error="visibleError('phone')"
      @blur="touch('phone')"
    />
    <div class="mt-6 flex justify-end">
      <BaseButton type="submit">
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>
