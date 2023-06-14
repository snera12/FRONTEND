<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import useBaseUrl from '@/composables/useBaseUrl.js';
import { JSON_SUFFIX_DATA } from '@/composables/useJSON.js';
import BaseButtonsSet from '@/components/base/BaseButtonsSet.vue';
import BaseForm from '@/components/base/BaseForm.vue';
import { capitalize, getCSRFToken } from '@/utils/utils.js';
import { maskVLANUtil } from '@/utils/maskVLAN.js';
import { maskIPUtil } from '@/utils/maskIP.js';

// eslint-disable-next-line no-undef
const emits = defineEmits([
  'dhcp-entry-confirm',
  'dhcp-entry-cancel'
]);

// eslint-disable-next-line no-undef
const props = defineProps({
  mode: {
    type: String,
    default: 'create'
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
  dhcp: {
    type: Object,
    default: ()=>({}),
  },
});

const fieldNamesInterface = { // names interface between backend and frontend
  address: 'ip',
  ip: 'address',
  host: 'hostname',
  hostname: 'host',
};
const repairFieldName = name => fieldNamesInterface[name] || name;

const fieldsValues = ref({
  host: '',
  ip: '',
  mac: '',
  vlan: '',
});

onMounted(() => {
  Object.keys(fieldsValues.value).forEach(key =>
    fieldsValues.value[key] = props.dhcp[key] || '');
});

const { baseUrl } = useBaseUrl();
const CSRFToken = getCSRFToken(); 

const errors = ref({ sumLength: 0});
const showErrors = ref(false);

const regExpsStr = {
  host: `^[a-z0-9\\-]+\\.[a-z]{2,6}$`,
  nums0to255: '[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]',
  mac: '^(([0-9a-f]){2}:){5}([0-9a-f]){2}$',
  vlan: '^[1-9]|([1-9]([0-9]{1,2}))|([1-3]([0-9]{3}))|(40([0-8][0-9]))|(409[0-5])$',
};
const regExps = {
  antiLatin: /[^a-z]+/,
  antiDigits: /[^0-9]+/,
  antiHostName: /[^a-z0-9-]/,
};
const maska = {
  mac: {
    mask: 'FF:FF:FF:FF:FF:FF',
    tokens: { 'F': { pattern: /[0-9a-fA-F]/, lowercase: true }}
  }
};

const maskVLAN = (e, str) => fieldsValues.value.vlan = maskVLANUtil(e, str);
const maskIP = (e, str) => fieldsValues.value.ip = maskIPUtil(e, str);

const resJsonError = ref('');

const getIpPatternRegExpStr = computed(() => {
  const nums0to255 = regExpsStr.nums0to255;
  return `^((${nums0to255})\\.){3}(${nums0to255})$`;
});

const validateHost = computed(() => {
  const host = fieldsValues.value.host;
  const errors = checkFill(host, 'имени хоста');
  if (errors.length) return errors;
      
  const re = new RegExp(regExpsStr.host);
  if (!re.test(host)) errors.push('Неверный формат имени хоста:');
      
  const arr = host.split('.');
  if (arr.length > 2) {
    errors.push('Не более одной точки');
    return errors;
  }

  const [name, ext] = host.split('.');
  if (!name || !ext) {
    errors.push('Имя хоста должно состоять из названия и расширения, ' +
      'разделённых точкой');
  }
  if (name) {
    const len = name.length;
    if (len < 4) errors.push('В названии должно быть не меньше 4 символов');
    if (regExps.antiHostName.test(name)) {
      errors.push('В названии используйте только строчные латинские буквы, ' +
        'цифры и тире');
    }
    if (name.includes('--')) errors.push('Не используйте два тире рядом');
    if (name[0] === '-' || name[len-1] === '-') {
      errors.push('Не используйте тире в начале и конце названия');
    }
  }
  if (ext) {
    if (regExps.antiLatin.test(ext)) {
      errors.push('В расширении используйте только строчные латинские буквы');
    }
    if (ext.length < 2 || ext.length > 6) {
      errors.push('Длина расширения от 2 до 6 букв');
    }
  }
  return errors;
});

const validateIp = computed(() => {
  const ip = fieldsValues.value.ip;
  const errors = checkFill(ip, 'IP адреса');
  if (errors.length) return errors;
      
  const re = new RegExp(getIpPatternRegExpStr.value);
  if (!re.test(ip)) errors.push('IP должен быть в формате 255.255.255.255:');

  const arr = ip.split('.');
  if (arr.length !== 4) {
    errors.push('IP должен содержать 4 октета (части), разделённые точками');
    return errors;
  }
  arr.forEach((item, i) => {
    if (!item) { // '' === true; '0' === false;
      errors.push(`Заполните ${i+1} октет IP-адреса`);
    } else {
      if (regExps.antiDigits.test(item)) {
        errors.push(`Ошибка в ${i+1} октете IP-адреса: допустимы только цифры`);
      } else {
        const num = +item;
        if (num < 0 || num > 255) {
          errors.push(`Ошибка в ${i+1} октете IP-адреса:` +
            `допустимый диапазон от 0 до 255`);
        }
        if (item[0] === '0' && item[1]) {
          errors.push(`Ошибка в ${i+1} октете IP-адреса: лишняя цифра 0`);
        }
      }
    }
  });
  return errors;
});

const validateMac = computed(() => {
  const mac = fieldsValues.value.mac;
  const errors = checkFill(mac, 'MAC');
  if (errors.length) return errors;

  if (mac.length < 17) errors.push('MAC должен быть длиной в 6 откетов по 2 символа');
  return errors;
});

const validateVlan = computed(() => {
  const vlan = fieldsValues.value.vlan;
  const errors = checkFill(vlan, 'VLAN');
  return errors;
});

const validateMethods = {
  validateHost,
  validateIp,
  validateMac,
  validateVlan
};

const getShowErrorsClass = computed(() => showErrors.value ? 'show-error' : '');

const getUrlToSend = computed(() =>
  `${baseUrl.value}network/dhcp/${props.mode}${JSON_SUFFIX_DATA}`);

const getDataToSend = computed(() => {
  const data = new FormData();
  Object.keys(fieldsValues.value).forEach(key => {
    const fieldName = repairFieldName(key);
    data.append(fieldName, fieldsValues.value[key]);
    if (props.mode === 'edit') data.append('old_' + fieldName, props.dhcp[key]);
  });
  data.append('csrfmiddlewaretoken', CSRFToken);
  // for (const [key, value] of data) {
  //   console.log(`${key}: ${value}`);
  // }
  return data;
});

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
  Object.keys(fieldsValues.value).forEach(key => {
    const methodName = 'validate' + capitalize(key);
    errors.value[key] = validateMethods[methodName];
    errors.value.sumLength += errors.value[key].length;
  });
  showErrors.value = !!errors.value.sumLength;
};

