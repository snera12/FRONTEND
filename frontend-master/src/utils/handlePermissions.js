import { permissions, emptyPermission } from '@/utils/permissionsList.js';
import { getAllowsURLsToAll, getAllowsURLsToSuperUser } from '@/router/urlsUtils.js';
import { getObjWithArraysByKeys } from '@/utils/utils.js';

export const PERMISSIONS_KEYS = [
  'codeNames',
  'excludeAtSegmentCodeNames',
  'ruList'
];

export const URLS_KEYS = [
  'allowedURLs',
  'URLsToAll',
  'URLsToSuperUser',
  'URLsByPerms',
  'excludeAtSegmentURLs',
  // TODO: 'endPoints'
];

const getCurUserPermissions = codeNames => {
  const arr = [];
  codeNames.forEach(codeName => {
    const curP = permissions.find(p => p.codeName === codeName);
    if (!curP) console.warn('Передано неизвестное право пользователя', codeName);
    if (!curP.rawName.includes('historical')) arr.push(curP || emptyPermission);
  });
  return arr;
};

export const getPermissionsTextList = codeNames =>
  getCurUserPermissions(codeNames).map(p => p.ruName || '');

export const getAllowedURLsList = codeNames => {
  const arr = [];
  getCurUserPermissions(codeNames).forEach(perm => {
    perm.URLs.forEach(URL => {
      if (URL && !arr.includes(URL)) arr.push(URL);
    });
  });
  return arr;
};

export const getUserPermissionsEmptyObj = () =>
  getObjWithArraysByKeys([...PERMISSIONS_KEYS, ...URLS_KEYS]);

export const handlePermissions = curPermissions => {
  const reworked = reworkPermissions(curPermissions);
  const { codeNamesSorted } = sortPermissions(reworked);
  /* rawPermissionsExample = [{
  // "id": 1, "name": "Видит список пользователей", "codename": "list_user",
  // "content_type_id": { "id": 1, "app_label": "accounts", "model": "customuser"}
  // },]; */
  const result = getObjWithArraysByKeys(PERMISSIONS_KEYS); // MAYBE: = { list: {} };
  result.codeNames = codeNamesSorted;
  result.ruList = getPermissionsTextList(result.codeNames);
  // MAYBE: result.list = permissionSorted;
  // MAYBE: result.list[codename] = { codename, ruName, URLs, endPoints };
  return result;
};

export const handleAllowedURLS = ({ codeNames, isSuperUser }) => {
  const result = getObjWithArraysByKeys(URLS_KEYS);

  result.URLsToAll = getAllowsURLsToAll();
  result.URLsToSuperUser = getAllowsURLsToSuperUser();
  result.URLsByPerms = getAllowedURLsList(codeNames);

  result.allowedURLs = [...result.URLsToAll];
  if (isSuperUser) result.allowedURLs.push(...result.URLsToSuperUser);
  result.URLsByPerms.forEach(URL => {
    if (!result.allowedURLs.includes(URL)) result.allowedURLs.push(URL);
  });

  // TODO: result.endPoints = endPointsList(result.codeNames);
  return result;
};

const sortPermissions = permissions => {
  let apps  = [];
  let models = [];
  const codeNames = [];
  const doubles = { names: [], list: {} };
  const codeNamesSorted = [];
  const modelsByApps = {};
  const permByAppsAndModels = {};
  const permissionSorted = [];

  permissions.forEach(p => {
    const {appLabel: app, model, codeName} = p;
    if (!apps.includes(app)) apps.push(app);
    if (!models.includes(model)) models.push(model);
    if (codeNames.includes(codeName)) {
      if (!doubles.names.includes(codeName)) {
        doubles.names.push(codeName);
        const first = permissions.find(p => p.codeName === codeName);
        doubles.list[codeName] = [first, p];
      } else {
        doubles.list[codeName].push(p);
      }
    } else {
      codeNames.push(codeName);
    }
    if (!modelsByApps[app]) modelsByApps[app] = {};
    if (!modelsByApps[app][model]) modelsByApps[app][model] = [];
    if (!modelsByApps[app][model]
      .includes(codeName)) modelsByApps[app][model].push(codeName);
    if (!permByAppsAndModels[app]) permByAppsAndModels[app] = {};
    if (!permByAppsAndModels[app][model]) permByAppsAndModels[app][model] = {};
    permByAppsAndModels[app][model][codeName] = p;
  });

  apps = apps.sort((a, b) => a > b ? 1 : -1);
  models = models.sort((a, b) => a > b ? 1 : -1);

  apps.forEach(app => {
    models.forEach(model => {
      if (modelsByApps[app][model]) {
        modelsByApps[app][model].forEach(c => {
          permissionSorted.push(permByAppsAndModels[app][model][c]);
          codeNamesSorted.push(c);
        });
      }
    });
  });

  if (doubles.names.length) console.warn('Получены права c дубликатами имён:', doubles);

  return { permByAppsAndModels, codeNamesSorted, permissionSorted };
};

const reworkPermissions = curPerms => {
  const newPerms = [];
  curPerms.forEach(p => {
    const { content_type_id: content, codename: codeName } = p;
    const { app_label: appLabel, model } = content;
    newPerms.push({ codeName, appLabel, model });
  });
  return newPerms;
};