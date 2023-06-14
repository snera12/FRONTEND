<script setup>
import { computed } from 'vue';
import { kebabize } from '@/utils/utils.js';
// eslint-disable-next-line no-undef
const emits = defineEmits([
  'buttons-set-confirm',
  'buttons-set-cancel',
  'buttons-set-btn',
]);
// eslint-disable-next-line no-undef
const props = defineProps({
  btnSetName: { type: String, default: ''},
  btns: {
    type: Object,
    default: () => ({
      confirm: 'ОК',
      cancel: 'Отмена',
    })
  },
  args: { type: Array, default: () => [] },
});

const btnSetName = computed(() => props.btnSetName || 'btns-set');

const confirm = (args = props.args) => emits('buttons-set-confirm', ...args);
const cancel = (args = props.args) => emits('buttons-set-cancel', ...args);
const otherBtn = (key, ...args) => emits('buttons-set-btn',
  [(props.btns[key]?.emit || props.btns[key]?.text || key), ...args]);
</script>

<template>
  <div
    :id="btnSetName"
    :class="['btns-set', btnSetName]"
  >
    <span>
      <base-button
        v-if="btns.confirm"
        :id="btnSetName + '__btn-ok'"
        :class="['btns-set__btn', btnSetName + '__btn-ok']"
        :text="btns.confirm"
        @click.prevent="confirm(args)"
      />
    </span>
    <span v-for="key in Object.keys(props.btns)" v-bind:key="key">
      <base-button
        v-if="key !== 'confirm' && key !== 'cancel'"
        :id="!btnSetName ? `btns-set-btn-${kebabize(key)}` :
          `${btnSetName}__${kebabize(key)}`"
        :class="['btns-set__btn', `${btnSetName}__${kebabize(key)}`]"
        @click.prevent="otherBtn(key, args)"
        :text="props.btns[key].text || props.btns[key]"
      />
    </span>
    <span>
      <base-button
        v-if="btns.cancel"
        :id="btnSetName + '__btn-cancel'"
        :class="['btns-set__btn', btnSetName + '__btn-cancel']"
        :text="btns.cancel"
        @click.prevent="cancel(args)"
      />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.btns-set {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-shrink: 1;
  padding: 1rem 0 0;

  &__btn {
    margin: 0px 60px;
    padding: 5px;
    flex: 0 1 100px;
    order: 2;
  }
}
</style>