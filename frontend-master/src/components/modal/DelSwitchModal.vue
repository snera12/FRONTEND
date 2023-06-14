<script setup>
import { computed } from 'vue';
import axios from 'axios';
import useBaseUrl from '@/composables/useBaseUrl.js';
import { getCSRFToken } from '@/utils/utils.js';

// eslint-disable-next-line no-undef
const emits = defineEmits([
  `del-switch-confirm`,
  'del-switch-cancel'
]);

// eslint-disable-next-line no-undef
const props = defineProps({
  curSwitch: {
    type: Object,
    default: ()=>({
      id: '',
      switchName: '',
      nodeName: '',
    }),
  },
});

const { baseUrl } = useBaseUrl();
const getURL = computed(() => 
  `${baseUrl.value}data/switch/${props.curSwitch.id}/delete/`);

const getSendData = computed(() => {
  const data = new FormData();
  data.append('csrfmiddlewaretoken', getCSRFToken());
  data.append('id', props.curSwitch.id);

  return data;
});
 
const confirm = close => {
  axios({
    method: 'post',
    url: getURL.value,
    data: getSendData.value,
  }).then(res => {
    if (res.status === 200) emits('del-switch-confirm', close);
  });
};
const cancel = close => emits('del-switch-cancel', close);

</script>

<template>
  <base-dialog-modal
    size="sm"
    :z-Index="+100"
    @base-dialog-confirm="confirm"
    @base-dialog-cancel="cancel"
    :isForm="true"
    :formName="`form-del-${props.curSwitch.id}`"
    :title="`Удалить коммутатор ${props.curSwitch.name}?`"

    :btns="{
      'confirm': 'Удалить',
      'cancel': 'Отмена'
      }"
  >
    <template #message>
      <div id="pref-note" class="modal-del-switch__pref-note"></div>
      <div class="modal-del-switch__message">
        <div class="modal-del-switch__message">
          <p class="modal-del-switch__message__title">
            Удаление коммутатора {{curSwitch.switchName}}.
          </p>
          <p class="modal-del-switch__message__attention">
            Внимание! Это ручное удаление коммутатора
            <span class="modal-del-switch__message__switch-name">
              &nbsp;{{curSwitch.switchName}}&nbsp;
            </span>
            <u>из таблицы</u>.<br>
            Для удаления коммутатора <u>из системы</u> перейдите в "Технический учёт".
          </p>
          <p class="modal-del-switch__message__info">
          &#9432; Ручное удаление коммутатора из таблицы без удаления коммутатора из
          системы не несёт никакого технического смысла. Коммутатор в таблице будет
          автоматически восстановлен в течении 1 часа.
          После удаления коммутатора в Техническом учёте, его удаление из таблицы
          произойдёт автоматически в течении 1 часа.
          </p>
          <p class="modal-del-switch__message__main">
          Если вы уже удалили коммутатор из системы и хотите вручную удалить его
          из таблицы, нажмите "Удалить".
          </p>
        </div>
      </div>
    </template>
  </base-dialog-modal>
</template>

<style lang="scss">
.modal-del-switch {
  
  &__message {
    margin-top: 2rem;
    &__title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }
    &__attention {
      text-align: center;
    }
    &__info {
      font-style: italic;
      text-align: left;
      color: darkblue;
    }
    &__main{
      text-align: center;
    }

    &__switch-name {
      font-weight: bold;
    }
  }
}
</style>