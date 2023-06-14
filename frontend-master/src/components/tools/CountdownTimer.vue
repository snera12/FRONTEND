<script setup>
import { toRefs, watch } from 'vue';

// eslint-disable-next-line no-undef
const emits = defineEmits([
  'countdown-timer-first-start',
  'countdown-timer-over'
]);

// eslint-disable-next-line no-undef
const props = defineProps({
  interval: {
    type: Number, // ms
    default: 60000
  },
  startTimestamp: {
    type: Number, // ms
    default: 0,
  }
});

const { interval, startTimestamp } = toRefs(props);

const startCountdowns = () => {
  emits('countdown-timer-first-start');
  setInterval(() => {
    emits('countdown-timer-over');
  }, interval.value);
};

watch(startTimestamp, () => startCountdowns());

</script>
<template>
  <div>
  </div>
</template>
<style scoped>

</style>