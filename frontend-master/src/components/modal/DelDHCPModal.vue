<script setup>
import { computed } from 'vue';
import BaseDialogModal from '@/components/base/BaseDialogModal.vue';
import axios from 'axios';
import useBaseUrl from '@/composables/useBaseUrl.js';
import { getCSRFToken } from '@/utils/utils.js';

// eslint-disable-next-line no-undef
const emits = defineEmits([
  `del-dhcp-confirm`,
  'del-dhcp-cancel'
]);

// eslint-disable-next-line no-undef
const props = defineProps({
  dhcp: { type: Object, default: () => ({ip: '', host: ''}) },
});

const { baseUrl } = useBaseUrl();

const getAPIURL = computed(() => {
  const url = `${baseUrl.value}network/dhcp/delete/`;
  const api = `?ip=${props.dhcp.ip}&host=${props.dhcp.host}`;
  return url + api;
});

const getSendData = computed(() => {
  const data = new FormData();
  data.append('csrfmiddlewaretoken', getCSRFToken());
  data.append('hostname', props.dhcp.host);
  data.append('address', props.dhcp.ip);
  data.append('mac', '');
  data.append('vlan', '');
  return data;
});

const confirm = close => {
  axios({
    method: 'post',
    url: getAPIURL.value,
    data: getSendData.value,
  }).then(res => emits('del-dhcp-confirm', close));
};
const cancel = close => emits('del-dhcp-cancel', close);
</script>

<template>
  <base-dialog-modal
    size="sm"
    @base-dialog-confirm="confirm"
    @base-dialog-cancel="cancel"
    :isForm="true"
    :formName="`form-del-${dhcp.host}`"
    :title="`Удалить DHCP ${dhcp.host}?`"
    :btns="{
      'confirm': 'Удалить',
      'cancel': 'Отмена'
    }"
  >
    <template #message>
      <div id="pref-note" class="modal-user-action__pref-note"></div>
      <div class="modal-user-action__message">
        Вы действительно хотите удалить DHCP
        <span class="modal-user-action__message__user-name">{{dhcp.host}}</span>?
      </div>
    </template>
  </base-dialog-modal>
</template>

<style lang="scss">
</style>