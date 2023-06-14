import { useMessageStore } from '@/store/messageStore.js';
import { useWebsocketsStore, getNamedWSHandlers } from '@/store/websocketsStore.js';
import { getWSConnect} from '@/services/websocket';
import { doNothing } from '@/utils/utils';
import { notifySubs } from '@/services/msgSubscriber';
import { getBaseUrl } from '@/utils/utils';

const NEED_CONSOLE = false;
export const WEBSOCKET_NAME = 'message';

export const msgTypesIntetface = {
  recordState: 'record_state',
  record_state: 'recordState',
};

export const msgTypes = {
  default: {
    hasntDataContainer: false,
    dataContainerName: 'data',
    canBeJSON: false,
    hasntInnerContainer: true,
    innerContainerName: 'message',
    actions: ['addMsg'],
  },
  access: {
    dataContainerName: 'message',
    hasntInnerContainer: true,
    actions: ['addMsg'],
  },
  inform: {
    actions: ['addMsg', 'show'],
  },
  message: {
    actions: ['addMsg', 'alert'],
  },
  recordState: {
    canBeJSON: true,
    hasntInnerContainer: true,
    actions: ['addMsg', 'notify'],
  },
  reload: {
    actions: ['addMsg', 'alert', 'refresh'],
  },
};

const addMsgToStore = args => messageStore.addMessage(args);
const showAlertModal = args => {};
const refreshPage = args => {};
const showMsgModal = args => {};
const notify = ({data, type, msgNum }) => {
  const id = data.id;
  if (id || id === 0) notifySubs({sourceName: id, msg: data.data || data});
};

const actionsFuncs = {
  addMsg: addMsgToStore,
  alert: showAlertModal,
  refresh: refreshPage,
  show: showMsgModal,
  notify: notify,
};

let wsStore;
let messageStore;
let msgCounter = 0;

export const startMessenger = () => {
  messageStore = useMessageStore();

  wsStore = useWebsocketsStore();
  wsStore.addWebsocket(WEBSOCKET_NAME);

  const handlers = getNamedWSHandlers({wsStore, wsName: WEBSOCKET_NAME});
  handlers.onMessageHandler = ({e}) => {
    if (e.type !== 'message') return;
    msgCounter++;
    if (NEED_CONSOLE) console.log(`-------------Message №${msgCounter}--------------`);
    if (NEED_CONSOLE) console.log(e);

    const jsonData = JSON.parse(e.data);
    let { type } = jsonData;
    if (!type) {
      console.warn(`msg from backend hasn't type`, e);
      return;
    }

    type = msgTypesIntetface[type] || type;

    if (!msgTypes[type]) {
      console.warn(`msg from backend has unknown type '${type}'`, e);
      return;
    }
    
    let {
      hasntDataContainer,
      dataContainerName,
      canBeJSON,
      hasntInnerContainer,
      innerContainerName,
      actions
    } = msgTypes[type];

    if (!dataContainerName && !hasntDataContainer) {
      dataContainerName = msgTypes.default.dataContainerName;
    }

    if (!innerContainerName && !hasntInnerContainer) {
      innerContainerName = msgTypes.default.innerContainerName;
    }

    let data = hasntDataContainer ? jsonData : jsonData[dataContainerName];
    if (NEED_CONSOLE) console.log(type, data);

    if (canBeJSON) {
      try {
        data = JSON.parse(data);
      } catch {
        (doNothing())();
      }
    }

    if (innerContainerName) data = data[innerContainerName];
    if (NEED_CONSOLE) console.log(`Сообщение №${msgCounter}`, data);
    actions.forEach(actionName =>
      actionsFuncs[actionName]({data, type, msgNum: msgCounter}));
  };

  const WSConnect = {
    wsServiseName: WEBSOCKET_NAME,
    wsStore,
    handlers,
  };
  const isLocalBackend =
    process.env.NODE_ENV === 'development' && getBaseUrl() === 'http://localhost:3000/'; 
  if (isLocalBackend) WSConnect.port = 3001;

  getWSConnect(WSConnect);

  return messageStore;
};