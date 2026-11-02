<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton } from '@/shared/ui'
const session = useSessionStore(), router = useRouter()
async function logout() { session.clearSession(); await router.replace('/login') }
</script>
<template><AppButton size="sm" variant="secondary" @click="logout">Logout</AppButton></template>
