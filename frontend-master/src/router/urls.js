import { openUserPermissionsModal } from '@/composables/useUserPermissionModal.js';
import { openUnderConstructionModal } from '@/composables/useUnderConstructionModal.js';

export const LINK_TYPES = 'Link';
export const BOTTOM_POS = 'bottom';

export const TYPES = {
  submenu: 'submenu',
  modal: 'modal',
  rout: 'router'+ LINK_TYPES,
  old: 'old'+ LINK_TYPES,
  simple: 'simple'+ LINK_TYPES, // _self
  blank: 'blank'+ LINK_TYPES, // _blank
  ext: 'external'+ LINK_TYPES, // _blank
};

export const ALLOW_TO = { all: 'all', superUser: 'superUser'};

export const NAV_URLS = [
  {
    type: TYPES.submenu,
    url: 'products/',
    title: 'Мониторинг узлов',
    id: 'nodesMonitoring',
    allowTo: ALLOW_TO.all,
    items: [
      {
        url: '',
        type: TYPES.old,
        title: 'Карта и список узлов',
        id: 'nodes-map',
        allowTo: ALLOW_TO.all,
      },
      {
        url: 'nodes-table/',
        type: TYPES.rout,
        title: 'Проблемы узлов',
        id: 'nodes-table',
        allowTo: ALLOW_TO.all,
      },
    ],
  },
  {
    type: TYPES.submenu,
    url: '',
    title: 'Управление сеансами',
    id: 'dataServices',
    allowTo: ALLOW_TO.all,
    items: [
      {
        type: TYPES.old,
        url: 'services/createdataservice/',
        title: 'Создать сеанс передачи',
        id: 'createDataSession',
      },
      {
        type: TYPES.old,
        url: 'services/listdataservice/',
        title: 'Список сеансов передачи',
        id: 'dataSessions',
      },
      {
        type: TYPES.old,
        url: 'gws/historysession/',
        title: 'История Сеансов',
        id: 'dataSessionLog',
      },
    ],
  },
  {
    url: 'network/',
    type: TYPES.submenu,
    title: 'Конфигурация сети',
    id: 'networkConfig',
    items: [
      {
        url: 'dhcp',
        type: TYPES.rout,
        title: 'Конфигурация DHCP',
        id: 'dhcp',
        allowTo: ALLOW_TO.all,
      },
      {
        type: TYPES.old,
        url: 'dns',
        title: 'Конфигурация DNS',
        id: 'dns',
        allowTo: ALLOW_TO.all,
      },
    ],
  },
  {
    url: 'data/',
    title: 'Устройства',
    id: 'device',
    type: TYPES.submenu,
    items: [
      {
        type: TYPES.old,
        url: 'switch',
        title: 'Коммутаторы',
        id: 'switch',
        allowTo: ALLOW_TO.all,
      },
      {
        type: TYPES.old,
        url: 'pdu/list',
        title: 'Розетки',
        id: 'pdu',
        allowTo: ALLOW_TO.all,
      },
      {
        type: TYPES.old,
        url: 'ipmi/list',
        title: 'IPMI',
        id: 'ipmi',
        allowTo: ALLOW_TO.all,
      },
    ],
  },
  {
    title: 'Пользователи',
    id: 'users',
    type: TYPES.submenu,
    url: 'accounts/',
    items: [
      {
        type: TYPES.old,
        url: 'register_application_list/',
        title: 'Заявки на регистрацию',
        id: 'registrationRequests',
      },
      {
        url: 'create/',
        type: TYPES.rout,
        title: 'Добавить пользователя',
        id: 'addUser',
      },
      {
        url: 'list/',
        type: TYPES.rout,
        title: 'Пользователи',
        id: 'usersList',
      },
      {
        type: TYPES.old,
        url: 'access/views',
        title: 'Настройка прав',
        id: 'permissionsSettings',
        allowTo: ALLOW_TO.superUser,
      },
    ],
  },
  {
    type: TYPES.submenu,
    title: 'Пользователь',
    id: 'userName',
    dinamicTitle: true,
    allowTo: ALLOW_TO.all,
    items: [
      {
        type: TYPES.modal,
        title: 'Разрешения пользователя',
        id: 'userPermissions',
        fn: openUserPermissionsModal,
        allowTo: ALLOW_TO.all,
      },
      {
        type: TYPES.old, // TODO: type: TYPES.modal, modalName: 'userPasswordChange',
        url: 'accounts/changepassword/',
        title: 'Сменить пароль',
        id: 'userPassChange',
        dinamicURL: true, // import fn
        allowTo: ALLOW_TO.all,
      },
      {
        type: TYPES.modal,
        title: 'Настройки пользователя',
        id: 'userSettings',
        fn: openUnderConstructionModal,
        modalName: 'underConstruction',
        allowTo: ALLOW_TO.all,
      },
    ]
  },
  {
    url: '',
    id: 'settings',
    title: 'Настройки АРМ',
    type: TYPES.submenu,
    allowTo: ALLOW_TO.all,
    items: [
      {
        type: TYPES.old,
        url: 'core/settings',
        title: 'Параметры АРМ',
        id: 'armSettings',
        allowTo: ALLOW_TO.superUser,
      },
      {
        type: TYPES.old,
        url: 'modules/console',
        title: 'Консоль модулей СУМ КС',
        id: 'modulesCommands',
        allowTo: ALLOW_TO.superUser,
      },
      {
        type: TYPES.blank,
        url: 'webssh/index',
        title: 'Консоль',
        id: 'terminal',
        allowTo: ALLOW_TO.all,
      },
    ],
  },
  {
    url: 'accounts/',
    title: 'Журналирование',
    id: 'logs',
    type: TYPES.submenu,
    items: [
      {
        type: TYPES.old,
        url: 'activitylist/',
        title: 'Журнал действий',
        id: 'actionsLog',
      },
      {
        type: TYPES.ext,
        url: 'graylog',
        title: 'Журнал событий',
        id: 'graylog',
        allowTo: ALLOW_TO.all,
      },
      {
        type: TYPES.old,
        url: 'problems/',
        title: 'Заявки о проблемах',
        id: 'tickets',
      },
    ],
  },
  {
    type: TYPES.old, // TODO: type: TYPES.modal, modalName: 'messenger',
    url: 'accounts/problems/',
    title: 'Сообщения',
    id: 'messenger',
    dinamicTitle: true,
    allowTo: ALLOW_TO.all,
  },
  {
    type: TYPES.ext,
    url: 'accounts/monitoring/',
    title: 'Мониторинг',
    id: 'zabbix',
    allowTo: ALLOW_TO.all,
    position: BOTTOM_POS
  },
  {
    type: TYPES.ext,
    url: 'accounts/support/',
    title: 'Технический учёт',
    id: 'glpi',
    allowTo: ALLOW_TO.all,
    position: BOTTOM_POS
  },
  {
    type: TYPES.simple,
    url: 'accounts/logout/',
    title: 'Выйти',
    id: 'exit',
    allowTo: ALLOW_TO.all,
    position: BOTTOM_POS
  }
];

export const endPointUrls = [];