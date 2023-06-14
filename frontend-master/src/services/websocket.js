import { doNothing,
  getIncreasedCounter as getIncreasedTimeout,
  getWSProtocol,
  getPort } from '@/utils/utils.js';

const NEED_CONSOLE = true;

const PAUSE = 1000;
const STEP = 1000;
const MAX_TIMEOUT = 10000;
const ALARM_TOTAL_TIMEOUT = 60000;

const READY_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

const isWSConnecting = socket => socket?.readyState === READY_STATES.CONNECTING;
const isWSOpened = socket => socket?.readyState === READY_STATES.OPEN;
// const isWSClosing = socket => socket?.readyState === READY_STATES.CLOSING;
const isWSClosed = socket => socket?.readyState === READY_STATES.CLOSED;
const isWSAlive = socket => isWSConnecting(socket) || isWSOpened(socket);

const EVENTS_PREFIXES = ['before', 'on', 'after'];
const WS_EVENTS_NAMES = ['Open', 'Message', 'Error', 'Close'];
const WS_OTHER_HANDLERS = []; // [someHandler = () => {}];
// TODO: onNetworkErrorHandler

export const WS_BACKEND_PATH_NAME = '/ws/';

const WS_SERVISE_URL_PARTS = {
  message: 'status_message',
  webssh: 'webssh'
};

export const getWSUrl = ({protocol, port, wsServisePath, wsServiseName, argsRow}) => {
  port = getPort(port);
  protocol = getWSProtocol(protocol);
  const hostname = window.location.hostname; // without port
  if (wsServiseName) wsServisePath = WS_SERVISE_URL_PARTS[wsServiseName];
  return protocol + hostname + port + WS_BACKEND_PATH_NAME + wsServisePath + argsRow;
};

const getHandlersNames = () => {
  const names = [];
  WS_EVENTS_NAMES.forEach(eventName => {
    EVENTS_PREFIXES.forEach(prefix =>
      names.push(`${prefix}${eventName}Handler`));
  });
  return names;
};

const fillHandlers = handlers => {
  const handlersNames = getHandlersNames();
  handlersNames.forEach(handlerName => {
    if (!handlers[handlerName]) handlers[handlerName] = doNothing();  
  });
  WS_OTHER_HANDLERS.forEach(handler => handlers[handler.name] = handler);
  return handlers;
};

const sockets = [];
let socketCounter = 0;
let socketIsOpening = false;

const registerSocket = ({socket, num}) => {
  sockets.push({
    socket,
    canBeChecked: true,
    checkingFlag: false,
    timestamps: {
      startOpeningAt: (new Date()).getTime(),
      stopOpeningAt: 0,
      openingTimeMs: 0,  
      openConnectAt: 0,
      closeConnectAt: 0,
      connectTimeMs: 0,
    },
    timeout: 0,
    hasBeenOpened: false,
  });
};

const markTime = ({socketNum, event}) => {
  if (!(
    (socketNum || socketNum === 0) && 
    ['open', 'close'].includes(event)
  )) return;
  const timestamp = (new Date()).getTime();
  const times = sockets[socketNum].timestamps;
  times[event + 'ConnectAt'] = timestamp; // 'open' or 'close'
  if (!times.stopOpeningAt) times.stopOpeningAt = timestamp;
  if (!times.openingTimeMs) {
    times.openingTimeMs = times.stopOpeningAt - times.startOpeningAt;
  }
  if (event === 'close' && times.hasBeenOpened) {
    times.connectTimeMs = times.closeConnectAt - times.startConnectAt;
  }
};

const cleanSocket = num => {
  const { socket } = sockets[num];
  if (!socket) return;
  if (isWSClosed(socket)) {
    sockets[num].url = sockets[num].socket.url,
    sockets[num].socket = null;
    sockets[num].canBeChecked = false;
  }
};

const alarmFailNetwork = totalTimeout => {
  if (totalTimeout > ALARM_TOTAL_TIMEOUT) {
    console.warn('ALARM: network is failed; ВНИМАНИЕ: Сеть недоступна');
  }
};

let totalTimeout = 0;

