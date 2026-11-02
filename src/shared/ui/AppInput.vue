<script setup lang="ts" generic="T extends string | number | undefined = string">
import { useId } from 'vue'
import InputText from 'primevue/inputtext'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ label?: string; type?: string; error?: string | null; id?: string }>(), { label: '', type: 'text', error: null, id: undefined })
const model = defineModel<T>({ required: true })
const emit = defineEmits<{ blur: [event: FocusEvent] }>()
const generatedId = useId()
function update(value: string | undefined) { model.value = (props.type === 'number' && value ? Number(value) : value ?? '') as T }
</script>
<template>
  <div class="mb-3">
    <label
      v-if="label"
      :for="id || generatedId"
      class="form-label"
    >{{ label }}</label><InputText
      v-bind="$attrs"
      :id="id || generatedId"
      :model-value="model == null ? '' : String(model)"
      :type="type"
      :invalid="!!error"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id || generatedId}-error` : undefined"
      class="w-full !rounded !px-3 !py-2 !text-sm"
      @update:model-value="update"
      @blur="emit('blur', $event)"
    /><p
      v-if="error"
      :id="`${id || generatedId}-error`"
      class="form-error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
