<script setup lang="ts">
import { useForm } from 'vee-validate'
import { AppButton, AppInput } from '@/shared/ui'
import * as yup from 'yup'
import type { CreateUserDto, User } from '@/entities/user'
const props = defineProps<{ initial?: User; busy: boolean }>()
const emit = defineEmits<{ save: [value: CreateUserDto] }>()
const schema = yup.object({
  firstName: yup.string().trim().required('Вкажіть ім’я'), lastName: yup.string().trim().required('Вкажіть прізвище'),
  email: yup.string().trim().email('Некоректний email').required('Вкажіть email'),
  username: yup.string().trim().min(3, 'Мінімум 3 символи').required('Вкажіть логін'),
  password: props.initial ? yup.string().test('password', 'Мінімум 6 символів', v => !v || v.length >= 6) : yup.string().min(6, 'Мінімум 6 символів').required('Вкажіть пароль'),
  age: yup.number().typeError('Вкажіть число').integer('Ціле число').min(1).max(120).required(),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Оберіть стать'),
  phone: yup.string().trim().matches(/^\+?[\d\s()-]{7,25}$/, 'Некоректний телефон').required('Вкажіть телефон'),
})
const { defineField, errors, handleSubmit } = useForm<CreateUserDto>({ validationSchema: schema,
  initialValues: { firstName: props.initial?.firstName || '', lastName: props.initial?.lastName || '', email: props.initial?.email || '', username: props.initial?.username || '', password: '', age: props.initial?.age || 18, gender: props.initial?.gender || 'male', phone: props.initial?.phone || '' },
})
const fields = [
  { key: 'firstName', label: 'First name', type: 'text' }, { key: 'lastName', label: 'Last name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' }, { key: 'username', label: 'Username', type: 'text' },
  { key: 'password', label: 'Password', type: 'password' }, { key: 'age', label: 'Age', type: 'number' },
  { key: 'phone', label: 'Phone number', type: 'tel' },
] as const
const firstName = defineField('firstName'), lastName = defineField('lastName'), email = defineField('email'), username = defineField('username'), password = defineField('password'), age = defineField('age'), phone = defineField('phone')
const inputs = { firstName, lastName, email, username, password, age, phone }
const [gender, genderAttrs] = defineField('gender')
const submit = handleSubmit(value => emit('save', value))
</script>
<template>
  <form
    novalidate
    @submit="submit"
  >
    <AppInput
      v-for="field in fields"
      :id="field.key"
      :key="field.key"
      v-model="inputs[field.key][0].value"
      v-bind="inputs[field.key][1].value"
      :type="field.type"
      :label="field.label"
      :error="errors[field.key]"
      :autocomplete="field.type === 'password' ? 'new-password' : 'off'"
    /><div class="mb-3">
      <label
        for="gender"
        class="form-label"
      >Gender</label><select
        id="gender"
        v-model="gender"
        v-bind="genderAttrs"
        class="form-input"
        :aria-invalid="!!errors.gender"
      >
        <option value="male">
          Male
        </option><option value="female">
          Female
        </option><option value="other">
          Other
        </option>
      </select><p
        v-if="errors.gender"
        class="form-error"
        role="alert"
      >
        {{ errors.gender }}
      </p>
    </div><div class="mt-6 flex items-center justify-end gap-3">
      <RouterLink
        to="/users"
        class="text-sm text-gray-500 hover:text-gray-800"
      >
        Cancel
      </RouterLink><AppButton
        type="submit"
        :loading="busy"
        :disabled="busy"
      >
        Save
      </AppButton>
    </div>
  </form>
</template>
