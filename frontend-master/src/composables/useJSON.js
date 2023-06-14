import { ref, onMounted } from 'vue';
import { getPureUrlLocation } from '@/utils/utils.js';

export const JSON_SUFFIX_OBJECT_LIST = '/?json=true&json_object_list';
export const JSON_SUFFIX_DATA = '/?json=true';
const needConsole = false;

// import this fn, if you need async but not reactive data;
export const getJSON = async ({
  url,
  suffixStr = false,
  suffixName,
  jsonMethod = false
}) => {
  if (needConsole) console.log('url:', url);
  let suffix = typeof(suffixStr) === 'string' ? suffixStr : '';
  if (needConsole) console.log('suffix:', suffix);
  if (!suffixStr && suffixStr !== '') {
    switch (suffixName) {
    case 'data': suffix = JSON_SUFFIX_DATA; break;
    case 'object': default: suffix = JSON_SUFFIX_OBJECT_LIST; break;
    case false: suffix = ''; break;
    }
  }
  if (needConsole) console.log('suffix:', suffix);

  url = getPureUrlLocation(url); // if (!url) get it, else check and repair
  const JSONURL = url + suffix;
  if (needConsole) console.log('JSONURL:', JSONURL);

  jsonMethod = jsonMethod || (suffix === JSON_SUFFIX_DATA ? 'json' : 'text');
  if (needConsole) console.log(jsonMethod);

  let resultJson = {};
  // TODO: add try-catch
  await fetch(JSONURL).then(async res => {
    if (res.ok) {
      if (needConsole) console.log('res:', res);
      let result;
      jsonMethod === 'json' ?
        await res.json().then(json => result = json.data) :
        await res.text().then(text => result = JSON.parse(text));  
      if (needConsole) console.log('result:', result);
      return result;
    }
  }).then(json => resultJson = json);
  return resultJson;
};

// import this fn, if you need async & reactive data
export default function useJSON(options = {}) {
  const json = ref({});
  const updateJSON = async () => json.value = await getJSON(options);
  onMounted(updateJSON);
  return { json, updateJSON, JSON_SUFFIX_OBJECT_LIST, JSON_SUFFIX_DATA };
}