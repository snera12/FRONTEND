<script setup>
import { toRefs } from 'vue';
// eslint-disable-next-line no-undef
const props = defineProps({
  dateTime: {
    type: String,
    default: '',
    required: true,
  },
  className: { type: String }
});
const { dateTime } = toRefs(props);
</script>
<template>
  <div :class="['date-time-el', `${className}__date-time`]">
    Информация о проблемах получена <b>{{dateTime}}</b>.
  </div>
</template>
<style lang="scss" scoped>
.date-time-el {
  margin-top: 12px;
  padding-right: 30px;
  font-size: 12px;
  text-align: right;
}
</style>