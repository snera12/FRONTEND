<script setup>
import { onMounted, ref, computed, toRefs, watch } from 'vue';
import { useRoute } from 'vue-router';
import { onClickOldLink } from '@/composables/useJumpToAlphaModal.js';
import { TYPES } from '@/router/urls.js';
import { getSubmenuAndItemsIds } from '@/router/urlsUtils.js';
import { kebabize } from '@/utils/utils.js';
import { arrowPartSvg } from '@/components/svg/arrowPartSvg.js';
import { getStringToSetSVGAsBGURL } from '@/components/svg/svgUtils.js';

// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  baseUrl: { type: String, default: ''},
  points: { type: Array, default: () => {} },
  ariaLabel: { type: String, default: 'навигационное меню'},
  CSSClasses: { type: Array, default: ()=>['base-nav'] },
});
const { points } = toRefs(props);
const submenuAndItemsIds = computed(() => getSubmenuAndItemsIds(points.value));
const route = useRoute();
const currentSubmenuId = computed(() =>
  Object.keys(submenuAndItemsIds.value).find(key =>
    submenuAndItemsIds.value[key].includes(route.name))
);

watch(points, (newPoints, oldPoints) => {
  const curId = currentExpandSubmenuId.value;
  const newSub = newPoints.find(point => point.id === curId);
  const oldSub = oldPoints.find(point => point.id === curId);
  if (oldSub && oldSub.items && newSub.items.length !== oldSub.items.length) {
    currentExpandSubmenuId.value = '';
    setTimeout(() => currentExpandSubmenuId.value = curId, 0);
  }
});

const currentExpandSubmenuId = ref('');
onMounted(() => currentExpandSubmenuId.value = currentSubmenuId.value);
const onSubmenuClick = point => currentExpandSubmenuId.value = point.id;

const onItemClick = ({ urlPrefix = '', item }) => {
  const { type, url = '' } = item;
  const fullURL = urlPrefix + url;
  switch (type) {
  case TYPES.old: onClickOldLink(fullURL); break;
  case TYPES.ext: case TYPES.blank: window.open(props.baseUrl + fullURL, '_blank'); break;
  case TYPES.simple: window.open(props.baseUrl + fullURL, '_self'); break;
  }
};

let firstOpen = true;
const ITEM_HEIGHT = 31; // height = 30px; margin-bottom = 1px;
const submenuBeforeEnter = ({elem, point}) => {
  elem.style.height = !firstOpen ? '0' : point.items.length * ITEM_HEIGHT + 'px';
  if (firstOpen) firstOpen = false;
};
const submenuEnter = elem => elem.style.height = elem.scrollHeight + 'px';
const submenuBeforeLeave = elem => elem.style.height = elem.scrollHeight + 'px';
const submenuLeave = elem => elem.style.height = '0';

const arrowPartSvgInCSS = getStringToSetSVGAsBGURL(arrowPartSvg);
</script>

