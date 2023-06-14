<script setup>
import { kebabize } from '@/utils/utils.js';

// eslint-disable-next-line no-undef
const emits = defineEmits(['submitForm']);

// eslint-disable-next-line no-undef
const props = defineProps({
  formName: {type: String, default: ''},
  method: {
    type: String,
    default: 'post',
    validator: value => ['post', 'get'].includes(value),
  },
});
 
const submitForm = () => emits('submitForm', props.formName);
</script>

<template>
  <form
    :name="formName"
    :class="['base-form', `form-${kebabize(formName)}`]"
    @submit.prevent="submitForm"
  >
    <slot></slot>
  </form>
</template>

<style lang="scss">
.base-form {
  display: block;
}
</style>