const checkWSIsOpenedUntilSuccess = socketNum => {
  const curSocket = sockets[socketNum];
  const { socket } = curSocket;

  if (!curSocket.canBeChecked || isWSClosed(socket)) {
    curSocket.checkingFlag = false;
    curSocket.canBeChecked = false;
    return false;
  }

  curSocket.checkingFlag = true;

  totalTimeout += curSocket.timeout;
  alarmFailNetwork(totalTimeout);
  
  const curTimeout = getIncreasedTimeout({
    value: curSocket.timeout,
    maxValue: MAX_TIMEOUT,
    step: STEP,
  });
  curSocket.timeout = curTimeout;

  const isWSOpenFlag = isWSOpened(socket);
  
  if (curTimeout > 0 && NEED_CONSOLE) {
    console.log(`Check: WS-${socketNum} is open? ${isWSOpenFlag ? 'Yes' : 'No'}`);
  }
  if (isWSOpenFlag) {
    curSocket.hasBeenOpened = true;
    totalTimeout = 0; // TODO: stopAlarmNetworkFailed()
    curSocket.checkingFlag = false;
    if (NEED_CONSOLE) console.log(sockets);
    return true;
  } else {
    setTimeout(() => checkWSIsOpenedUntilSuccess(socketNum), curTimeout);
    if (NEED_CONSOLE) {
      console.log(`Extra check WS-${socketNum} opened after ${curTimeout}ms`);
    }
  }
};

const openWS = async ({socket, handlers, wsStore, url}) => {
  if (socketIsOpening || isWSAlive(socket)) return;
  socketIsOpening = true;

  handlers.beforeOpenHandler({url, wsStore, socket});
  const socketNum = socketCounter;
  new Promise((resolve, reject) => {
    if (NEED_CONSOLE) console.log(`Try to open WS-${socketNum}`);
    try {
      socket = new WebSocket(url);
      registerSocket({socket, socketNum});

      socket.onopen = e => {
        socketIsOpening = false;
        if (NEED_CONSOLE) console.log('[WS open] WS opened successfully', e);
        markTime({socketNum, event: 'open'});
        handlers.onOpenHandler({e, socket, wsStore, sockets});
        handlers.afterOpenHandler({e, socket, wsStore, sockets});
      };
      socket.onerror = async e => {
        markTime({socketNum, event: 'close'});
        console.log('[WS error]', e);
        handlers.onErrorHandler({e, socket, wsStore});
        await reOpenWS({socket, handlers, wsStore, url});
        handlers.afterErrorHandler({e, socket, wsStore});
      };
      socket.onmessage = e => {
        if (NEED_CONSOLE) console.log('[WS message]', e);
        handlers.onMessageHandler({e, socket, wsStore});
        handlers.afterMessageHandler({e, socket, wsStore});
      };
      socket.onclose = async e => {
        markTime({socketNum, event: 'close'});
        cleanSocket(socketNum);
        if (NEED_CONSOLE) console.log('[WS close] ws closed', e);
        handlers.onCloseHandler({e, socket, wsStore});
        if (e.wasClean) {
          if (NEED_CONSOLE) {
            console.log(`[WS close] closed clean, code:${e.code}, reason:${e.reason}`);
          }
        } else {
          // network failed or server killed the procces, ussualy event.code === 1006
          if (NEED_CONSOLE) console.log(`[close]  connection aborted, code:${e.code}`);
          if (socketIsOpening) socketIsOpening = false;
          socket = await reOpenWS({socket, handlers, wsStore, url});
        }
      };
    } catch (err) {
      reject(err);
    }
    resolve(socket);
  }).then(() => {
    setTimeout(() => {
      if (!isWSOpened(socket)) reOpenWS({socket, handlers, wsStore, url});
    }, MAX_TIMEOUT);
    if (sockets[socketNum]) checkWSIsOpenedUntilSuccess(socketNum);
  }).catch(err => {
    markTime({socketNum, event: 'close'});
    if (socketIsOpening) socketIsOpening = false;
    handlers.afterErrorHandler({socket, wsStore});
    cleanSocket(socketNum);
    if (NEED_CONSOLE) {
      console.log(`Error: WS connection failed (couldn't connect) with error: ${err};
      reconnecting in ${PAUSE}ms`);
    }
    reOpenWS({socket, handlers, wsStore, url});
  }).finally(()=> {
    socketCounter++;
    return socket;
  });
};

const reOpenWS = async ({socket, handlers, wsStore, url}) => {
  if (NEED_CONSOLE) console.log(`Try to reopen WS`);
  setTimeout(async () => await openWS({socket, handlers, wsStore, url}), PAUSE);
};

export const getWSConnect = async ({
  protocol,
  port,
  wsServisePath = '',
  wsServiseName = '',
  argsRow = '',
  handlers = {},
  wsStore, // pinia store for websocket
}) => {
  if (!(wsServiseName || wsServisePath)) {
    console.warn('getWSConnect func need wsServiseName or wsServisePath argument');
    return;
  }
  const url = getWSUrl({protocol, port, wsServisePath, wsServiseName, argsRow});
 
  handlers = fillHandlers(handlers);
  if (NEED_CONSOLE) console.log(handlers);

  let socket;  
  await openWS({socket, handlers, wsStore, url})
    .then(s => socket = s);

  return socket;
};