import { ref, computed, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { usePermissionsStore } from '@/store/permissionsStore.js';
import { getRolesDescription } from '@/utils/ApiUtils';

// TODO: isLogined, BD, settings (theme, tablePagination, etc)

export const useUserSettingsStore = defineStore('userSettings', () => {
  const permissionsStore = usePermissionsStore();
  const { rawJSON, hasJSON } = storeToRefs(permissionsStore);
  const fetchUserData = () => permissionsStore.fetchPermissions();
  fetchUserData();
  
  const user = ref({ username: 'Пользователь' });
  
  let hasName = false;
  const setUser = rawJSON => {
    hasName = !!rawJSON?.username;
    if (!hasName) return;
    
    const {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      is_superuser: isSuperuser,
      groups: roles,
    } = rawJSON;
    user.value = { username, firstName, lastName, email, isSuperuser, roles };
    if (isSuperuser) roles.push('superadm');
    user.value.rolesDescriptions = getRolesDescription(roles);
  };

  watch(hasJSON, (_new, _old) => setUser(rawJSON.value));

  const getUsername = computed(() => user.value.username);
  const getRoles = computed(() => user.value.rolesDescriptions);

  return {
    fetchUserData,
    user,
    setUser,
    getUsername,
    getRoles
  };
});