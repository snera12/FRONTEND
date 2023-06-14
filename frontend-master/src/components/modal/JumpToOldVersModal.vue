<script setup>
import BaseDialogModal from '@/components/base/BaseDialogModal.vue';
import useBaseUrl from '@/composables/useBaseUrl.js';

// eslint-disable-next-line no-undef
const emits = defineEmits(['jump-to-old-vers-confirm', 'jump-to-old-vers-cancel']);

// eslint-disable-next-line no-undef
const props = defineProps({
  link: String,
  options: {
    type: Object,
    default: () => ({
      blank: false,
      notes: {
        pref: false,
        post: false,
      }
    }),
  },
  zIndex: Number,
});
const { baseUrl } = useBaseUrl();

const confirm = close => {
  emits('jump-to-old-vers-confirm', close);
  const link = baseUrl.value + props.link;
  props.options.blank ? window.open(link) : document.location.replace(link);
};

const cancel = close => emits('jump-to-old-vers-cancel', close);
</script>

<template>
  <base-dialog-modal
    @base-dialog-confirm="confirm"
    @base-dialog-cancel="cancel"
    :btns="{
      'confirm': 'Перейти',
      'cancel': 'Остаться'
      }"
    title="Переход на старую версию сайта"
    :zIndex="zIndex"
  >
    <template #message>
      <div v-if="options.notes.pref" id="pref-note">{{options.notes.pref}}</div>
      Вы покидаете версию нового дизайна.<br>
      Всё равно перейти?
      <div v-if="options.notes.post" id="post-note">{{options.notes.post}}</div>
    </template>
  </base-dialog-modal>
</template>

<style lang="scss">
</style>