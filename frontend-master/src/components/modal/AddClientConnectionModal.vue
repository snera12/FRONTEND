<script setup>
import { computed, ref } from 'vue';
import axios from 'axios';
import useBaseUrl from '@/composables/useBaseUrl.js';
import { getCSRFToken } from '@/utils/utils.js';

const MODAL_NAME = 'add-client-connection';

// eslint-disable-next-line no-undef
const emits = defineEmits([
  'add-client-connection-confirm`',
  'add-client-connection-cancel'
]);

// eslint-disable-next-line no-undef
const props = defineProps({
  curSwitch: {
    type: Object,
    default: ()=>({
      id: '',
      switchName: '',
      freePorts: [], 
    }),
  },
});

const fieldsValues = ref({
  port: '',
  clientName: '',
  description: '',
});

const showErrors = ref(false);
const errors = ref({sumLength: 0});

const checkFill = (field, fieldLabel, errors = []) => {
  const req = { // errorsTexts.REQIERED
    PREFIX: 'Заполнение ',
    SUFFIX: ' является обязательным'
  };
  if (!field) errors.push(req.PREFIX + fieldLabel + req.SUFFIX);
  return errors;
};

const validateForm = () => {
  errors.value.sumLength = 0;
  console.log(Object.keys(fieldsValues.value));
  Object.keys(fieldsValues.value).forEach(fieldName => {
    errors.value[fieldName] = checkFill(fieldsValues.value[fieldName], 'поля');
    errors.value.sumLength += errors.value[fieldName].length;
  });
};

const { baseUrl } = useBaseUrl();
const getURL = computed(() => 
  `${baseUrl.value}data/${props.curSwitch.id}/switch_customer_connection_create/`);

const getSendData = computed(() => {
  const data = new FormData();
  data.append('csrfmiddlewaretoken', getCSRFToken());
  data.append('id', props.curSwitch.id);
  data.append('port', fieldsValues.value.port);
  data.append('customer', fieldsValues.value.clientName);
  data.append('description', fieldsValues.value.description);
  return data;
});
 
const confirm = close => {
  validateForm();
  if (errors.value.sumLength) {
    showErrors.value = true;
    return;
  }
  axios({
    method: 'post',
    url: getURL.value,
    data: getSendData.value,
  }).then(res => {
    if (res.status === 200) emits('add-client-connection-confirm', close);
  });
};
const cancel = close => emits('add-client-connection-cancel', close);

</script>

<template>
  <base-dialog-modal
    size="md"
    :z-Index="+100"
    @base-dialog-confirm="confirm"
    @base-dialog-cancel="cancel"
    :isForm="true"
    :formName="`${MODAL_NAME}-${props.curSwitch.id}`"
    :title="`Добавление клиентского соединения на ${props.curSwitch.name}?`"

    :btns="{
      'confirm': 'Добавить',
      'cancel': 'Отмена'
      }"
  >
    <template #message>
      <div id="pref-note" :class="`modal-${MODAL_NAME}__pref-note`"></div>
      <div :class="`modal-${MODAL_NAME}__message`">
        <div :class="`modal-${MODAL_NAME}__message`">
          <p :class="`modal-${MODAL_NAME}__message__title`">
            Добавление клиентского соединения на {{curSwitch.switchName}}.
          </p>
        </div>
      </div>
    </template>
    <template #formFields>
      <base-input
        :groupClass="`modal-${MODAL_NAME}__form-group__ports`"
        :showErrors="showErrors"
        :errors="checkFill(fieldsValues.port, 'порта')"
        inputId="form-ports"
        labelText="Порт:"
      >
        <select v-model="fieldsValues.port"
          id="form-ports-select" name="ports" class="form-control" required >
          <option v-for="(port, id) in curSwitch.freePorts" :key="id" :value="port.id">
            {{port.port}}
          </option>
        </select>
      </base-input>
      <base-input
        :groupClass="`modal-${MODAL_NAME}__form-group__client-name`"
        :showErrors="showErrors"
        :errors="checkFill(fieldsValues.clientName, 'имени клиента')"
        inputId="form-client-name"
        labelText="Имя клиента:"
      >
        <input v-model="fieldsValues.clientName" required
          id="form-client-name" type="text" name="client-name" maxlength="100"
        >
      </base-input>
      <base-input
        :groupClass="`modal-${MODAL_NAME}__form-group__description`"
        :showErrors="showErrors"
        :errors="checkFill(fieldsValues.description, 'описания')"
        inputId="form-description"
        labelText="Описание:"
      >
        <input v-model="fieldsValues.description" required
          id="form-description" type="text" name="description" maxlength="1000"
        >
      </base-input>
    </template>
  </base-dialog-modal>
</template>

<style lang="scss">
.modal-add-client-connection {
  
  &__message {
    margin-top: 2rem;
    &__title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }

    &__switch-name {
      font-weight: bold;
    }
  }
}
</style>