import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { getJSON } from '@/composables/useJSON.js';
import useBaseUrl from '@/composables/useBaseUrl.js';
import { camalize } from '@/utils/utils.js';
import { ARM_SETTINGS_NAMES_INTERFACE, SEGMENT_EXCLUDE_URLS,
  SEGMENT_EXCLUDE_PERMISSIONS_CODENAMES } from '@/utils/ApiUtils.js';

export const useARMSettingsStore = defineStore('armSettings', () => {
  // TODO: baseURL to ARM settings and import it anywhere  
  const settingsJson = ref(null);

  const fetchARMSettings = async () => {
    const { baseUrl } = useBaseUrl(); 
    settingsJson.value = await getJSON({
      url: `${baseUrl.value}core/settings`,
      suffixStr: '?json=true&settings_list',
      jsonMethod: 'text'
    });
  };
  fetchARMSettings();

  const hasJSON = computed(() => !!settingsJson.value);

  const ARMSettings = ref({});

  watch(hasJSON, () => {
    const arr = settingsJson.value?.settings_list || false;
    if (!arr) return;
    arr.forEach((_setting, i) => {
      const { id, key: rawKey, value: rawValue } = arr[i];
      // TODO: update after update backend;
      let value = rawValue;
      let valueIsJSON;
      try {
        value = JSON.parse(rawValue);
        valueIsJSON = true; 
      } catch {
        valueIsJSON = false;
      }
      let key = camalize(rawKey);
      key = ARM_SETTINGS_NAMES_INTERFACE[key] || key;
      ARMSettings.value[key] = { rawKey, key, id, value, valueIsJSON };
    });
  });

  const excludeCodeNames = computed(() => {
    const { segment } = ARMSettings.value;
    return segment?.value ?
      SEGMENT_EXCLUDE_PERMISSIONS_CODENAMES[segment.value] || [] : [];
  }); 

  const excludeURLs = computed(() => {
    const { segment } = ARMSettings.value;
    return segment?.value ? SEGMENT_EXCLUDE_URLS[segment.value] || [] : [];
  });

  return {
    fetchARMSettings,
    settingsJson,
    ARMSettings,
    hasJSON,
    excludeCodeNames,
    excludeURLs,
  };
});