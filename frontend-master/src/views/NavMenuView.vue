<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import useBaseUrl from '@/composables/useBaseUrl.js';
import { useARMSettingsStore } from '@/store/ARMSettingsStore.js';
import { useMessageStore } from '@/store/messageStore.js';
import { useWebsocketsStore } from '@/store/websocketsStore.js';
import { useUserSettingsStore } from '@/store/userSettingsStore.js';
import { usePermissionsStore } from '@/store/permissionsStore.js';
import { getMainNavPoints, getBottomNavPoints,
  getUrlByItemId } from '@/router/urlsUtils.js';
import { onClickOldLink } from '@/composables/useJumpToAlphaModal.js';
import BaseNavMenu from '@/components/base/BaseNavMenu.vue';
import rzdLogoSvg from '@/components/svg/rzdLogoSvg.vue';

const { ARMSettings } = storeToRefs(useARMSettingsStore());
const { userPermissions } = storeToRefs(usePermissionsStore());
const { isURLAllowed, addURLToAllowed } = usePermissionsStore();

const route = useRoute();
const curItemURL = computed(() => getUrlByItemId(route.name));
onBeforeMount(()=> {
  if (!isURLAllowed(curItemURL.value)) addURLToAllowed(curItemURL.value);
});
const mainNavPoints = computed(() => getMainNavPoints(userPermissions.value.allowedURLs));
const bottomNavPoints = computed(() =>
  getBottomNavPoints(userPermissions.value.allowedURLs));

// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  CSSClasses: { type: Array, default: ()=>[] },
  path: { type: String, default: ''},
});

const { baseUrl } = useBaseUrl();

const { getUsername } = storeToRefs(useUserSettingsStore());

const wsStore = useWebsocketsStore();
const wsMessageStore = wsStore.websockets.message;
const messageStore = useMessageStore();

const logoHovered = ref(false);
const logoColor = computed(()=> logoHovered.value ? 'neg' : 'pos');

</script>

<template>
  <aside id="sidebar" :class="['sidebar', 'unselectable', ...CSSClasses]">
    <div
      id="sidebar-header"
      class="sidebar__header menu-h1"
      @mouseover="logoHovered = true"
      @mouseleave="logoHovered = false"
      @click="onClickOldLink('products/')"
    >
      <span
        id="rzd-logo"
        class="sidebar__header__rzd-logo"
      >
        <rzd-logo-svg
          id="rzd-logo-img"
          class="sidebar__header__rzd-logo__img"
          :color="logoColor"
        />
      </span>
      <span
        id="arm-logo-text"
        class="sidebar__header__arm-logo__text"
      >
        АРМ СУМ КС
      </span>
    </div>
    <div
      v-if="ARMSettings.prefix && ARMSettings.segment && ARMSettings.tsum"
      class="sidebar__arm-system-rank"
    >
      {{ARMSettings.prefix.value}}{{ARMSettings.segment.value}} {{ARMSettings.tsum.value}}
    </div>
    <div
      id="sidebar-nav"
      class="sidebar__nav scrollable-y no-scrollbar"
    >
      <base-nav-menu
        :baseUrl = "baseUrl"
        :points = "mainNavPoints"
        ariaLabel = "Основная навигация"
        :CSSClasses = "['sidebar__nav__main']"
        id="sidebar-nav-main"
      >
        <template v-slot:userName>
          {{getUsername}}
        </template>
        <template v-slot:messenger>
          <span
            id="nav-menu-messenger"
            class="sidebar__nav__main__messenger"
          >
            Сообщения
            <span class="alpha-version">&alpha;</span>
            <span
              id="nav-menu-messenger-counter"
              class="sidebar__nav__main__messenger__counter"
            >
              {{messageStore.getUnreadCounter || ''}}
            </span>
            <span
              id="nav-menu-messenger-indicator"
              :class="['sidebar__nav__main__messenger__online-indicator',
                `sidebar__nav__main__messenger__online-indicator-${
                  wsMessageStore.isConnected ? 'green': 'red'}`]"
            >&#11044;</span>
          </span>
        </template>
      </base-nav-menu>
      <base-nav-menu
        :baseUrl = "baseUrl"
        :points = "bottomNavPoints"
        ariaLabel = "Меню пользователя"
        :CSSClasses = "['sidebar__nav__bottom']"
        id="sidebar-nav-bottom"
      />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
@import '@/scss/variables.scss';
@import '@/scss/themes/blue/color-vars.scss';
@import '@/scss/fonts.scss';

.sidebar,
.sidebar__header,
.sidebar__nav {
  position: relative;
  display: flex;
  background-color: var(--closer-color);
}

.sidebar {
  margin: 0px;
  padding: 0px;
  height: 100%;
  max-height: 100%;
  max-width: 248px;

  flex-direction: column;
  flex: 1;
  
  color: var(--menu-txt-color);
  font-family: "FSRailway", "IBM_Plex_Sans", sans-serif;
  font-weight: normal;
  font-style: normal;
  letter-spacing: -0.15px;

  &__header {
    height: 50px;
    min-height: 50px;
    max-height: 50px;
    align-self: normal;
    
    flex-direction: row;
    justify-content: left;

    text-align: center;

    &__rzd-logo, &__arm-logo__text {
      position: relative;
      display: block;
    }

    &__rzd-logo {
      margin: 5px 0 3px 20px;
      height: calc(50px - 5px - 3px);
      width: calc((50px - 5px - 3px)*13/8); 
    }

    &__arm-logo__text {
      font-family: var(--title-font-family);
      font-weight: 900;
      font-stretch: expanded;
      font-weight: bolder;
      padding-left: 18px;
      padding-top: 16px;
    }
  }
  &__arm-system-rank {
    position: relative;
    padding: 4px 0px 0px 23px ;
    margin-bottom: 6px;
    font-family: "FSRailway", "IBM_Plex_Sans", sans-serif;
    color: rgba(206, 218, 225, 0.5);
    font-size: 13px;
  }

  &__header:hover {
    color: var(--rzd-red-color);
    cursor: pointer;
  }

  &__nav {
    flex-direction: column;
    flex: 1;

    &__main {
      &__messenger {
        &__online-indicator,
        &__counter {
          margin-left: 10px;
        }

        &__online-indicator {
          &-red {
            color: red;
          }
          &-green{
            color: green;
          }
        }
      }
    }
    &__bottom {
      margin-top: auto;
    };
  }
}
</style>