<template>
  <nav role="navigation"
    :aria-label="ariaLabel"
    :class="['base-nav-menu', ...CSSClasses]"
  >
    <div
      v-for="point, i in points" :key="point.id"
      class="base-nav-menu__point"
      :id="kebabize(point.id) || `point-${i}`"
    >
      <div
        v-if="point.type === TYPES.submenu"
        :class="[
          'base-nav-menu__point__submenu',
          currentSubmenuId === point.id ? 'active' : 'disactive',
          currentExpandSubmenuId === point.id ? 'expand' : 'collapse'
        ]"
        :id="`submenu-point-${kebabize(point.id)}`"
        @click="onSubmenuClick(point)"
      >
        <span
          :class="[
            'base-nav-menu__point__submenu__title',
            `base-nav-menu__point__submenu__title-${kebabize(point.id)}`
          ]"
          :id="`submenu-title-${kebabize(point.id)}`"
        >
          <span v-if="point.dinamicTitle" >
            <slot :name="point.id" :attrs="point"></slot>
          </span>
          <span v-else>
            {{point.title}}
          </span>
        </span>
        <transition
          name="accordion"
          mode="out-in"
          @before-enter="elem => submenuBeforeEnter({elem, point})"
          @enter="submenuEnter"
          @before-leave="submenuBeforeLeave"
          @leave="submenuLeave"
        >
          <section
            v-if="currentExpandSubmenuId === point.id"
            class="base-nav-menu__point__submenu__section"
          >
            <div
              v-for="item in point.items" :key="item.id"
              class="base-nav-menu__point__submenu__section__item"
              :id="`submenu-${kebabize(point.id)}-item-${kebabize(item.id)}`"
            >
              <div
                v-if="item.type === TYPES.modal"
                :class="[
                  'base-nav-menu__point__submenu__section__item__modal-title',
                  `nav-menu-modal-${kebabize(point.id)}-${kebabize(item.id)}`
                ]"
                @click="item.fn()"
                :id="`submenu-${kebabize(point.id)}-item-modal-${kebabize(item.id)}`"
              >
                {{item.title}}
              </div>
              <router-link
                v-else-if="item.type === TYPES.rout"
                :to="'/' + (point.url || '') + (item.url || '')"
                :target="item.blank ? '_blank' : '_self'"
                :class="[
                  'base-nav-menu__point__submenu__section__item__link-title',
                  'base-nav-menu__point__submenu__section__item__router-link-title',
                  `nav-menu-link-${kebabize(point.id)}-${kebabize(item.id)}`
                ]"
                :id="`submenu-${kebabize(point.id)}-item-link-${kebabize(item.id)}`"
              >
                {{ item.title }}
              </router-link>
              <div
                v-else
                @click="onItemClick({urlPrefix: point.url, item})"
                :class="[
                  'base-nav-menu__point__submenu__section__item__link-title',
                  `base-nav-menu__point__submenu__section__item__${
                    kebabize(item.type)}-title`,
                  `nav-menu-link-${kebabize(point.id)}-${kebabize(item.id)}`
                ]"
                :id="`submenu-${kebabize(point.id)}-item-${kebabize(item.type)}-${
                  kebabize(item.id)}`"
              >
                <span>
                  {{item.title}}
                  <span
                    v-if="item.type === TYPES.old"
                    class="alpha-version"
                  >&alpha;</span>
                </span>
              </div>
            </div>
          </section>
        </transition>
      </div>
      <!-- end of submenu -->
      <div
        v-if="point.type === TYPES.modal"
        :class="[
          'base-nav-menu__point__modal',
          `nav-menu-modal-${kebabize(point.id)}-${kebabize(point.id)}`
        ]"
        :id="`item-modal-${kebabize(point.id)}`"
        @click="point.fn()"
      >
        <span class="base-nav-menu__point__modal__title">
          {{point.title}}
        </span>
      </div>
      <router-link
        v-else-if="point.type===TYPES.rout"
        :to="'/' + point.url"
        :target="point.blank ? '_blank' : '_self'"
        :class="[
          'base-nav-menu__point__link',
          'base-nav-menu__point__router-link',
          `nav-menu-item-${kebabize(point.id)}}`
        ]"
        :id="`item-link-${kebabize(point.id)}`"
      >
        <span :class="[
          'base-nav-menu__point__link__title',
          'base-nav-menu__point__router-link__title',
        ]">
          <span v-if="point.dinamicTitle">
            <slot :name="point.id" :attr="point"></slot>
          </span>
          <span v-else>
            {{point.title}}
          </span>
        </span>
      </router-link>
      <div
        v-else-if="point.type && point.type !== TYPES.submenu"
        @click="onItemClick({urlPrefix: '', item: point})"
        :class="[
          'base-nav-menu__point__link',
          `base-nav-menu__point__${kebabize(point.type)}`,
          `nav-menu-link-${kebabize(point.id)}-${kebabize(point.id)}`
        ]"
        :id="`item-${kebabize(point.type)}-${kebabize(point.id)}`"
      >
        <span :class="[
          'base-nav-menu__point__link__title',
          `base-nav-menu__point__${kebabize(point.type)}__title`,
        ]">
          <span v-if="point.dinamicTitle">
            <slot :name="point.id" :attr="point"></slot>
          </span>
          <span v-else>
            {{point.title}}
            <span
              v-if="point.type === TYPES.old"
              class="alpha-version"
            >&alpha;</span>
          </span>
        </span>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';
@import '@/scss/themes/blue/color-vars.scss';
@import '@/scss/fonts.scss';

.base-nav-menu {
  &__point {
    &__link,
    &__modal,
    &__submenu,
    &__submenu__section__item__modal-title,
    &__submenu__section__item__link-title {
      display: flex;
      align-self: normal;
      border-left: 3px solid rgba(0,0,0,0);
      transition: .1s linear;

      a {
        position: relative;
        color: inherit;
        text-decoration: none;
      }
    }

    &__submenu,
    &__submenu__section__item__modal-title,
    &__submenu__section__item__link-title {
      flex-direction: column;
      columns: 1;
      justify-content: center; 
    }

    &__submenu,
    &__modal,
    &__link {
      position: relative;
      min-height: 40px;
      text-align: left;
      padding-top: 8px;
      padding-bottom: 8px;

      &__title {
        display: block;
        position: relative;
        padding-left: 20px;
        padding-top: 8px;
        padding-bottom: 8px;
      }
      &__title.active {
        box-shadow: -4px 4px 5px 0px var(--menu-submenu-active-shadow-color);
      }
    }

    &__submenu {
      padding-bottom: 0px;
      padding-top: 0px;
      border-left: 0px solid rgba(0,0,0,0);

      &__title {
        display: flex;
        padding-bottom: 0px;
        padding-top: 0px;
        min-height: 40px;
        align-items: center;
        border-left: 3px solid rgba(0,0,0,0);
      }
      &__title:hover {
        border-left-color: var(--menu-txt-color);
      }
      &__title::after {
        position: absolute;
        top: 19px;
        right: 14px;
        width: 6px;
        height: 4px;
        content: '';
        background: v-bind(arrowPartSvgInCSS);
        transform: rotate(0deg);
        opacity: 0.75;
        transition: transform 0.3s, opacity 0.3s;
      }

      &__section {
        background-color: var(--menu-submenu-active-color);
        overflow: hidden;
        transition: height 0.3s ease-out;
        will-change: height;

        &__item {
          // -webkit-box-shadow:
          //   8px 0px 5px 5px var(--menu-submenu-active-shadow-color) inset;
          // -moz-box-shadow:
          // 8px 0px 5px 5px var(--menu-submenu-active-shadow-color) inset;
          // box-shadow: 8px 0px 5px 5px red inset;

          &__modal-title,
          &__link-title {
            background-color: var(--second-bg-color);
            margin-left: 20px;
            min-height: 30px;
            margin-top: 0;
            margin-bottom: 1px;
            padding-left: 20px;
            font-size: 14px;
            font-weight: normal;
          }

          .router-link-active {
            background-color: var(--active-color);
            border-left: solid 3px var(--selected-border-color);
          }

          .router-link-active:hover {
            border-left: solid 3px var(--selected-border-color);
            cursor: default;
          }
        }
      }
    }

    &__submenu__section__item__modal-title:hover,
    &__submenu__section__item__link-title:hover,
    &__modal:hover,
    &__link:hover {
      background-color: var(--active-color);
      border-left-color: var(--menu-txt-color);
      cursor: pointer;
    }

    &__submenu:hover {
      cursor: pointer;
    }

    &__submenu.active {
      margin-top: 0;
      padding-bottom: 0;
      
      background-color: var(--menu-bg-color);
      font-weight: bold;
      border-left: none;
    }

    .expand &__submenu__title::after {
      transform: rotate(180deg);
      opacity: 1;
    }

    &__submenu.active:hover {
      background-color: var(--menu-bg-color);
      cursor: default;
    }

    &__submenu.active.collapse {
      background: rgb(10, 60, 91);
    }

    .active.collapse &__submenu__title {
      border-left-color: var(--selected-border-color);
    }
  }
}

.alpha-version {
  font-style: italic;
  color: var(--second-txt-color);
}
</style>