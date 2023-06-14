<!-- eslint-disable no-unused-vars -->
<script setup>
import {ref, onMounted} from 'vue';
const COMPONENT_NAME = 'base-empty';
// eslint-disable-next-line no-undef
const emits = defineEmits(['base-empty-emit']);

// eslint-disable-next-line no-undef
const props = defineProps({
  s: {type: String, default: 'empty'},
});
const dataString = ref(''); 
onMounted(async () => {setTimeout(()=>console.log('1s'), 1000)});
</script>

<template>
<span :id="COMPONENT_NAME" :class="COMPONENT_NAME">{{s}}</span>
</template>

<style lang="scss" scoped>
</style>