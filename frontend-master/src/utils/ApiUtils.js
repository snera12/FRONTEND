export const GENERAL_TYPES_OF_NODES_INTERFACE = {
  base: 'ОУ',
  ['ОУ']: 'base',
  inter: 'ПОУ',
  ['ПОУ']: 'inter',
  main: 'УУД',
  ['УУД']: 'main',
};

export const TYPES_OF_NODES_DESCRIPTION = {
  ['ПОУ']: 'Промежуточный опорный узел',
  ['ПОУ1']: 'Только пропускает трафик, клиенты не подключаются',
  ['ПОУ2']: 'ПОУ с дополнительной веткой, три модуля КРК',
  ['ПОУ3']: 'Только доставка ключей, передача зашифрованного трафика не обеспечивается.' +
    + ' Нет транспортной сети',
  ['ПОУ4']: 'Низкоскоростной шифратор, пользователь подключается через видеофон',
  ['ОУ']: 'Опорный узел',
  ['ОУ1']: 'Высокоскоростной шифратор. Несколько модулей КРК. Подключение пользователей',
  ['ОУ2']: 'Высокоскоростной шифратор. Один модуль КРК. Подключение пользователя',
  ['УУД']: 'Удаленный узел доступа центра управления и мониторинга. ' + 
    'Высокоскоростной шифратор. Один модуль КРК. Подключение администраторов',
};

export const getDescriptionOfNodeType = type =>
  TYPES_OF_NODES_DESCRIPTION[type] || 'Неизвестный тип узла';

const PREFIX = 'МКС'; // TODO: get from store armSettings
const UUD_TYPE_NAME = 'УУД';
const mainSeparator = '/';
const minorSeparator = '-';
const nameSeparator = ' ';
const SEGMENT_DESCRIPTION = 'Сегмент ';

// NOTE: not del; TODO: refact & use at extra-check of zabbix_names
export const getNameOfNode = rawName => {
  /* 
    Prod Rule: "МКС/NN-[[П]ОУ ]Название". Examples:
    "МКС/2-ПОУ Ст. Тосно" // ("Ст. Тосно")
    "МКС/20-ОУ МИВЦ РЖД Москва" // ("МИВЦ РЖД Москва")
    "МКС/22-УУД ЦУМ Москва" // ("УУД ЦУМ Москва")

    Prod-2 Rule:
    только для узлов СПБ-МСК: "МКС/NN-[П]ОУ Название".
    только для узлов МСК-НН: "ММКС/МСК-НН/NN-[П]ОУ Название".

    Prod-3 Rule: "МКС/N-Участок/NN-[[П]ОУN ]Название". Examples:
    "МКС/2-СПБ-МСК/2-ПОУ1 Ст. Тосно" // ("Ст. Тосно")
    "МКС/2-СПБ-МСК/20-ОУ2 МИВЦ РЖД Москва" // ("МИВЦ РЖД Москва")
    "МКС/2-СПБ-МСК/22-УУД ЦУМ Москва" // ("УУД ЦУМ Москва")
    "МКС/1-МСК-НН/2-ПОУ3 Ст. Фрязево" // ("Ст. Фрязево")
    "МКС/1-МСК-НН/" - участок целиком
  */

  const parts = {
    arr: rawName.split(mainSeparator),
    prefix: '',
    section: {},
    name: {},
  };
  const result = {
    rawName,
    prefix: '',
    isSectionSummary: false,
    sectionNum: false,
    sectionName: '',
    id: 0,
    type: false,
    generalType: false,
    name: '',
  };
  if (![2, 3].includes(parts.arr.length)) {
    console.warn(`[WARNING] Ошибка именования узлов:
    Не поддерживаемое количество частей имени ${parts.arr.length}`);
    return false;
  } 
  parts.prefix = parts.arr[0];
  if (parts.prefix !== PREFIX) {
    console.warn(`[WARNING] Ошибка именования узлов:
    Неправильный префикс линии ${parts.prefix} у узла ${rawName}`);
    return false;
  }
  result.prefix = PREFIX;

  parts.section.raw = parts.arr[1];
  parts.name.raw = parts.arr[2] || false;
  if (parts.arr.length === 2) {
    const part2isSection = parts.arr[1].indexOf(nameSeparator) === -1;
    if (part2isSection) {
      parts.section.raw = parts.arr[1];
      parts.name.raw = false;
      result.isSectionSummary = true;
    } else {
      parts.name.raw = parts.arr[1];
      parts.section.raw = false;
    }
  }
  if (parts.section.raw) {
    parts.section.arr = parts.section.raw.split(minorSeparator);
    if (![2, 3].includes(parts.section.arr.length)) {
      console.warn(`[WARNING] Ошибка именования узлов:
      Не поддерживаемое имя участка трассы ${parts.arr.length}`);
      return false;
    }
    if (parts.section.arr.length === 2) {
      result.sectionNum = false;
      result.sectionName = parts.section.arr.join(minorSeparator);
    }
    if (parts.section.arr.length === 3) {
      result.section.num = parts.section.arr[0];
      if (!Number.isInteger(result.section.num) || result.section.num < 1) {
        console.warn(`[WARNING] Ошибка именования узлов:
        Не поддерживаемый номер участка трассы ${parts.arr.length}`);
        return false;
      }
      result.section.name = parts.section.arr[1] + minorSeparator + parts.section.arr[2];
    }
    if (result.isSectionSummary) return result;
  }

  if (parts.name.raw) {
    const idEnd = parts.name.raw.indexOf(minorSeparator);
    result.id = +parts.name.raw.slice(0, idEnd);

    const typeEnd = parts.name.raw.indexOf(nameSeparator);
    result.type = parts.name.raw.slice(idEnd + 1, typeEnd);

    const numStartInType = result.type.search(/[0-9]/);
    result.generalType = result.type.slice(0, numStartInType);

    result.name = parts.name.raw.slice(typeEnd + 1);
    result.name.replace(`\\`, ``);
    if (result.type === UUD_TYPE_NAME) result.name = UUD_TYPE_NAME + ' ' + result.name;
  }
  
  return result;
};

