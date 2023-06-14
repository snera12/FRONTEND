<script setup>
import { storeToRefs } from "pinia";
import { usePermissionsStore } from '@/store/permissionsStore.js';
import { useUserSettingsStore } from '@/store/userSettingsStore.js';
import useBaseUrl from '@/composables/useBaseUrl.js';
import { getItemByUrl } from '@/router/urlsUtils.js';
import { TYPES } from '@/router/urls.js';

const CMP_NAME = 'user-permissions-modal';
const { getUsername, getRoles, user } = storeToRefs(useUserSettingsStore());
const { userPermissions } = storeToRefs(usePermissionsStore());
const { baseUrl } = useBaseUrl();
</script>
<template>
  <div :class="CMP_NAME">
    <div :class="CMP_NAME +'__title'">
      Роли и права (разрешения) пользователя {{getUsername}}.
    </div>
    <div :class="CMP_NAME + '__body'">
      Пользователь <b>{{getUsername}}</b> имеет следующие <b>роли</b> в АРМ СУМ КС:
      <ul>
        <li v-for="role, i in getRoles" :key="i">
          {{ role }}
        </li>
      </ul>
      <div v-if="user.isSuperuser">
        Пользователю c ролью <b>Суперадмин</b> дополнительно доступны страницы:
        <ul>
          <li v-for="URL, i in userPermissions.URLsToSuperUser" :key="i">
            <a
              v-if="getItemByUrl(URL).type === TYPES.old"
              :href="baseUrl + URL"
            >
              {{getItemByUrl(URL).title}}
            </a>
            <router-link
              v-if="getItemByUrl(URL).type === TYPES.rout"
              :to="URL"
              :target="getItemByUrl(URL).blank ? '_blank' : '_self'"
            />
          </li>
        </ul>
      </div>
      В соответствии с этими ролями, пользователь <b>{{getUsername}}</b>
      имеет следующие <b>разрешения</b>:
      <ul>
        <li v-for="permission, i in userPermissions.ruList" :key="i">
          {{ permission }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.user-permissions-modal {
  display: block;
  min-height: min(150px, 10vw);
  max-height: calc(100vh - 100px);
  overflow-x: hidden;
  overflow-y: hidden;

  &__title {
    padding: 0 2rem;
    font-size: 21px;
    text-align: center;
  }
  &__body {
    margin-top: 1rem;
    overflow-y: auto;
    max-height: calc(100vh - 175px);
  }
}
</style>