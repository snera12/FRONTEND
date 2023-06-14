import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const NEED_CONSOLE = true;

export const useWebsocketsStore = defineStore('websockets', () => {
  const websockets = ref({});

  const addWebsocket = wsName => websockets.value[wsName] = {
    isConnected: false,
    errors: [],
  };

  const isWSConnected = computed(wsName => {
    if (!wsName || !websockets.value[wsName]) return false;
    return websockets.value[wsName].isConnected;
  });

  const getLastError = computed(wsName => {
    if (!wsName || !websockets.value[wsName]) return false;

    const errors = websockets.value[wsName]?.errors;
    if (!errors || !errors.length) return false;

    return errors[errors.length - 1];
  });

  const addError = ({wsName, e, type}) => {
    if (NEED_CONSOLE) console.log(e);
    websockets.value[wsName].errors.push({e, type, isSelled: false});
  };

  return {
    websockets,
    addWebsocket,
    isWSConnected,
    addError,
    getLastError,
  };
});

export const getNamedWSHandlers = ({wsStore, wsName}) => {
  const ws = wsStore.websockets[wsName];
  return ({
    onOpenHandler: ({sockets, socket}) => {
      ws.isConnected = true;
      ws.logs = sockets;
      ws.socket = socket;
    },
    afterOpenHanler: ({sockets}) => {
      // TODO: отсылать лог о зарегистрированных ошибках и неуспешных подключениях
    },
    onCloseHandler: ({e, wsStore}) => {
      ws.isConnected = false;
      if (!e.wasClean) wsStore.addError({type: 'close', wsName, e});
    },
    onErrorHandler: ({e, wsStore}) => wsStore.addError({type: 'error', wsName, e}),
  });
};