export const handleNodeAttrs = node => {
  const {
    pouType: type,
    region: segmentName,
    get_zabbix_name: rawName,
    sequential_number: id,
    id: uid,
    address,
    state
  } = node;
  const generalType = type.slice(0, type.search(/[0-9]/));
  let { name } = node;
  if (generalType === UUD_TYPE_NAME) name = `${UUD_TYPE_NAME} ${name}`;

  return {
    id,
    uid,
    rawName,
    prefix: PREFIX, // TODO: from settings json
    segmentName,
    segmentDescription: `${SEGMENT_DESCRIPTION} ${segmentName}`,
    generalType,
    type,
    name,
    address,
    state,
  };
};

export const ARM_SETTINGS_NAMES_INTERFACE = {
  mapRegion: 'segment',
  zabbixNodegroupPrefix: 'prefix'
};

export const SEGMENT_EXCLUDE_TABLE_COLUMNS = {
  'Стенд': [],
  'СПБ-МСК': [],
  'МСК-НН': ['netTransport'],
};

export const SEGMENT_EXCLUDE_PERMISSIONS_CODENAMES = {
  'Стенд': [],
  'СПБ-МСК': [],
  'МСК-НН': [
    // 'log_view',
    'create_session_gw',
    'run_session_gw',
    'delete_session_gw',
    'select_user_session_gw',
    'view_session_gw',
    'log_view', // gw_log_view
    'add_session',
    'view_session', // gws_
    'change_session',
    'delete_session',
    'delete_dataservice',
    'create_session_gw',
    'change_dataservice',
    'view_dataservice',
    'delete_session',
    'change_session',
    'add_session',
    'view_session',
  ],
};

export const SEGMENT_EXCLUDE_URLS = {
  'Стенд': [],
  'СПБ-МСК': [],
  'МСК-НН': [
    'services/createdataservice/',
    'services/listdataservice/',
    'gws/historysession/'
  ],
};

