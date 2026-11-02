<script setup lang="ts">
import { EditUserForm } from '@/features/user-form'
defineProps<{ id: string }>()
</script>
<template><EditUserForm :id="id" /></template>
