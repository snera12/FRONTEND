<script setup>
const { computed }=require("@vue/runtime-core");

// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  btnName: {type: String, default: 'btn-name'},
  classes: {type: [String, Array], default: ''},
  text: {type: String, default: 'Кнопка'},
});
const classes = computed(()=> {
  const arr = ['btn'];
  if (typeof(props.classes) === 'string') arr.push(props.classes);
  if (Array.isArray(props.classes)) arr.push(...props.classes);
});
</script>

<template>
  <button
    :id="props.btnName"
    :class="classes || `${btnName}-btn`"
    @click.prevent="$emit(`btn-${props.btnName}`, 'click')"
  >
    {{text}}
  </button>
</template>

<style lang="scss">
</style>