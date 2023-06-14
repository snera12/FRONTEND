import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMessageStore = defineStore('message', () => {
  const messages = ref([]);

  const addMessage = ({data, type, msgNum}) => {
    const timestamp = (new Date).getTime();
    messages.value.push({data, type, timestamp, msgNum, readed: false});
    return timestamp;
  };

  const getLastMessage = computed(() => {
    const length = messages.value.length;
    if (!length) return;
    return messages.value[length-1].msg;
  });

  const getMessageByNum = num => {
    if (!messages.value.length || messages.value.length < num) return;
    return messages.value[num];
  };

  const getLastNMessages = value => messages.value.slice(-value);

  const getUnreadMsgs = computed(() => {
    if (!messages.value.length) return [];
    return messages.value.map(msg => msg.readed === false);
  });

  const getUnreadCounter = computed(() => getUnreadMsgs.value.length);

  const markMsgAsReaded = timestamp =>
    messages.value.find(entry => entry.timestamp === timestamp).readed = true;

  return {
    messages,
    addMessage,
    getLastMessage,
    getLastNMessages,
    getMessageByNum,
    getUnreadCounter,
    getUnreadMsgs,
    markMsgAsReaded,
  };
});