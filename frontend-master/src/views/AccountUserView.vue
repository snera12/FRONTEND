<template>
  <base-form formName="account-user">
    <template class="display-true">
      <div v-if="showTitle" class="account-user__title">
        {{mode === 'create' ?
          'Регистрация пользователя' : 'Изменение данных пользователя'}}
      </div>
      <base-input
        v-if="newBack"
        groupClass="account__form-group__fullname"
        :showErrors="showErrors"
        :errors="validateFullname"
        inputId="form-fullname"
        labelText="Фамилия Имя Отчество:"
      >
        <input v-model="fieldsValues.fullname" required
          id="form-fullname" type="text" name="fullname"
          autocapitalize="words" maxlength="100" autocomplete="fullname"
        >
      </base-input>
      <base-input
        groupClass="account__form-group__username"
        :showErrors="showErrors"
        :errors="validateUsername"
        inputId="form-username"
        labelText="Учётная запись:"
      >
        <input required
          id="form-username" v-model="fieldsValues.username" type="text" name="username"
          autocomplete="username" autocapitalize="none" minlength="4" maxlength="12"
        >
      </base-input>
      <base-input
        groupClass="account__form-group__email"
        :showErrors="showErrors"
        :errors="validateEmail"
        inputId="form-email"
        labelText="Адрес электронной почты:"
      >
        <input id="form-email" v-model="fieldsValues.email" type="email" name="email"
        autocomplete="email" autocapitalize="none" maxlength="254" required>
      </base-input>
      <base-input
        groupClass="account__form-group__password"
        :showErrors="showErrors"
        :errors="validatePassword"
        inputId="form-password"
        labelText="Пароль:"
      >
        <input v-model="fieldsValues[fieldNamesInterface.password]"
        id="form-password" type="password" name="password" autocomplete="new-password"
        autocapitalize="none" minlength="8" maxlength="12" required>
      </base-input>
            <base-input
        groupClass="account__form-group__password-confirm"
        :showErrors="showErrors"
        :errors="validatePasswordConfirm"
        inputId="form-password-confirm"
        labelText="Подтверждение пароля:"
      >
        <input v-model="fieldsValues[fieldNamesInterface.passwordConfirm]"
          id="form-password-confirm" type="password" name="password-confirm"
          autocomplete="new-password" autocapitalize="none"
          minlength="8" maxlength="12" class="form-control" required>
      </base-input>
      <base-input
        v-if="!newBack"
        groupClass="account__form-group__roles"
        :showErrors="showErrors"
        :errors="validateRoles"
        inputId="form-roles"
        labelText="Роль:"
      >
        <select v-model="fieldsValues[fieldNamesInterface.roles]"
          id="form-roles-select" name="roles" class="form-control" required>
          <option v-for="(role, i) in getSelect(fieldNamesInterface.roles)" :key="i"
          :value="role.value">
            {{role.label}}
          </option>
        </select>
      </base-input>
      <div v-if="newBack">
        <div>Сделать выбор нескольких ролей с датами. (для каждой роли своя дата конца
        действия) По умолчанию должна быть установлена дата конца срока действия роли
        плюс 2 года от текущей даты.</div>
        <div class="account__form-group__input-end-date">
          <label for="">Дата конца срока действия роли: </label>
          <input id="input-end-date" type="date" name="date" autocomplete="datePlus2Year"
          class="form-control" required>
        </div>
      </div>
      <base-input
        v-if="newBack"
        groupClass="account__form-group__department-select"
        :showErrors="showErrors"
        :errors="validateDepartment"
        inputId="form-department-select"
        labelText="Структурное подразделение: "
      >
        <select id="form-department-select" v-model="fieldsValues.department"
        name="departments" class="form-control" required>
          <option v-for="(department, i) in getSelect('departments')" :key="i"
          value="department.value">
            {{department.label}}
          </option>
        </select>
      </base-input>
      <base-input
        v-if="newBack"
        groupClass="account__form-group__job-title"
        :showErrors="showErrors"
        :errors="validateJobTitle"
        inputId="form-job-title"
        labelText="Должность: "
      >
        <input id="form-job-title" v-model="fieldsValues.jobTitle" type="text" required
          name="job-title" autocapitalize="on" maxlength="100" class="form-control"
        >
      </base-input>
      <base-input
        v-if="newBack"
        groupClass="account__form-group__req-nums"
        :showErrors="showErrors"
        :errors="validateReqNums"
        inputId="form-req-nums"
        labelText="Номера заявок в АС ОЗ: "
      >
        <input id="form-req-nums" v-model="fieldsValues.reqNums" name="req-nums"
          type="text" maxlength="500" class="form-control" required>
      </base-input>
    </template>
  </base-form>
  <div v-if="sending" class="account-user__sending">
    Отправка и проверка...
    <div v-if="sendingTimeout" class="account-user__sending__error">
      Ошибка: cервер слишком долго не отвечает.
    </div>
  </div>
  <div v-if="backErrors.length" class="account-user__back-errors">
    Введённые данные не прошли дополнительную проверку.
    Исправления требуют следующие ошибки:
    <ul>
      <li v-for="error, i in backErrors" :key="i"> {{error}} </li>
    </ul>
  </div>
  <base-buttons-set
    :btns="{
      'confirm': 'Подтвердить',
      'cancel': 'Отмена'
    }"
    :btnSetName="'add-user-btn-set'"
    @buttons-set-confirm="confirm"
    @buttons-set-cancel="cancel"
  />