const confirm = () => {
  validateForm();
  if (errors.value.sumLength) return;
  axios({
    method: 'post',
    url: getUrlToSend.value,
    data: getDataToSend.value,
  }).then(res => {
    const resJson = JSON.parse(res.request.responseText);
    resJson.errors ?
      resJsonError.value = resJson.errors :
      emits('dhcp-entry-confirm', props.mode);
  });
};
    
const cancel = () => emits('dhcp-entry-cancel', props.mode);
</script>

<template>
  <base-form formName="dhcp-entry">
    <template class="display-true">
      <div v-if="showTitle" class="dhcp-entry__title">
        {{mode === 'create' ? 'Добавление' : 'Редактирование'}} записи в DHCP.
      </div>
      <base-input
        groupClass="dhcp-entry__form-group__host"
        inputId="form-host"
        :showErrors="showErrors"
        :errors="validateHost"
        labelText="Имя хоста:"
      >
        <input v-model="fieldsValues.host" required
          id="form-host" type="text" name="host" maxlength="255"
          :class="getShowErrorsClass"
          :pattern="regExpsStr.host"
        >
      </base-input>
      <base-input
        groupClass="dhcp-entry__form-group__ip"
        :showErrors="showErrors"
        :errors="validateIp"
        inputId="form-ip"
        labelText="IPv4"
      >
        <input v-model="fieldsValues.ip"
          required id="form-ip" name="ip" type="text" minlength="7" maxlength="15"
          :class="getShowErrorsClass"
          @input="e => maskIP(e, fieldsValues.ip)"
          :pattern="getIpPatternRegExpStr"
        >
      </base-input>
      <base-input
        groupClass="dhcp-entry__form-group__mac"
        :showErrors="showErrors"
        :errors="validateMac"
        inputId="form-mac"
        labelText="MAC:"
      >
        <input v-model="fieldsValues.mac" required
          id="form-mac" type="text" name="mac" minlength="17" maxlength="17"
          :class="getShowErrorsClass"
          v-maska="maska.mac"
          :pattern="regExpsStr.mac"
        >
      </base-input>
      <base-input
        groupClass="dhcp-entry__form-group__vlan"
        :showErrors="showErrors"
        :errors="validateVlan"
        inputId="form-vlan"
        labelText="VLAN:"
      >
        <input v-model="fieldsValues.vlan" required
          id="form-vlan" type="text" name="vlan" minlength="1" maxlength="4"
          :class="getShowErrorsClass"
          @input="e => maskVLAN(e, fieldsValues.vlan)"
          :pattern="regExpsStr.vlan"
        >
      </base-input>
    </template>
  </base-form>
  <div v-if="resJsonError"> {{resJsonError}} </div>
  <base-buttons-set
    :btns="{
      'confirm': 'Подтвердить',
      'cancel': 'Отмена'
    }"
    @buttons-set-confirm="confirm"
    @buttons-set-cancel="cancel"
  />
</template>

<style lang="scss">
input:invalid.show-error {
  border-color: red;
}

input, input:valid {
  border-color: #ccc;
}

input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0px;
}
</style>