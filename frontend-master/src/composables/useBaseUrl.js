import { getBaseUrl } from '@/utils/utils.js';
import { ref } from 'vue';

const useBaseUrl = () => {
  const baseUrl = ref('');
  baseUrl.value = getBaseUrl();
  return { baseUrl };
};

export default useBaseUrl;