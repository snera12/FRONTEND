import { NAV_URLS, TYPES, ALLOW_TO, LINK_TYPES, BOTTOM_POS } from '@/router/urls.js';

const isLinkType = point => point.type.includes(LINK_TYPES);

export const getAllowsURLsTo = allowTo => {
  const keys = Object.keys(ALLOW_TO);
  if (!keys.includes(allowTo)) {
    console.error('at getAllowsURLsTo fn use only this keys:', ...keys);
    return [];
  }
  const arr = [];
  NAV_URLS.forEach(point => {
    if (point.allowTo === allowTo && isLinkType(point)) arr.push(point.url);
    if (point.type === TYPES.submenu) {
      point.items.forEach(item => {
        if (item.type !== TYPES.modal && item.allowTo === allowTo) {
          arr.push((point.url || '') + item.url);
        }
      });
    }
  });
  return arr;
};
export const getAllowsURLsToAll = () => getAllowsURLsTo(ALLOW_TO.all);
export const getAllowsURLsToSuperUser = () => getAllowsURLsTo(ALLOW_TO.superUser);

const getMenuPointsByPos = (position = 'main') =>
  NAV_URLS.filter(point =>
    position === BOTTOM_POS ? point.position === position : !point.position
  );

const getMenuPoints = ({URLs = [], points = NAV_URLS}) => {
  return !URLs.length ? [] : points
    .map(point => {
      if (point.type === TYPES.modal) return point;
      if (isLinkType(point) && URLs.includes(point.url)) return point;
      if (point.type === TYPES.submenu) {
        const curPoint = {...point};
        curPoint.items = point.items.filter(item =>
          item.type === TYPES.modal ||
          URLs.includes((point.url || '') + item.url)
        );
        if (curPoint.items.length) return curPoint;
      }
    })
    .filter(point => !!point);
};
export const getMainNavPoints = URLs =>
  getMenuPoints({ URLs, points: getMenuPointsByPos('main') });
export const getBottomNavPoints = URLs => 
  getMenuPoints({ URLs, points: getMenuPointsByPos(BOTTOM_POS) });

export const getListPointsIdsByItemId = (points = NAV_URLS) => {
  const ids = {};
  points.forEach(point => {
    if (point.type !== TYPES.submenu) ids[point.id] = point;
  });
  return ids;
};

const getListSubmenuesIdsByItemId = (points = NAV_URLS) => {
  const ids = {};
  points.forEach(point => {
    if (point.type === TYPES.submenu) {
      point.items.forEach(item => ids[item.id] = point.id);
    }
  });
  return ids;
};

export const getUrlByItemId = itemId => {
  const point = getListPointsIdsByItemId()[itemId];
  if (point) return point;

  const submenuId = getListSubmenuesIdsByItemId()[itemId];
  const submenu = NAV_URLS.find(point => point.id === submenuId);
  const item = submenu.items.find(item => item.id === itemId);
  return submenu.url + item.url;
};

export const getSubmenuAndItemsIds = (points = NAV_URLS) => {
  const ids = {};
  points.forEach(point => {
    if (point.type === TYPES.submenu) ids[point.id] = point.items.map(item => item.id);
  });
  return ids;
};

export const getItemByUrl = URL => {
  let result;
  NAV_URLS.forEach(point => {
    if (!result && isLinkType(point) && point.url === URL) result = point;
    if (!result && point.type === TYPES.submenu) {
      point.items.forEach(item => {
        if (!result && isLinkType(item) && (point.url + item.url) === URL) result = item;
      });
    }
  });
  return result;
};