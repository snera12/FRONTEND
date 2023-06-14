<script setup>
// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  title: { type: String, default: '' },
  kebabName: { type: String, default: 'second-title' },
  path: { type: String, default: '' },
  elClasses: { type: Array, default: ()=>[] },
});
</script>

<template>
  <span
    :id="`secondTitle-${kebabName}`"
    :class="['second-title', `second-title-${kebabName}`, ...elClasses]"
  >
    <div class="second-title__row">
      <span class="second-title__row__title">
        {{title}}
      </span>
      <span class="second-title__row__after-title">
        <slot name="after-title"></slot>
      </span>
    </div>
  </span>
</template>

<style lang="scss" scoped>

.second-title {
  display: block;
  margin-top: 12px;
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  font-size: 21px;
  background-color: var(--board-head-bg-color);

  &__row {
    display: flex;
    flex-direction: row;
    align-self: normal;
    justify-content: space-between;
    padding-top: 12px;

    &__title {
      font-weight: bold;
      letter-spacing: 0.2px;
      word-spacing: 5px;
      text-align: left;
      padding-left: 8px;
    }
    &__after-title {
      margin-right: 8px;
    }
  }
}
</style>