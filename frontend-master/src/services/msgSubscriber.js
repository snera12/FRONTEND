// NOTE: pattern observer

let msgStore;
export const startMsgSubscriber = messageStore => msgStore = messageStore;

const getSourceKey = sourceName => 'src' + sourceName;

const sources = {};

export const addSource = sourceName => {
  const key = getSourceKey(sourceName);
  if (sources[key]) return;

  sources[key] = {
    sourceName,
    subs: []
  };
};

const getMsgs = sourceName =>
  msgStore.messages.filter(msg => +msg.id === +sourceName);

let subCounter = 0;
const subscribers = {};

export const subscribe = ({sourceName, handlerFn}) => {
  const subId = 'sub' + subCounter;
  subCounter ++;

  const key = getSourceKey(sourceName);
  if (!sources[key] || !sources[key].subs) addSource(sourceName);

  sources[key].subs.push({subId, handlerFn});
  subscribers[subId] = key;

  return {
    msgsBefore: getMsgs(sourceName),
    subId,
  };
};

export const unsubscribe = subId => {
  if (!subscribers[subId]) return;

  const { key } = subscribers[subId];
  subscribers[subId] = null;

  const source = sources[key];
  source.subs = source.subs.filter(sub => sub.subId !== key);

  if (!source.subs.length) sources[key] = null; 
};

export const notifySubs = ({sourceName, msg}) => {
  const key = getSourceKey(sourceName);
  if (!sources[key] || !sources[key].subs) return;

  sources[key].subs.forEach(sub => sub.handlerFn(msg));
};