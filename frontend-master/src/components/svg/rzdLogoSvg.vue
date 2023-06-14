<script setup>
import { computed, toRefs } from 'vue';
const SIZES = {
  full: { width: 169, height: 104 }, // scale 13 / 8 
  text: { width: 117, height: 52}, // scale 9 / 4
};
// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  color: {type: String, default: 'pos'},
  size: {type: String, default: 'full'},
  bg: {type: Boolean, default: true},
});
const { bg } = toRefs(props);
const colors = {
  white: "#FFFFFF",
  redRZD: "#E21A1A",
};
const bgColor = computed(() => props.color === 'pos' ? colors.white : colors.redRZD);
const txtColor = computed(() => props.color === 'pos' ? colors.redRZD : colors.white);
const width = computed(() => SIZES[props.size].width || 0);
const height = computed(() => SIZES[props.size].height || 0);
const viewBox = computed(() => `0 0 ${width.value} ${height.value}`);
const bgPath = computed(() => `M0 0h${width.value}v${height.value}H0z`);
const path = computed(() => {
  if (!props.size) return '';
  const isFull = props.size === 'full';
  if (!isFull && props.size !== 'text') return ''; 
  let path = isFull ? 'M108.863 30.601v1.88' : 'M82.863 4.601V6.4';
  path += '9h16.264c1.076 0 2.708 0 3.788 1.089 1.08 1.082 1.08 2.706 1.08 3.796v16.25c0';
  path += ' 1.076 0 2.711-1.08 3.788-1.08 1.085-2.712 1.085-3.788 1.085h-7.856c-1.355 ';
  path += '0-3.119 0-3.795-1.494-.678-1.485.271-2.841 1.084-3.925l10.567-14.075';
  path += isFull ? 'h-16.2' : 'H82.8';
  path += '64l-6.49 8.664c-1.086 1.451-2.03 2.707-2.03 4.329 0 1.627.869 2.799 2.03 ';
  path += '4.338l1.63 2.162c1.613 2.165 3.244 4.335 5.41 5.418 2.171 1.08 4.738 1.08 ';
  path += '8.263 1.08h7.046c4.058 0 10.159 0 14.217-4.058C1';
  if (isFull) {
    path += '43 56.871 143 50.916 143 48.743v-6.499c0-2.167 ';
    path += '0-8.125-4.062-12.185C134.881 26 128.779 26 124.722 26h-11.24';
  } else {
    path += '17 30.871 117 24.916 117 22.743v-6.499c0-2.167 ';
    path += '0-8.125-4.062-12.185C108.881 0 102.779 0 98.722 0H87.47';
  }
  path += '6c-1.08 0-2.437 0-3.515 1.079-1.098 1.084-1.098 2.435-1.098 3.522 M';
  path += isFull ? '89.372 39' : '63.372 13';
  path += '.004h16.244l-19.495 26';
  path += isFull ? 'H69.872zM26 43' : 'h-16.25zM0 17';
  path += '.596c0-1.079 0-2.433 1.083-3.519 1.085-1.073 2.434-1.073 ';
  path += '3.521-1.073h27.217c3.519 0 6.096 0 8.259 1.073 2.168 1.085 3.792 3.254 5.425 ';
  path += '5.417l1.617 2.174c1.151 1.536 2.034 2.707 2.034 4.329 0 1.627-.94 ';
  path += '2.884-2.034 4.338l-6.498 8.668H';
  path += isFull ? '50' : '24';
  path += '.371l10.563-14.088c.817-1.079 1.764-2.434 ';
  path += '1.089-3.931-.683-1.49-2.44-1.49-3.802-1.49';
  path += isFull ? 'h-12.72V78h-13V45.495H26v-1.899' : 'H19.5V52h-13V19.495H0v-1.899';
  return path;
});
</script>
<template>
<svg class="rzd-logo-svg" :viewBox="viewBox">
  <path v-if="bg" :fill="bgColor" :d="bgPath"/>
  <g :fill="txtColor">
    <path :d="path" />
  </g>
  </svg>
</template>
<style>
.rzd-logo-svg {
  width: v-bind(width)px;
  height: v-bind(height)px;
}
</style>