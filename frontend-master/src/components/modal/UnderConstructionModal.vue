<script setup>
import BaseDialogModal from '@/components/base/BaseDialogModal.vue';
// eslint-disable-next-line no-undef
const emits = defineEmits(['under-construction-confirm']);
const confirm = close => emits('under-construction-confirm', close);
</script>

<template>
  <base-dialog-modal
    @base-dialog-confirm="confirm"
    :btns="{'confirm': 'Вернуться'}"
    title="Действие недоступно:"
  >
    <template #message>Функционал в разработке...</template>
  </base-dialog-modal>
</template>

<style lang="scss">
</style>