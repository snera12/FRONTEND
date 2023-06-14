export const doNothing = () => {
  return () => {};
};

export const getBaseUrl = () => {
  const url = window.location;
  return url.protocol + '//' + url.host + '/';
};

export const getWSProtocol = protocol => {
  const wsProtocol = protocol ||
    window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  if (wsProtocol === 'ws://') console.warn('WARNING: unsafe websocket connect');
  return wsProtocol;
};

export const getPort = port => {
  if (port === false) return '';
  if (port && port[0] !== ':') port = `:${port}`;
  return port || (window.location.port ? `:${window.location.port}` : '');
};

export const getPureUrlLocation = (url = window.location.href) => { 
  const isHTTPS = url.slice(0, 8) === 'https://';
  if (isHTTPS) url = url.slice(5, 1);

  // TODO: repair to 'https' after migrate 
  const isNotHTTP = url.slice(0, 7) !== 'http://';
  if (isNotHTTP) 'http://' + url;

  const isVueDev = url.slice(url.length - 2) === '#/';
  if (isVueDev) url = url.slice(0, url.length - 2);

  const hasSlash = url[url.length - 1] === '/';
  if (hasSlash) url = url.slice(0, url.length - 1);

  return url;
};

export const getCookie = (name, connector = "=") => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + connector.length) === (name + connector)) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
export const getCSRFToken = () => getCookie('csrftoken', '=');

export const kebabize = str => {
  /* https://stackoverflow.com/a/35096339/14893803
  ** The [\W_]+|(?<=[a-z0-9])(?=[A-Z]) regex will match
  ** [\W_]+ - any 1+ non-word and _ chars
  ** | - or
  ** (?<=[a-z0-9])(?=[A-Z]) - a location between a lowercase ASCII letter/digit
  ** and an uppercase ASCII letter.
  */
  const re = /[\W_]+|(?<=[a-z0-9])(?=[A-Z])/g;
  return str.replace(re, "-").toLowerCase();
};

export const camalize = str =>
  str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

export function capitalize(string) {
  if (typeof string !== 'string') {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getWordEndingAfterNum = (num, endings = ['//1', '//4', '//5']) => {
  // правило: 1 соединени'е', 4 соединени'я', 5 соединени'й'
  // исключения вписываются целиком:
  // 1 'человек', 4 'человека', 5 'людей'
  // 1 'лето', 4 'лета', 5 'летних сезонов'
  // либо выносятся удобным оборотом:
  // 1 пар'а' ножниц, 4 пар'ы' ножниц, 5 пар'' ножниц 
  num %= 100;
  if (num >= 11 && num <= 20) return endings[2];
  num %= 10;
  if (num === 1) return endings[0];
  return num < 5 ? endings[1] : endings[2];
};

export const getIncreasedCounter = ({ value, step, maxValue }) => 
  value < maxValue ? value + step : maxValue;

export const getDateFormatsFromTimestamp = timestamp => {
  let ok = false;
  if (!timestamp || typeof(+timestamp) !== 'number') return ({ok});

  let d;
  try {
    d = new Date(timestamp);
  } catch {
    return ({ok});
  }
  ok = true;

  let minutes = d.getMinutes() + '';
  if (minutes.length === 1) minutes = '0' + minutes;

  let seconds = d.getSeconds() + '';
  if (seconds.length === 1) seconds = '0' + seconds;

  const timeString = `${d.getHours()}:${minutes}:${seconds}`;
  const shortTimeString = `${d.getHours()}:${minutes}`;
  const dateYMDString = `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`;
  const dateDMYString = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;

  const timeZoneMSKOffsetH = -((d.getTimezoneOffset())/60 + 3);
  const tzh = timeZoneMSKOffsetH;
  let timeZoneString = '(Мск';
  if (tzh < 0) timeZoneString += tzh;
  if (tzh > 0) timeZoneString += `+${tzh}`;
  timeZoneString += ')';
 
  return {
    ok: true,
    date: d,
    dateYMDString,
    dateDMYString,
    timeString,
    shortTimeString,
    timeZoneString,
  };
};

const akkIP = ip => ip.split('.').reduce((akk, oct, i) => akk + oct*(2**(8*(3-i))), 0);
export const sortIP = (x, y) => {
  if (!x) return -1;
  if (!y) return 1;
  return (akkIP(x) < akkIP(y) ? -1 : 1);
};

export const openNewWindow = url => window.open(url, '_blank');

export const addKeysToObjectValues = obj =>
  Object.keys(obj).forEach(key => obj[key].key = key);

export const getObjWithArraysByKeys = keys => {
  const obj = {};
  keys.forEach(key => obj[key] = []);
  return obj;
};