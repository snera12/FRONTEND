import { ref, computed, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { getJSON } from '@/composables/useJSON.js';
import useBaseUrl from '@/composables/useBaseUrl.js';
import { PERMISSIONS_KEYS, URLS_KEYS, getUserPermissionsEmptyObj,
  handleAllowedURLS, handlePermissions, getPermissionsTextList
} from '@/utils/handlePermissions.js';
import { getAllowsURLsToAll, getAllowsURLsToSuperUser } from '@/router/urlsUtils.js';
import { useARMSettingsStore } from '@/store/ARMSettingsStore.js';

export const usePermissionsStore = defineStore('permissions', () => {
  const rawJSON = ref(null);
  const userPermissions = ref(getUserPermissionsEmptyObj());
  userPermissions.value.URLsToSuperUser = getAllowsURLsToSuperUser();
  userPermissions.value.allowedURLs = getAllowsURLsToAll(); // show items before get json

  const fetchPermissions = async () => {
    const { baseUrl } = useBaseUrl(); 
    rawJSON.value = await getJSON({
      url: `${baseUrl.value}accounts/currentuser`,
      suffixStr: '',
    });
  };
  const hasJSON = computed(() => !!rawJSON.value);

  watch(hasJSON, (_new, _old) => {
    const { permissions, is_superuser: isSuperUser } = rawJSON.value;
    if (!permissions) return;
    setPermissions(handlePermissions(permissions));

    const { excludeAtSegmentCodeNames } = userPermissions.value;
    if (excludeAtSegmentCodeNames.length) {
      filterCodeNamesOfDissalowed();
      const { codeNames } = userPermissions.value;
      userPermissions.value.ruList = getPermissionsTextList(codeNames);
    }

    const { excludeAtSegmentURLs, codeNames } = userPermissions.value;
    setPermissions(handleAllowedURLS({codeNames, isSuperUser}));
    if (excludeAtSegmentURLs.length) filterAllowedURLsOfDissalowed();
  });

  const setPermissions = settingsObj => {
    [...PERMISSIONS_KEYS, ...URLS_KEYS].forEach(key => {
      if (settingsObj[key]?.length) userPermissions.value[key] = settingsObj[key];
    });
  };

  const getPermissionsList = computed(() => userPermissions.value.ruList);
  const setDisallowCodeNames = codeNames =>
    userPermissions.value.excludeAtSegmentCodeNames = codeNames;

  const { excludeCodeNames } = storeToRefs(useARMSettingsStore());

  const filterCodeNamesOfDissalowed = (
    excludeCodeNames = userPermissions.value.excludeAtSegmentCodeNames
  ) => {
    const { codeNames } = userPermissions.value;
    userPermissions.value.codeNames = codeNames.filter(codeName =>
      !excludeCodeNames.includes(codeName));
  };

  watch(excludeCodeNames, (codeNames, _old) => {
    setDisallowCodeNames(codeNames);
    filterCodeNamesOfDissalowed(codeNames);
  });
  const isURLAllowed = URL => userPermissions.value.allowedURLs.includes(URL);
  
  const isURLDissalowed = URL => userPermissions.value.excludeAtSegmentURLs.includes(URL);
  const addURLToAllowed = URL => {
    if (!isURLDissalowed(URL)) userPermissions.value.allowedURLs.push(URL);
  };

  const setDisallowURLs = URLs => userPermissions.value.excludeAtSegmentURLs = URLs;

  const { excludeURLs } = storeToRefs(useARMSettingsStore());

  const filterAllowedURLsOfDissalowed =
    (URLs = userPermissions.value.excludeAtSegmentURLs) => {
      const { allowedURLs } = userPermissions.value;
      userPermissions.value.allowedURLs = allowedURLs.filter(url => !URLs.includes(url));
    };

  watch(excludeURLs, (URLs, _old) => {
    setDisallowURLs(URLs);
    filterAllowedURLsOfDissalowed(URLs);
  });

  return {
    rawJSON,
    hasJSON,
    fetchPermissions,
    userPermissions,
    getPermissionsList,
    setDisallowCodeNames,
    filterCodeNamesOfDissalowed,
    isURLAllowed,
    addURLToAllowed,
    excludeURLs,
    setDisallowURLs,
  };
});