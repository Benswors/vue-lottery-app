<script setup lang="ts">
import Button from 'primevue/button'
withDefaults(defineProps<{ variant?: 'primary' | 'secondary' | 'danger'; size?: 'md' | 'sm'; type?: 'button' | 'submit' | 'reset'; loading?: boolean }>(), { variant: 'primary', size: 'md', type: 'button', loading: false })
</script>
<template><Button :type="type" :severity="variant === 'primary' ? undefined : variant" :size="size === 'sm' ? 'small' : undefined" :loading="loading" class="app-button"><slot /></Button></template>
<style lang="scss" scoped>.app-button { border-radius: 4px; font-size: .875rem; padding: .45rem .8rem; &:is([data-p-small='true']) { font-size: .75rem; padding: .25rem .6rem; } }</style>