export const ZABBIX_TYPES_NAMES = {
  netManagement: {
    v2: ['Тип/Сетевые устройства/Коммутатор сети управления'],
  },
  netTransport: {
    v2: [
      'Тип/Сетевые устройства/Коммутатор транспортной сети',
      'Тип/Сетевые устройства/Маршрутизатор транспортной сети'
    ],
  },
  fpsu: {
    v2: [
      'Тип/СКЗИ/ФПСУ',
      'Тип/СКЗИ/IPMI ФПСУ'
    ],
  },
  krk: {
    v2: ['Тип/Квантовая сеть/КРК'],
  },
  vm: {
    v2: [
      'Тип/Виртуальные машины/Технический учет',
      'Тип/Виртуальные машины/IP сервисы',
      'Тип/Виртуальные машины/Контроль доступа',
      'Тип/Виртуальные машины/Управление базами данных',
      'Тип/Виртуальные машины/Брокер сообщений',
      'Тип/Виртуальные машины/Мониторинг ',
      'Тип/Виртуальные машины/АРМ',
      'Тип/Виртуальные машины/Взаимодействие с АСУ ИКС',
      'Тип/Виртуальные машины/Управление трафиком (ТТТ)',
      'Тип/Виртуальные машины/Управление загрузкой',
      'Тип/Виртуальные машины/Журналирование событий',
      'Тип/Виртуальные машины/Управление по IPMI',
      'Тип/Виртуальные машины/Управление распределением питания',
      'Тип/Виртуальные машины/Управление конфигурациями',
      'Тип/Виртуальные машины/Проверка служб',
    ]
  },
  ups: {
    v2: ['Тип/Электроснабжение/ИБП'],
  },
  socketBlock: {
    v2: ['Тип/Электроснабжение/Блок розеток'],
  },
  conditioner: {
    v2: ['Тип/Управление климатом/Кондиционер'],
  },
  water: {
    v2: ['Тип/Управление климатом/Увлажнитель'],
  },
  rackMonitoring: {
    v2: ['Тип/Управление климатом/Сервер мониторинга стойки'],
  },
  servers: {
    v2: [
      'Тип/Средства вычислительной техники/ЦУМ сервер',
      'Тип/Средства вычислительной техники/IPMI ЦУМ сервера',
      'Тип/Средства вычислительной техники/Дисковая полка',
      'Тип/Средства вычислительной техники/ЛСУ',
      'Тип/Средства вычислительной техники/IPMI ЛСУ'
    ]
  }
};

// TODO: update after backend feature is created 
export const defineZabbixTypesNamesVersion = () => 'v2';

export const getZabbixTypesNamesByVersion = version => {
  const types = Object.keys(ZABBIX_TYPES_NAMES);
  const names = {};
  types.forEach(type => names[type] = ZABBIX_TYPES_NAMES[type][version]);
  return names;
};

export const getZabbixTypesNames = nodesProblems => {
  const version = defineZabbixTypesNamesVersion(nodesProblems);
  if (!version) return false;
  return getZabbixTypesNamesByVersion(version);
};

export const timestampInSecondsToDate = seconds => {
  seconds = +seconds;
  if (typeof(seconds) !== 'number') {
    console.warn(`Ошибка: В качестве времени окончания аренды были переданы
        не корректные данные, не конвертируемые в дату: `, seconds, typeof(seconds));
    return false;
  }
  return new Date(1000 * seconds);
};

export const SEVERITY_LEVELS = {
  critical: '5',
  high: '4',
  middle: '3',
  small: '2',
};

export const getCasesOfSeverityLevels = () => {
  const cases = {};
  Object.keys(SEVERITY_LEVELS).forEach(lvl => {
    const key = SEVERITY_LEVELS[lvl];
    cases[key] = lvl;
  });
  return cases;
};

export const SEVERITY_LEVELS_RUS = {
  5: 'Критические проблемы',
  4: 'Существенные проблемы',
  3: 'Незначительные проблемы',
  2: 'Предупреждения'
};

export const getZabbixLink = ({baseUrl, triggerId, eventId}) =>
  `${baseUrl}zabbix/tr_events.php?triggerid=${triggerId}&eventid=${eventId}`;

const ROLES_DESCRIPTIONS = {
  tsumadm: 'Администратор ЦУМ',
  trafadm: 'Администратор траффика',
  devadm: 'Администратор устройств',
  user: 'Пользователь (устаревшая роль)',
  superadm: 'Суперадмин',
  unknown: 'Неизвестная роль',
};

export const getRolesDescription = roles => {
  const descriptions = [];
  roles.forEach(role => {
    const description = ROLES_DESCRIPTIONS[role] || ROLES_DESCRIPTIONS.unknown;
    descriptions.push(description);
  });
  return descriptions;
};