</template>

<script>
import useBaseUrl from '@/composables/useBaseUrl.js';
import useJSON from '@/composables/useJSON.js';
import BaseButtonsSet from '@/components/base/BaseButtonsSet.vue';
import BaseForm from '@/components/base/BaseForm.vue';
import axios from 'axios';
import { getCSRFToken, capitalize } from '@/utils/utils.js';
export default {
  name: 'AccountUserView',
  emits: [`account-user-confirm`, 'account-user-cancel'],
  components: {
    BaseButtonsSet,
    BaseForm,
  },
  props: {
    mode: {
      type: String,
      default: 'create'
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    newBack: {
      type: Boolean,
      default: false
    },
    roles: {
      type: Array,
      default: ()=> [{}]
    },
    departments: {
      type: Array,
      default: ()=> [{}]
    },
  },
  setup(props) {
    const { baseUrl } = useBaseUrl();
    const { json, updateJSON, JSON_SUFFIX_OBJECT_LIST } =
      useJSON({url: `${baseUrl.value}accounts/create/`});
    return { baseUrl, json, updateJSON, JSON_SUFFIX_OBJECT_LIST };
  },
  data() {
    return {
      CSRFToken: String,
      fieldNamesInterface: { // names interface between backend and frontend
        password: 'password1',
        password1: 'password',
        passwordConfirm: 'password2',
        password2: 'passwordConfirm',
        roles: 'group',
        group: 'roles',
      },
      fieldsValues: { // TODO: refact after new backend complete 
        // fullname: '',
        username: '',
        email: '',
        password1: '', // => password
        password2: '', // => passwordConfirm
        group: '', // => roles
        // department: '',
        // jobTitle: '',
        // reqNums: '',
      },
      errors: {
        sumLength: 0,
      },
      backErrors: [],
      showErrors: false,
      regExps: {
        latin: /[a-z]+/,
        antiLatinG: /[^a-z]/g,
        latinCAPS: /[A-Z]+/,
        digits: /[0-9]+/,
        antiLatinAndDigits: /[^a-z0-9]/,
        symbols: /[!@#$%^&*()_+~={}[\]:;<>?,.`"'\\|/-]+/,
        another: /[^a-zA-Z0-9!@#$%^&*()_+~={}[\]:;<>?,.`"'\\|/-]/
      },
      sending: false,
      sendingTimeout: false,
    };
  },
  computed: {
    passwordRegExpKeys() {
      return Object.keys(this.regExps)
        .filter(key => key !== 'another' && key !== 'antiLatinAndDigits');
    },
    passwordRegExps() {
      const obj = {};
      this.passwordRegExpKeys.forEach(key => obj[key] = this.regExps[key]);
      return obj;
    },
    passwordHas() {
      const typesOfSymbols = {};
      const password = this.fieldsValues[this.fieldNamesInterface.password];
      this.passwordRegExpKeys.forEach(key=> {
        typesOfSymbols[key] = this.passwordRegExps[key].test(password);
      });
      return typesOfSymbols;
    },
    passwordTypesNum() {
      let typesNum = 0;
      this.passwordRegExpKeys.forEach(key=> {
        if (this.passwordHas[key]) typesNum += 1;
      });
      return typesNum;
    },
    validateFullname() {
      return this.checkFill(this.this.fieldsValues.fullname, 'ФИО');
    },
    validateUsername() {
      const username = this.fieldsValues.username;
      const errors = this.checkFill(username, 'логина');
      if (errors.length) return errors;

      if (username.length < 4) errors.push('Логин должен быть не короче 4 символов');
      if (!this.regExps.latin.test(username)) {
        errors.push('Логин должен содержать хотя бы 1 строчную латинскую букву');
      }
      if (this.regExps.antiLatinAndDigits.test(username)) {
        errors.push('Логин может содержать только цифры и строчные латинские буквы');
      }
      return errors;
    },
    validateEmail() {
      const email = this.fieldsValues.email;
      const errors = this.checkFill(email, 'электронной почты');
      if (errors.length) return errors;

      const hasAt = email.includes('@');
      const hasDot = email.includes('.');

      if (!hasAt) errors.push('В адресе эл.почты нет знака @');
      if (!hasDot) errors.push('В адресе эл.почты нет точки, выделяющий домен');
      if (!hasAt || !hasDot) return errors;

      const atPos = email.indexOf('@');
      const atLastPos = email.lastIndexOf('@');
      const dotLastPos = email.lastIndexOf('.');

      let partsErrorFlag = false;

      if (atLastPos > atPos) {
        errors.push('В адресе эл.почты больше одного знака @');
        partsErrorFlag = true;
      }
      if (dotLastPos === email.length) {
        errors.push('В адресе эл.почты точка должна быть не в конце, ' + 
        'нет домена верхнего уровня');
        partsErrorFlag = true;
      }
      if (atPos > dotLastPos) {
        errors.push('В адресе эл.почты отсутствуют домен и домен верхнего уровня');
        partsErrorFlag = true;
      }
      if (partsErrorFlag === true) return errors;

      const namePart = email.slice(0, atPos);
      const domainPart = email.slice(atPos+1, dotLastPos);
      const topDomainPart = email.slice(dotLastPos+1);

      if (!namePart) errors.push('В адресе эл.почте нет личного адреса перед знаком @');
      if (!domainPart) errors.push('В адресе эл.почты нет домена');
      if (topDomainPart.length === 0) {
        errors.push('В адресе эл.почты нет домена верхнего уровня');
      }
      if (topDomainPart.length === 1) {
        errors.push('В адресе эл.почты слишком короткий домен верхнего уровня');
      }
      const topDomainLetters = topDomainPart.replace(this.regExps.antiLatinG, '');
      if (topDomainPart.length && topDomainLetters.length < 2) {
        errors.push('В адресе эл.почты домен верхнего уровня содержится ' + 
        'меньше 2 латинских букв');
      }

      return errors;
    },
    validatePassword() {
      const password = this.fieldsValues[this.fieldNamesInterface.password];
      const errors = this.checkFill(password, 'пароля');
      if (errors.length) return errors;

      const len = password.length;
      if (len < 8) errors.push('Пароль должен быть не короче 8 символов');
      // if (len < 12 || len > 50) errors.push(
      //  'Пароль должен иметь длину от 12 до 50 символов'); 

      if (this.passwordTypesNum < 3) {
        errors.push('Пароль должен содержать хотя бы 3 из 4 видов символов ' +
        '(маленькие буквы, заглавные буквы, цифры, спецсимволы)');
      }

      if (this.passwordHas.another) {
        errors.push('Пароль не должен содержать' +
        'русские буквы, пробелы и недопустимые символы');
      }
      return errors;
    },
    validatePasswordConfirm() {
      const rePassword = this.fieldsValues[this.fieldNamesInterface.passwordConfirm];
      const errors = this.checkFill(rePassword, 'подтверждения пароля');
      if (errors.length) return errors;

      const password = this.fieldsValues[this.fieldNamesInterface.password];
      if (password !== rePassword) errors.push('Введённые пароли не совпадают');
      return errors;
    },
    validateRoles() {
      const errors = [];
      const roles = this.fieldsValues[this.fieldNamesInterface.roles];
      if (!roles.length) errors.push('Выберите роль');
      return errors;
    },
    validateDepartment() {
      const errors = [];
      if (!this.fieldsValues.departments.length) {
        errors.push('Выберите структурное подразделение');
      }
      return errors;
    },
    validateJobTitle() {
      const jobTitle = this.fieldsValues.jobTitle;
      const errors = this.checkFill(jobTitle, 'должности');
      return errors;
    },
    validateReqNums() {
      const reqNums = this.fieldsValues.reqNums;
      const errors = this.checkFill(reqNums, 'номеров заявок в АС ОЗ ');
      return errors;
    },
  },
  methods: {
    getSelect(select) {
      if (!(this.json && this.json.form)) return [{}];
      // TODO: refact after refact backend to choise by name of data
      const options = this.json.form.find(arr => arr[0].data.name === select);
      const choise = options.map(option => ({
        value: option.data.value,
        label: option.data.label,
      }));
      return choise;
    },
    checkFill(field, fieldLabel, errors = []) {
      const req = { // errorsTexts.REQIERED
        PREFIX: 'Заполнение ',
        SUFFIX: ' является обязательным'
      };
      if (!field) errors.push(req.PREFIX + fieldLabel + req.SUFFIX);
      return errors;
    },
    validateForm() {
      const repairFieldName = name => {
        if (name === 'password2') return false;
        return this.fieldNamesInterface[name] || name; 
      };
      this.errors.sumLength = 0;
      Object.keys(this.fieldsValues).forEach(key => {
        const fieldName = repairFieldName(key);
        if (fieldName) {
          const methodName = 'validate' + capitalize(fieldName);
          this.errors[fieldName] = this[methodName];
          this.errors.sumLength += this.errors[fieldName].length;
        }
      });
    },
    confirm() {
      this.validateForm();
      if (this.errors.sumLength) {
        this.showErrors = true;
        return;
      }
      this.sendingTimeout = false;
      this.sending = true;
      this.backErrors.length = 0;
      const data = new FormData();
      Object.keys(this.fieldsValues).forEach(key =>
        data.append(key, this.fieldsValues[key]));
      data.append('csrfmiddlewaretoken', this.CSRFToken);
      // console.log(this.fieldsValues);
      // for (const [key, value] of data) {
      //   console.log(`${key}: ${value}`);
      // }
      setTimeout(()=>this.sendingTimeout = true, 15000);
      axios({
        method: 'post',
        // form action="?json=true&json_object_list" :
        url: `${this.baseUrl}accounts/create${this.JSON_SUFFIX_OBJECT_LIST}`,
        data: data,
      }).then(res => {
        this.sendingTimeout = false;
        console.log(res);
        // console.log(JSON.parse(res.request.responseText));
        const backErrors = res.data?.errors;
        if (backErrors) {
          this.sending = false;
          Object.keys(backErrors).forEach(key => {
            backErrors[key].forEach(error => this.backErrors.push(error));
          });
        } else {
          this.sending = false;
          this.$emit('account-user-confirm', this.mode);
        }
      });
    },
    cancel() {
      this.$emit('account-user-cancel', this.mode);
    },
  },
  async mounted() {
    this.CSRFToken = getCSRFToken();
  }
};
</script>

<style lang="scss" scope>
.account-user {

  &__sending {
    color: var(--information-problem-color);
    
    &__error {
      color: var(--alarm-color);
    }
  }
  
  &__back-errors {
    margin: 12px 0px;
    color: var(--alarm-color);

    li {
      display: list-item;
    }
  }
}

.add-user-btn-set {
  width: 700px;
}
</style>