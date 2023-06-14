<script setup>
import BaseButtonsSet from '@/components/base/BaseButtonsSet.vue';
// eslint-disable-next-line no-undef
const emits = defineEmits([
  'base-dialog-confirm',
  'base-dialog-cancel',
  'base-dialog-close'
]);

// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  title: { type: String, default: "Выберите" },
  isForm: { type: Boolean, default: false },
  formName: { String, default: '' },
  drag: { type: Boolean, default: false },
  size: { type: String, default: 'sm' },
  zIndex: { type: Number, default: 0 },
  btns: {
    type: Object,
    default: () => ({
      confirm: 'ОК',
      cancel: 'Отмена',
    }) 
  },
});

const confirm = close => emits('base-dialog-confirm', close);
const cancel = close => emits('base-dialog-cancel', close);
const atClose = () => emits('base-dialog-close');
</script>

<template>
  <base-modal
    @base-modal-close="atClose"
    :drag="true"
    :size="size"
    :z-index="zIndex || false"
  >
    <template #title><span class="base-modal__title">{{title}}</span></template>
    <template #content>
      <slot name="message"></slot>
    </template>
    <template #action="close">
      <base-form v-if="isForm" :formName="formName">
        <slot name="formFields"></slot>
        <base-buttons-set
          :btns="btns"
          :args="[close.onClose]"
          @buttons-set-confirm="confirm"
          @buttons-set-cancel="cancel"
        />
      </base-form>
      <div v-else>
          <base-buttons-set
            :btns="btns"
            :args="[close.onClose]"
            @buttons-set-confirm="confirm"
            @buttons-set-cancel="cancel"
          />
      </div>
    </template>
  </base-modal>
</template>

<style lang="scss" scoped>
.base-modal{
  &__title{
    display: block;
    padding-top: 0.5rem;
    text-align: center;
  }
}
</style>