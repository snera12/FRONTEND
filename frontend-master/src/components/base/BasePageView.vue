<script setup>
import NavMenuView from '@/views/NavMenuView.vue';

// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  title: { type: String, default: '' },
  kebabName: { type: String, default: 'base-page' },
  path: { type: String, default: '' },
  pageClasses: { type: Array, default: ()=>[] },
  dashboardClasses: { type: Array, default: ()=>[] },
  titleTooltip: { type: String, default: '' }
});
</script>

<template>
  <div
    :id="`page-${kebabName}`"
    :class="['base-page', `page-${kebabName}`, ...pageClasses]"
  >
    <nav-menu-view :path="path"/>
    <div
      :id="`page-${kebabName}-board`"
      :class="['base-page__board', `page-${kebabName}__board`]"
    >
      <div id="base-page-head" class="base-page__head">
        <div class="base-page__head-row">
          <span
            :id="`page-${kebabName}-title`"
            :class="['base-page__title', `page-${kebabName}__title`]"
            :title="titleTooltip"
          >
            {{title}}
          </span>
          <span class="base-page__after-title">
            <slot name="after-title"></slot>
          </span>
        </div>
      </div>
      <div
        :id="`page-${kebabName}-dashboard`"
        :class="[
          'base-page__dashboard',
          `page-${kebabName}__dashboard`,
          ...dashboardClasses
        ]"
      >
        <slot name="dashboard"></slot>
        <slot name="tools"></slot>
      </div>
      <div id="base-page-footer" class="base-page__footer">
        <slot name="footer"></slot>
        <div class="base-page__footer__copyright">
          АРМ СУМ КС v0.3.28 &#169; Разработано Университетом ИТМО для ОАО «РЖД»
        </div>
      </div>
    </div>
  </div>
  <div class="base-page-without-head"></div>
</template>

<style lang="scss">

.base-page {
  position: relative;
  display: flex;
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  margin: 0px;
  padding: 0px;
  font-family: var(--regural-font-family);

  &__board {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    position: relative;
  }
  
  &__head {
    height: 50px;
    min-height: 50px;
    max-height: 50px;
    font-size: 21px;
    background-color: var(--board-head-bg-color);

    &-row {
      display: flex;
      flex-direction: row;
      align-self: normal;
      justify-content: space-between;
      padding-top: 12px;
    }
  }
  &__title {
    font-family: var(--title-font-family);
    font-weight: bold;
    font-stretch: expanded;
    word-spacing: 5px;
    text-align: left;
    padding-left: 8px;
  }
  &__after-title {
    margin-right: 8px;
  }
  &__footer {
    margin-top: auto;
    padding: 25px 10px 10px;

    &__copyright {
      font-family: "FSRailway", "IBM_Plex_Sans", sans-serif;
      font-size: 12px;
      color: #768d99;
      text-align: center;
    }
  }
}
.base-page-without-head {
  display: block;
  position: absolute;
  margin-top: 50px;
  height: calc(100vh - 50px);
  width: 100vw;
  left: 0px;
  top: 0px;
  pointer-events: none;
  background: rgba(0,0,0,0);
}
</style>