<script setup lang="ts">
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'
defineProps<{ open: boolean; loading?: boolean }>()
const emit = defineEmits<{ confirm: []; close: [] }>()
</script>
<template><AppModal :open="open" @close="emit('close')"><template #header>Видалення учасника</template><slot /><template #footer><AppButton variant="danger" :loading="loading" :disabled="loading" @click="emit('confirm')">Так</AppButton><AppButton variant="secondary" :disabled="loading" @click="emit('close')">Ні</AppButton></template></AppModal></template>
