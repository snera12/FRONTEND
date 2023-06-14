<script setup>
import BaseDialogModal from '@/components/base/BaseDialogModal.vue';
import axios from 'axios';
import useBaseUrl from '@/composables/useBaseUrl.js';
import { getCSRFToken } from '@/utils/utils.js';
import { computed } from 'vue';

// eslint-disable-next-line no-undef
const emits = defineEmits([`user-action-confirm`, 'user-action-cancel']);

// eslint-disable-next-line no-undef
const props = defineProps({
  userName: String,
  action: {
    type: Object,
    default: () => ({
      'type': String,
      'name': String,
    })
  },
});

const { baseUrl } = useBaseUrl();

const getAPIURL = computed(() =>
  `${baseUrl.value}accounts/${props.action.type}/${props.userName}/`);

const confirm = close => {
  const data = new FormData();
  data.append('csrfmiddlewaretoken', getCSRFToken()),
  axios({
    method: 'post',
    url: getAPIURL.value,
    data,
  }).then(res => console.log(res));
  emits('user-action-confirm', close, props.action.type);
};
const cancel = close => emits('user-action-cancel', close);

</script>

<template>
  <base-dialog-modal
    size="sm"
    @base-dialog-confirm="confirm"
    @base-dialog-cancel="cancel"
    :isForm="true"
    :formName="`form-${action.type}-${userName}`"
    :title="`${action.name} пользователя ${userName}?`"
    :btns="{
      'confirm': action.name,
      'cancel': 'Отмена'
      }"
  >
    <template #message>
      <div id="pref-note" class="modal-user-action__pref-note"></div>
      <div class="modal-user-action__message">
        Вы действительно хотите {{action.name.toLowerCase()}} пользователя
        <span class="modal-user-action__message__user-name">{{userName}}</span>?
      </div>
    </template>
  </base-dialog-modal>
</template>

<style lang="scss">
.modal-user-action {

  &__message {
    margin-top: 2rem;
    text-align: center;

    &__user-name {
      font-weight: bold;
    }
  }
}
</style>