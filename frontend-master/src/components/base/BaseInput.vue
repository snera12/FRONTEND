<script setup>
import { computed } from 'vue';
// eslint-disable-next-line no-undef
const props = defineProps({
  groupClass: { type: String, default: ''},
  inputId: { type: String, default: ''},
  labelText: { type: String, default: ''},
  showErrors: { type: Boolean, default: false },
  errors: { type: Array, default: ()=>[] },
});

const groupName = computed(() => !props.groupClass ? '' :
  props.groupClass.replace('__', '-'));
</script>

<template>
  <div class="base-input">
    <div :class="['base-input', groupClass]">
      <span :id="`${groupName}-status`" class="base-input__status" >
        <span v-show="showErrors">
          <span :id="`${groupName}-status-ok`" class="base-input__status__ok"
          v-if="!errors.length" >
            ОК
          </span>
          <span v-else
            :id="`${groupName}-status-error`"
            class="base-input__status__error">
            ER
          </span>
        </span>
      </span>
      <span :id="`${groupName}-label`" class="base-input__label">
        <label :for="inputId">
          {{labelText}}
        </label>
      </span>
      <span :id="`${groupName}-input`" class="base-input__input">
        <slot></slot>
      </span>
    </div>
    <div :id="`${groupName}__errors`" class="base-input__errors">
      <ul v-show="showErrors && errors.length">
        <li v-for="(error, i) in errors" v-bind:key="i">{{error}}</li>
      </ul>
      <span :id="`${groupName}__errors__slot`">
        <slot name="errors"></slot>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.base-input {
  display: block;
  position: relative;
  margin: 8px;
  
  &__status {
    display: inline-block;
    min-width: 20px;
    min-height: 20px;
    margin-right: 8px;
    &__error {
      color: var(--alarm-color);
    }
    &__ok {
      color: var(--node-work-color);
    }
  }
  &__label {
    display: inline-block;
    min-width: 240px;
  }
  &__input {
    display: inline-block;

    input, select {
      min-width: 400px;
      width: 400px;
      min-height: 24px;
    }
    select {
      font-size: 14px;
    }

  }
  &__errors {
    li {
      display: list-item;
      color: var(--alarm-color);
    }
  }
}
</style>