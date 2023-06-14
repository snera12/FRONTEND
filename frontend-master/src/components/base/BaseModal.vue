<script setup>
// eslint-disable-next-line no-undef
const emits = defineEmits([
  'base-modal-close',
  'base-modal-mousedown',
  'base-modal-btn'
]);

// eslint-disable-next-line no-undef
const props = defineProps({
  title: { type: String, default: '' },
  btns: { type: [Object, Boolean], default: false },
  // options: https://v3.vue-final-modal.org/guide/properties
  //   :fit-parent="true" //maybe
  //   drag-selector="" //maybe
  //   :keep-changed-style="false" //maybe
  name: { type: String, default: null },
  classes: { type: [String, Array], default: ()=>['modal-container'] },
  contentClass: { type: [String, Array], default: ()=>['modal-content'] },
  contentStyle: { type: [Object, Array], default: ()=>({}) },
  drag: { type: Boolean, default: false },
  dragSelector: { type: String, default: '' },
  resize: { type: Boolean, default: false },
  resizeDirections: {
    type: Array,
    default: ()=>['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
  },
  minMaxSizes: {
    type: Object,
    default: ()=> ({ minH: 50, maxH: 1920, minW: 200, maxW: 3200})
  },
  size: { type: String, default: 'sm' },
  windowsMode: { type: Boolean, default: false },
  zIndex: { type: [Number, Boolean], default: 1000 },
  notOverlayHead: { type: Boolean, default: false }
});

const getClasses = (classes, size = false) => {
  const re = /\s*,\s*/; // del spaces before comma
  let result = typeof(classes) === 'string' ? classes.split(re) : classes;
  result = result.filter(cssClass =>
    cssClass !== '' && !(cssClass.includes(' ')) && !(cssClass.includes('.')));
  if (size) {
    let sizeClass = 'modal-size-';
    switch (props.size) {
    case 'card': sizeClass += 'card'; break;
    case 'sm': sizeClass += 'small'; break;
    case 'md': sizeClass += 'middle'; break;
    case 'lg': sizeClass += 'large'; break;
    case 'print': sizeClass += 'print'; break;
    }
    result.push(sizeClass);
    result.push('modal-content');
  }
  return result;
};
const onMousedown = () => emits('base-modal-mousedown', props.name);
const closed = () => emits('base-modal-close', props.name);
const onClickBtns = (key, ...args) => emits('base-modal-btn',
  [(props.btns[key]?.emit || props.btns[key]?.text || key), ...args]);
</script>

<template>
  <vue-final-modal
    v-slot="{ params, close }"
    v-bind="$attrs"
    @closed="closed()"
    :name="name"
    :classes="getClasses(classes)"
    :content-style="contentStyle"
    :content-class="getClasses(contentClass, true)"
    :click-to-close="false"
    :esc-to-close="false"
    :drag="drag"
    :drag-selector="!drag ? '' :
      dragSelector ? '.' + dragSelector : 'base-modal-drag'"
    :hide-overlay="windowsMode"
    :attach="notOverlayHead ? '.base-page-without-head' : false"
    :prevent-click="windowsMode"
    :z-index="windowsMode || zIndex ? zIndex : false"
    :z-index-base="windowsMode ? zIndex : 1000"
    :z-index-auto="!windowsMode"
    :resize="resize"
    :min-width="minMaxSizes.minW"
    :max-width="minMaxSizes.maxW"
    :min-height="minMaxSizes.minH"
    :max-height="minMaxSizes.maxH"
  >
    <div class="base-modal" @mousedown="onMousedown()">
      <div :class="['base-modal__top-padding-block',
        dragSelector,
        drag ? 'base-modal-drag' : '']" />
      <span v-if="title"
        :class="['base-modal__slot-title',
        drag ? dragSelector || 'base-modal-drag' : '']"
      >
        <slot name="title">
          <span
            :id="`modal-${name}-title`"
            :class="['base-modal__title', `modal-${name}__title`]"
          >
            {{title}}
          </span>
        </slot>
      </span>
      <div class="base-modal__slot-content">
        <slot name="content" :params="params"></slot>
      </div>
      <div class="base-modal__slot-action">
        <slot name="action" @close="close"></slot>
      </div>
      <button class="base-modal__close" @click="close"> Х </button>
      <base-buttons-set
        v-if="btns"
        :btns="btns"
        :args="[close.onClose]"
        @buttons-set-btn="args => onClickBtns(close, ...args)"
      />
    </div>
  </vue-final-modal>
</template>

<style scoped lang="scss">
::v-deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--menu-bg-color);
  background: var(--closer-bg-color);
}
::v-deep(.modal-size-small) {
  min-width: min(45%, 600px);
  width: min(45%, 600px);
  max-width: min(45%, 600px);
  max-height: calc(100vh - 50px);
}
::v-deep(.modal-size-card) {
  position: 'absolute';
  min-width: 638px;
  width: 638px;
  max-width: 638px;
  height: min-content !important;
  max-height: calc(100vh - 50px);
}
::v-deep(.modal-size-middle) {
  min-width: min(70%, 900px);
  width: min(70%, 900px);
  max-width: min(70%, 900px);
  max-height: calc(100vh - 50px);
}
::v-deep(.modal-size-large) {
  min-width: 90%;
  width: 90%;
  max-width: 90%;
  max-height: calc(100vh - 50px);
}
::v-deep(.modal-size-print) {
  min-width: 240mm;
  width: 240mm;
  max-width: 240mm;
}
.base-modal {
  padding: 0 1rem 1rem 1rem;
  &__top-padding-block {
    display: block;
    position: relative;
    width: calc(100% + 2rem);
    left: -1rem;
    height: 1rem;
    margin: 0;
    padding: 0;
  }
  &__slot-title {
    margin: 0 2rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  &__slot-content {
    flex-grow: 1;
    overflow-y: auto;
  }
  &__slot-action {
    display: block;
  }
  &__close {
    align-self: center;
    position: absolute;
    top: 0.5rem;
    right: 0.9rem;
    @media print {
      display: none !important;
    }
  }
}
</style>

<style scoped>
.dark-mode div ::v-deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
.base-modal-drag:hover{
  cursor: move;
}
</style>