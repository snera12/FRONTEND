<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useARMSettingsStore } from '@/store/ARMSettingsStore.js';
import useBaseUrl from '@/composables/useBaseUrl.js';
import useJSON from '@/composables/useJSON.js';
import CountdownTimer from '@/components/tools/CountdownTimer.vue';
import { $vfm } from 'vue-final-modal';
import BaseModal from '@/components/base/BaseModal.vue';
import ProblemCardView from '@/views/ProblemCardView.vue';
import ProblemsCollectionCardView from '@/views/ProblemsCollectionCardView.vue';
import { getDateFormatsFromTimestamp as getDateFormats,
  addKeysToObjectValues } from '@/utils/utils.js';
import { handleNodeAttrs, getDescriptionOfNodeType,
  getZabbixTypesNames, SEGMENT_EXCLUDE_TABLE_COLUMNS,
  SEVERITY_LEVELS, getCasesOfSeverityLevels } from '@/utils/ApiUtils.js';
import { fireCustomRule, CONNECT_FAIL_STATUS } from '@/utils/customRules.js';
import NodeTableLegend from '@/components/elements/NodeTableLegend.vue';
import { setPageRules } from '@/utils/customizePageStyle.js';

const PAGE_NAME = 'nodes-table';
const PAGE_TITLE = 'Проблемы узлов';
const NO_DATA = 'нет данных';
const CONNECT_FAIL_MESSAGE = 'Недоступно по ICMP ping (в течение #3)';
const CONNECT_OK_STATUS = 'ok';
const CLOSE_ALL_CARDS_OPTION = 'closeAllCards';
const OPEN_CARD_UNDER_TABLE = false; // TODO: to otions
const CARD_WIDTH = 638;
const CARD_Y_SHIFT = 50;
const CARD_Y_MIN_SHOW = 150;
const FLASH_OK_MS = 1500;

const TABLE_KEYS = {
  id: { label: '№', hasntTypeName: true, width: '2%', cssClass: false },
  type: { label: 'Тип', hasntTypeName: true, width: '2%', cssClass: false },
  name: { label: 'Узел', hasntTypeName: true, cssClass: false },
  connect: {
    label: 'Связь с узлом',
    hasntTypeName: true,
    cssClass: 'connect',
    tooltip: 'Доступность узла через сеть управления (в течение 3 минут)',
  },
  // state: { label: 'Состояние', typeName: false },
  netManagement: {
    label: 'Сеть управления',
    html: 'Сеть<br>уп&#173;рав&#173;ле&#173;ния',
  },
  netTransport: {
    label: 'Сеть транспортная',
    html: 'Сеть<br>транс&#173;порт&#173;ная',
  },
  fpsu: { label: 'ФПСУ' },
  krk: { label: 'КРК' },
  servers: {
    label: 'ЦУМ и ЛСУ cервера',
    html: 'ЦУМ и ЛСУ<br>cер&#173;вера',
    tooltip: 'ЦУМ сервера располагаются только на узлах типа ОУ-1'
  },
  vm: {
    label: 'ВМ',
    typeName: 'Виртуальные машины',
    tooltip: 'Виртуальные машины располагаются только на ЦУМ серверах'
  },
  ups: { label: 'ИБП' },
  socketBlock: {
    label: 'Блок розеток',
    html: 'Блок<br>розе&#173;ток',
  },
  fire: {
    label: 'Задымление',
    customType: true,
    customRule: {key: 'fire', fn: fireCustomRule},
    html: 'За&#173;дым&#173;ле&#173;ние',
    tooltip: 'Датчик дыма расположен на кондиционере'
  },
  conditioner: {
    label: 'Кондиционер',
    html: 'Кон&#173;ди&#173;цио&#173;нер',
  },
  water: {
    label: 'Увлажнитель',
    html: 'Ув&#173;лаж&#173;ни&#173;тель',
  },
  rackMonitoring: {
    label: 'Мониторинг стоек',
    html: 'Мо&#173;ни&#173;то&#173;ринг<br>сто&#173;ек',
  },
};
addKeysToObjectValues(TABLE_KEYS);

const tableKeys = computed(() => {
  const newKeys = {};
  if (!segment.value) return {};
  const hideKeys = SEGMENT_EXCLUDE_TABLE_COLUMNS[segment.value];
  if (!hideKeys) {
    console.warn('Подключён сегмент сети с неизвестным названием. ' +
      'Будет использована таблица по умолчанию');
    return TABLE_KEYS;
  }
  Object.keys(TABLE_KEYS)
    .filter(key => !hideKeys.includes(key))
    .forEach(key => newKeys[key] = TABLE_KEYS[key]);
  return newKeys;
});

const keysWithProblems = computed(()=> Object.keys(tableKeys.value)
  .filter(key => !tableKeys.value[key].hasntTypeName));

const customRules = computed(()=> Object.values(tableKeys.value)
  .filter(value => value.customRule).map(value => value.customRule));

const zabbixTypesNames = computed(() => !isProblemsReceived.value ?
  false : getZabbixTypesNames(nodesProblemsJson.value));

const customHandleNodesProblems = computed(() => {
  if (!(isProblemsReceived.value && hasZabbixTypes)) return false;
  const nodes = nodesProblemsJson.value.locations;
  if (!nodes) return false;

  const result = {};
  Object.keys(nodes).forEach(node => {
    result[node] = {};
    Object.keys(zabbixTypesNames.value).forEach(key => {
      const typeNames = zabbixTypesNames.value[key];
      const firstTypeArr = nodes[node].types[typeNames[0]];
      if (typeNames.length === 1 && firstTypeArr) result[node][key] = firstTypeArr;
      if (typeNames.length > 1) {
        const mergedTypeProblems = [];
        typeNames.forEach(typeName =>
          mergedTypeProblems.push(...(nodes[node].types[typeName] || []))
        );
        if (mergedTypeProblems.length) result[node][key] = mergedTypeProblems;
      }
    });

    customRules.value.forEach(rule => {
      const typesNames = zabbixTypesNames.value;
      const ruleResult = rule.fn({ result, node, typesNames });
      if (ruleResult) result[node][rule.key] = ruleResult;
    });
  });

  return result;
});
const problems = customHandleNodesProblems;

const TABLE_VIEWS = {
  max: { name: 'max', text: 'Самые важные'},
  total: { name: 'total', text: 'Суммарно' }, 
  detail: { name: 'detail', text: 'Детально'},
};

const showOpt = ref(TABLE_VIEWS.total.name);
const showSmallLvlProblems = ref(false);

const casesOfSeverityLevels = getCasesOfSeverityLevels();

const { baseUrl } = useBaseUrl();
const { json: nodesState } = useJSON({
  url: `${baseUrl.value}products`,
  suffixName: 'data',
  jsonMethod: 'text'
});

const { json: nodesProblemsJson, updateJSON: updateNodesProblems} = useJSON({
  url: `${baseUrl.value}products/zabbix_problems`,
  suffixStr: '/',
  jsonMethod: 'text'
});

const { ARMSettings, hasJSON: hasArmSettings } = storeToRefs(useARMSettingsStore());
const segment = computed(()=> ARMSettings.value.segment?.value || '');

const startTimestamp = ref(0);
const curProblemsTimestamp = ref(0);
const startCountdownsFlag = ref(false);
const REFRESH_INTERVAL = 60000;

watch(nodesProblemsJson, () => {
  if (startCountdownsFlag.value) {
    curProblemsTimestamp.value = Date.now();
    return;
  }
  curProblemsTimestamp.value = startTimestamp.value = Date.now();
});

const getProblemTime = computed(() => {
  if (!curProblemsTimestamp.value) return '';
  return getDateFormats(curProblemsTimestamp.value);
});

const getTitleWithTime = computed(()=> {
  if (!getProblemTime.value.ok) return PAGE_TITLE;
  return `${PAGE_TITLE} на ${getProblemTime.value.shortTimeString}`;
});

const getFullTime = computed(() => !getProblemTime.value.ok ? '' :
  `${getProblemTime.value.dateYMDString} ${getProblemTime.value.timeString} `
);

const getFullTimeAndZone = computed(() => !getFullTime.value ? '' :
  `${getFullTime.value} ${getProblemTime.value.timeZoneString}`
);

const getTooltipTime = computed(() => !getProblemTime.value.ok ? PAGE_TITLE :
  `${PAGE_TITLE} от ${getFullTimeAndZone.value}`
);

const getFullTimeReverse = computed(() => !getProblemTime.value.ok ? '' :
  `${getProblemTime.value.timeString} от ${getProblemTime.value.dateDMYString}`
);

const isNamesReceived = computed(() => !!nodesState.value?.nodeids?.length);
const hasNames = computed(() => !! nodesList.value.length);

const isProblemsReceived = computed(() => !!nodesProblemsJson.value.locations);
const hasProblems = computed(() =>
  problems.value && !!Object.keys(problems.value).length);
const hasZabbixTypes = computed(() => !!Object.keys(zabbixTypesNames.value).length);

const hasAllData = computed(() =>
  hasArmSettings.value && hasNames.value && hasProblems.value && hasZabbixTypes);

const getTableHeaders = () => {
  const tableHeaders = [];
  Object.keys(tableKeys.value).forEach(key => {
    const options = tableKeys.value[key];
    tableHeaders.push({
      field: key,
      label: options.label || '',
      width: options.width || '6.5%',
      sortable: true,
      sortFn: sortTableFn,
    });
  });
  return tableHeaders;
};

const rawNodesList = computed(()=> !isNamesReceived.value ? [] :
  Object.values(nodesState.value.product_list));

const nodesList = computed(()=> {
  const nodes = [];
  if (!rawNodesList.value.length) return nodes;
  rawNodesList.value.forEach(node => nodes.push(handleNodeAttrs(node)));
  return nodes;
});

const nodesNames = computed(()=> {
  const names = {};
  nodesList.value.forEach(node => names[node.rawName] = node);
  return names;
});

const getConnectState = node => {
  const connect = node ?
    { state: CONNECT_OK_STATUS, value: 'ОК' } :
    { state: 'unknown', value: 'Неизвестно' };
  if (!node) return connect;

  const { netManagement } = node;
  if (netManagement) {
    netManagement.forEach(item => {
      item.problems.forEach(problem => {
        if (problem.name === CONNECT_FAIL_MESSAGE) {
          connect.state = CONNECT_FAIL_STATUS;
          connect.value = 'Нет связи!';
          // connect.data = NO_DATA;
        }
      });
    });
  }
  return connect;
};

const getProblemsCounters = (node, key) => {
  const arr = node[key];
  const flags = { hasProblems: false };
  if (!arr) return { flags };

  flags.hasProblems = true;
  const counters = {'total': 0, 'totalWithoutSmall': 0, 'lvls': []};
  Object.keys(SEVERITY_LEVELS).forEach(lvl => counters[lvl] = 0 );

  const smallLvl = +SEVERITY_LEVELS.small;
  let maxLvl = 0;
  arr.forEach(item => {
    counters.total += item.problems.length;
    item.problems.forEach(problem => {
      const { severity } = problem;
      const lvl = casesOfSeverityLevels[severity] || null;
      if (lvl) counters[lvl] += 1;
      if (counters[lvl] === 1) counters.lvls[5 - (+severity)] = lvl;
      if (+severity > maxLvl) maxLvl = +severity;
      if (severity > SEVERITY_LEVELS.small) counters.totalWithoutSmall += 1;
    });
  });
  counters.lvls = counters.lvls.filter(lvl => !!lvl);

  counters.maxSeverityLvlWithoutSmall = counters.maxSeverityLvl = maxLvl;
  counters.maxSeverityWithoutSmall = counters.maxSeverity = casesOfSeverityLevels[maxLvl];
  counters.maxWithoutSmall = counters.max = maxLvl > 0 ?
    counters[counters.maxSeverity] : '';

  if (maxLvl === smallLvl) {
    counters.maxSeverityLvlWithoutSmall = 0;
    counters.maxSeverityWithoutSmall = counters.maxWithoutSmall = '';
    counters.maxWithoutSmall = counters[counters.maxSeverityWithoutSmall] || '';
  }

  if (counters.totalWithoutSmall === 0) counters.totalWithoutSmall = '';

  return {flags, counters};
};

const getCellBgColorClass = (cell, coloumnName) => {
  const prefix = `${PAGE_NAME}__table__td`;
  const cssClasses = [prefix];
  if (coloumnName === 'name') cssClasses.push('hovered');
  if (TABLE_KEYS[coloumnName].cssClass === false) return cssClasses;

  const connectClass = TABLE_KEYS[coloumnName].cssClass === 'connect' ? '-connect' : '';
  
  if (!cell.flags.connect || cell.flags.connect === CONNECT_FAIL_STATUS) {
    cssClasses.push(`${prefix}__cell${connectClass}__connect-fail`);
    return cssClasses;
  }
  cssClasses.push(`${prefix}__cell${connectClass}__connect-ok`);
  
  if (!cell.flags.hasProblems) {
    cssClasses.push(`${prefix}__cell__test-ok`);
    return cssClasses;
  }
  
  if (cell.counters.total > 0) {
    cssClasses.push(`${prefix}__severity-${cell.counters.maxSeverity}`);
  }
  return cssClasses;
};

const getRowsData = computed(() => {
  if (!hasAllData.value) return [];
  const rowsData = [];
  for (let i = 1; i <= nodesList.value.length; i++) {
    const nodeNames = nodesList.value.find(n => n.id === i);
    const node = problems.value[nodeNames.rawName] || {};
    const row = {};
    const connect = getConnectState(node);
    if (connect.state !== "unknown") {
      Object.keys(tableKeys.value).forEach(key => {
        const cellData = { value: '' };
        if (key === 'connect') cellData.value = connect.value;
        if (!TABLE_KEYS[key].hasntTypeName && node) {
          if (connect.state === CONNECT_OK_STATUS &&
            node[key]?.connect !== CONNECT_FAIL_STATUS) {
            const { flags, counters } = getProblemsCounters(node, key);
            if (counters) cellData.counters = counters;
            flags.connect = true;
            cellData.flags = flags;
          } else {
            cellData.flags = { connect: false };
            cellData.value = NO_DATA;
          }
        } else {
          cellData.flags = { connect: connect.state };
          if (key === 'name') {
            cellData.value = nodeNames.name;
            cellData.fullName = nodeNames.rawName;
          }
          if (key === 'id') cellData.value = nodeNames.id;
          if (key === 'type') cellData.value = nodeNames.type;
        }
        cellData.classNames = getCellBgColorClass(cellData, key);
        row[key] = cellData;
      });
    } else {
      // ???
    }
    rowsData.push(row);
  }
  return rowsData;
});

const sortTableFn = (x, y, col, rowX, rowY) => {
  const maxValue = 999;
  // x, y - row1, row2 values for column
  // rowX, rowY - row object for row1, row2
  // col - column being sorted
  // example: return (x < y ? -1 : (x > y ? 1 : 0));
  const { hasntTypeName } = TABLE_KEYS[col.field];
  if (hasntTypeName) return (x.value < y.value ? -1 : (x.value > y.value ? 1 : 0));

  if (showOpt.value === TABLE_VIEWS.total.name) {
    const xCount = showSmallLvlProblems.value ?
      x.counters?.total || 0 :
      x.counters?.totalWithoutSmall || 0;

    const yCount = showSmallLvlProblems.value ?
      y.counters?.total || 0 :
      y.counters?.totalWithoutSmall || 0;

    const xTotal = x.value === NO_DATA ? maxValue : xCount;
    const yTotal = y.value === NO_DATA ? maxValue : yCount;
    return (xTotal < yTotal ? -1 : (xTotal > yTotal ? 1 : 0));
  }
  if (showOpt.value === TABLE_VIEWS.max.name ||
    showOpt.value === TABLE_VIEWS.detail.name) {
    const xMaxLvl = x.value === NO_DATA ? maxValue : x.counters?.maxSeverityLvl || 0;
    const yMaxLvl = y.value === NO_DATA ? maxValue : y.counters?.maxSeverityLvl || 0;
    if (xMaxLvl < yMaxLvl) return -1;
    if (xMaxLvl > yMaxLvl) return 1;

    let xMax = xMaxLvl ? x.counters?.max : 0;
    let yMax = yMaxLvl ? y.counters?.max : 0;
    
    if (showOpt.value === TABLE_VIEWS.max.name) {
      return (xMax < yMax ? -1 : (xMax > yMax ? 1 : 0));
    }

    if (showOpt.value === TABLE_VIEWS.detail.name) {
      if (xMaxLvl === maxValue) return 0;
      if (xMax !== yMax) return (xMax < yMax ? -1 : 1);
      let lvl = xMaxLvl;
      while (lvl >= SEVERITY_LEVELS.small) {
        xMax = x.counters[casesOfSeverityLevels[lvl]];
        yMax = y.counters[casesOfSeverityLevels[lvl]];
        if (xMax !== yMax) break;
        lvl--;
      } 
      return (xMax < yMax ? -1 : (xMax > yMax ? 1 : 0));
    }
  }
};

const nodesProblemsTable = ref(null);

const onClickCell = ({x, y}, {row, fieldName}) => {
  const cell = row[fieldName];
  let keys = [];
  const connect = row.connect.flags.connect === CONNECT_OK_STATUS;
  if (!connect && ['name', 'connect'].includes(fieldName)) keys.push('netManagement');
  if (connect && fieldName === 'name') keys = keysWithProblems.value;

  if (!cell.flags.hasProblems || noNeedShowSmallProblemButHas(cell)) {
    flashOK(cell);
    if (!keys.length) return;
  }
  if (!keys.length) keys.push(fieldName);

  const nodeName = row.name.fullName;
  const { modalName } = findCardModal({nodeName, keys}) || {};
  if (modalName) moveModalToFront(modalName);
  if (modalName) return;

  let hasBigProblems = false;
  let i = 0;
  while (!hasBigProblems && i < keys.length) {
    if (row[keys[i]].counters?.maxSeverityLvlWithoutSmall) hasBigProblems = true;
    i++;
  }
  const {problemsCollections, filledKeys} = getNodeProblemsCollections({nodeName, keys});
  openProblemsCard({
    problemsCollections,
    keys: filledKeys,
    hasBigProblems,
    x, y
  });
};

const flashOK = cell => {
  if (cell.flags.flashOK) return;
  cell.flags.flashOK = true;
  setTimeout(()=> cell.flags.flashOK = false, FLASH_OK_MS);
};

const noNeedShowSmallProblemButHas = cell => !showSmallLvlProblems.value &&
  cell.counters.maxSeverityLvl === +SEVERITY_LEVELS.small;

const cards = ref([]);

const selectedCardModalName = ref('');
watch(selectedCardModalName, (newName, oldName) =>
  newName === CLOSE_ALL_CARDS_OPTION ? closeAllCards() : moveModalToFront(newName));

watch(showSmallLvlProblems, (newFlag, oldFlag) => {
  if (!cards.value.length) return;
  cards.value.forEach(card => (!card.hasBigProblems & newFlag === false) ?
    closeCard(card.modalName) : card.content.showSmallLvl = newFlag);
  forceUpdateModals();
});

const setFrontCardInSelect = modalName => {
  if (!cards.value.length) return;
  selectedCardModalName.value = [...cards.value].sort(
    (a, b) => a.params.zIndex < b.params.zIndex ? 1 : -1
  )[0].modalName;
};

const findCardModal = ({modalName, nodeName, keys, allInOne}) => {
  if (!cards.value.length) return false;
  if (allInOne) return cards.value.find(card => card.allInOne);
  if (modalName) return cards.value.find(card => card.modalName === modalName);
  if (!nodeName || !keys.length) return false;

  return keys.length > 1 ?
    cards.value.find(card => card.params.fullNodeName === nodeName && card.allKeys) :
    cards.value.find(card =>
      card.params.fullNodeName === nodeName && card.key === keys[0]);
};

const delCardByModalName = modalName => {
  cards.value = cards.value.filter(card => card.modalName !== modalName);
  if (!cards.value.length) selectedCardModalName.value = '';
};

let maxCardsZIndex = 1000;

const moveModalToFront = modalName => {
  if (!modalName) return;
  const card = findCardModal({modalName});
  const { params } = card;

  if (params.zIndex < maxCardsZIndex) {
    const { el } = card;
    card.params.zIndex = el.style.zIndex = maxCardsZIndex += 2;
    selectedCardModalName.value = card.modalName;
  }
};

const getContentStyle = ({x, y}) => {
  const left = (x - CARD_WIDTH < 0 ? 0 : x - CARD_WIDTH) + 'px'; 
  let top;
  if (OPEN_CARD_UNDER_TABLE) {
    const tableRect = nodesProblemsTable.value.$el.getBoundingClientRect();
    top = Math.floor(tableRect.bottom) + 1 - CARD_Y_SHIFT;
  } else {
    const { clientHeight } = document.documentElement;
    const maxTop = clientHeight - CARD_Y_MIN_SHOW;
    top = y - CARD_Y_SHIFT;
    top = top < maxTop ? top: maxTop;
  }
  top += 'px';

  return { position: 'absolute', left, top};
};

const getProblemsOfCell = ({nodeName, type}) => problems.value[nodeName][type] || [];

const getNodeProblemsCollections = ({nodeName, keys}) => {
  const problemsCollections = [];
  const filledKeys = [];
  const { id, name } = nodesNames.value[nodeName];
  const nodeShowName = `${segment.value}/${id}. ${name}`;// СПБ-МКС/1. ИВЦ СПб РЖД
  keys.forEach(key => {
    const problems = getProblemsOfCell({nodeName, type: key});
    if (problems.length) {
      filledKeys.push(key);
      problemsCollections.push({
        nodeName,
        nodeShowName,
        key,
        problemTypeLabel: TABLE_KEYS[key].label,
        problems,
      });
    }
  });
  return {problemsCollections, filledKeys};
};

const openProblemsCard = ({problemsCollections, keys, hasBigProblems, x, y, allInOne})=> {
  const oneNodeParams = {};
  if (!allInOne) {
    const { nodeName } = problemsCollections[0];
    oneNodeParams.fullNodeName = nodeName;
    oneNodeParams.shortNodeName = nodesList.value.find(n => n.rawName === nodeName).name;
  }
  const modalName = `problem-card-${Date.now()}`;
  const manyKeys = allInOne || keys.length > 1;
  const zIndex = maxCardsZIndex += 2;
  const singleCellCardParams = manyKeys ? {} : {
    key: problemsCollections[0].key,
    problemTypeLabel: problemsCollections[0].problemTypeLabel,
  };

  $vfm.show({
    component: BaseModal,
    bind: {
      'size': allInOne ? 'print' : 'card',
      'drag': true,
      'dragSelector': `problem${!manyKeys ? '' : 's-collection'}-card-modal-drag`,
      'contentClass': 'glassy-cards',
      'contentStyle': {display: 'none !important'},
      'windowsMode': true,
      'name': modalName,
      'notOverlayHead': true,
      ...oneNodeParams,
      zIndex,
      keys,
    },
    on: {
      baseModalClose(closedModalName) {
        delCardByModalName(closedModalName);
        if (closedModalName === selectedCardModalName.value) {
          setFrontCardInSelect(closedModalName);
        }
      },
      baseModalMousedown(clickedModalName) {
        moveModalToFront(clickedModalName);
      }
    },
    slots: {
      'content': {
        component: manyKeys ? ProblemsCollectionCardView : ProblemCardView,
        bind: {
          showTitle: false,
          problemsCollections,
          showSmallLvl: showSmallLvlProblems.value,
          dateTime: getFullTimeAndZone.value,
        },
      },
    },
  });
  setTimeout(() => {
    const els = $vfm.get(modalName)[0].vfmContainer.value;
    const modalParams = $vfm.dynamicModals[$vfm.dynamicModals.length-1];
    const card = {
      modalName,
      keys,
      manyKeys,
      ...singleCellCardParams,
      el: els.parentNode,
      contentEl: els.firstChild,
      params: modalParams.bind,
      content: modalParams.slots.content.bind,
      hasBigProblems,
    };
    cards.value.push(card);
    selectedCardModalName.value = modalName;

    const style = getContentStyle({x, y});
    card.params.contentStyle = {};
    Object.keys(style).forEach(attr => card.contentEl.style[attr] = style[attr]);
    forceUpdateModals();
  }, 0);
  return modalName;
};

const forceUpdateModals = () => {
  // hack: show and hide modal works as $.forceUpdate() all opened modals instances
  const tempModalName = 'refreshModal';
  $vfm.show({
    component: BaseModal,
    bind: {
      'name': tempModalName,
      'title': 'Обновление карточек',
      'contentStyle': {display: 'none !important'},
      'windowsMode': true,
    }
  });
  setTimeout(()=> closeCard(tempModalName), 0);
};

const isHideCardKeyDown = ref(false);
const cardsHideOnH = computed(()=> isHideCardKeyDown.value ? 'none' : 'block');

onMounted(()=> {
  setPrintStyles();
  document.addEventListener('keydown', e => {
    if (e.code === 'KeyH' && !isHideCardKeyDown.value) isHideCardKeyDown.value = true;
    if ((e.code === 'KeyX' || e.code === 'BracketLeft') && selectedCardModalName.value) {
      closeCard(selectedCardModalName.value);
    }
  });
  document.addEventListener('keyup', e => {
    if (e.code === 'KeyH') isHideCardKeyDown.value = false;
  });
  document.onvisibilitychange = () => {
    if (document.visibilityState === 'hidden' && isHideCardKeyDown.value) {
      isHideCardKeyDown.value = false;
    }
  };
  window.addEventListener('beforeprint', async e => await setPrintStyles());
  window.addEventListener('afterprint', e => {
    // console.log('печать завершена');
    printMode.value = printBtns.table.key;
    setPageRules.clean();
  });
});

const closeCard = modalName => $vfm.hide(modalName);
const closeAllCards = () => $vfm.hideAll();

onUnmounted(()=> closeAllCards());

const printBtns = {
  table: {key: 'printTable', text: 'Печать таблицы'},
  cards: {key: 'printCardsAsIs', text: 'Печать карточек как на экране'},
  allInOne: {
    key: 'printCardsAllInOne',
    text: 'Печать открытых карточек в едином списке'
  },
};

const printMode = ref(printBtns.table.key);

const printPage = key => {
  printMode.value = key;
  if (key === printBtns.allInOne.key) {
    let hasBigProblems = false;
    const arr = [];
    cards.value.forEach(card => {
      if (card.hasBigProblems) hasBigProblems = true;
      card.content.problemsCollections.forEach(col => {
        const {nodeName, key} = col;
        if (!arr.find(c => c.nodeName === nodeName && c.key === key)) arr.push(col);
      });
    });
    const printCardName = openProblemsCard({
      problemsCollections: arr || [{nodeName: 'test'}],
      hasBigProblems,
      x: 0,
      y: CARD_Y_SHIFT,
      allInOne: true,
    });
    setTimeout(()=> {
      print();
      closeCard(printCardName);
    }, 500);
  } else {
    setTimeout(()=>print(), 500);
  }
};

const printBtnsSet = computed(()=> {
  const btns = {};
  if (hasProblems.value) btns[printBtns.table.key] = printBtns.table.text;
  if (cards.value.length) {
    btns[printBtns.cards.key] = printBtns.cards.text;
    btns[printBtns.allInOne.key] = printBtns.allInOne.text;
  }
  return btns;
});
const printSize = computed(()=>
  printMode.value === printBtns.allInOne.key ? 'A4 portrait' : 'A4 landscape');
const printMargin = computed(()=> printMode.value === printBtns.allInOne.key ?
  '1cm 1cm 1cm 2cm' : '24pt 24pt auto 18pt');
const printCardsAllInOneShow = computed(()=>
  printMode.value === printBtns.allInOne.key ? 'block' : 'none');
const printTableShow = computed(()=>
  printMode.value === printBtns.table.key ? 'block' : 'none');
const printCardsShow = computed(()=>
  printMode.value === printBtns.cards.key ? 'block': 'none');
const printVFMShow = computed(()=> [printBtns.allInOne.key, printBtns.cards.key]
  .includes(printMode.value) ? 'block': 'none');
const setPrintStyles = async () => await setPageRules.adds([
  {ruleName: 'size', ruleValue: printSize.value},
  {ruleName: 'margin', ruleValue: printMargin.value},
]);
</script>
<template>
  <base-page
    :kebabName="PAGE_NAME"
    :path="'products/' + PAGE_NAME"
    :title="getTitleWithTime"
    :titleTooltip="getTooltipTime"
  >
    <template #after-title>
      <span :class="[PAGE_NAME + '__after-title', 'noselect']">
        <span :class="PAGE_NAME + '__after-title__fulltime'">
          <b>Проблемы узлов</b> на {{getFullTimeReverse}}
        </span>
        <span :class="PAGE_NAME + '__after-title__cb'">
          <span>
            <countdown-timer
              :startTimestamp="startTimestamp"
              :interval="REFRESH_INTERVAL"
              @countdown-timer-first-start="() => startCountdownsFlag = true"
              @countdown-timer-over="updateNodesProblems()"
            />  
          </span>
          <span v-if="cards.length" :class="PAGE_NAME + '__after-title__select-card'">
            <select v-model="selectedCardModalName">
              <option v-for="card in cards" :key="card.modalName" :value="card.modalName">
                {{card.params.shortNodeName}}: {{ !card.manyKeys ?
                  card.problemTypeLabel : 'Все проблемы'}}
              </option>
              <option :value="CLOSE_ALL_CARDS_OPTION">Закрыть все</option>
            </select>
            <span :class="PAGE_NAME + '__after-title__select-card__close-btns'">
              <button
                :class="PAGE_NAME + '__after-title__select-card__close-btns__one'"
                @click="closeCard(selectedCardModalName)"
                title="Закрыть выбранную карточку"
              >X</button>
              <button
                v-if="cards.length > 1"
                :class="PAGE_NAME + '__after-title__select-card__close-btns__all'"
                @click.prevent="closeAllCards()"
                title="Закрыть все карточки"
              >
                <span
                  :class="PAGE_NAME + '__after-title__select-card__close-btns__all__1X'"
                >X</span>
                <span
                  :class="PAGE_NAME + '__after-title__select-card__close-btns__all__2X'"
                >x</span>
              </button>
            </span>
          </span>
        </span>
        <span :class="PAGE_NAME + '__after-title__radio'">
          Показать
            <span v-if="!cards.length">проблемы</span>
            <span
              v-if="cards.length"
              :class="PAGE_NAME + '__after-title__radio__text-end'"
            >проблемы</span>:
          <span v-for="(view, name) in TABLE_VIEWS" :key="name" class="hovered">
            <input
              type="radio"
              :id="`showOpt-${view.name}`"
              v-model="showOpt"
              :value="view.name"
            />
            <label
              :for="`showOpt-${view.name}`"
              :class="['hovered',
              showOpt === view.name ? PAGE_NAME + '__after-title__radio__choise' : '']"
            >
              {{view.text}}
            </label>
          </span>
          <span :class="PAGE_NAME + '__after-title__radio__cb-small-problems'">
            <input type="checkbox" id="show-small-problems-checkbox" class="hovered"
              v-model="showSmallLvlProblems" />
            <label for="show-small-problems-checkbox" class="hovered">
              Предупреждения
            </label>
          </span>
        </span>
      </span>
    </template>
    <template #dashboard>
      <span
        :class="`${showSmallLvlProblems ? 'show-small-problems' : ''} show-${showOpt}`"
      >
        <base-table
          ref="nodesProblemsTable"
          :classesNames="[PAGE_NAME + '__table', 'noselect']"
          :columns="getTableHeaders()"
          :rows="getRowsData"
          :sortOptions="{
            enabled: true,
            multipleColumns: true,
          }"
          :paginationOptions="{
            enabled: false,
          }"
        >
          <template #base-table-column="props">
            <div v-if="TABLE_KEYS[props.column.field].tooltip">
              <div
                :class="`${PAGE_NAME}__table__th__custom`"
                :title="TABLE_KEYS[props.column.field].tooltip || ''"
              >
                <span v-html="TABLE_KEYS[props.column.field].html || props.column.label"/>
                <span :class="`${PAGE_NAME}__table__th__custom__info`">
                  &nbsp;&#9432;
                </span>
              </div>
            </div>
            <div v-else>
              <span v-html="TABLE_KEYS[props.column.field].html || props.column.label"/>
            </div>
          </template>
          <template #base-table-table-row="props">
            <div
              :class="props.row[props.column.field].classNames"
              @click="e=>onClickCell(e,{row: props.row, fieldName: props.column.field})"
            >
              <div
                v-if="props.row[props.column.field].flags.hasProblems"
                :class="[PAGE_NAME + '__table__td__severity',
                (props.row[props.column.field].counters.maxSeverityLvl ===
                  +SEVERITY_LEVELS.small && !showSmallLvlProblems) ? '' : 'hovered'
                ]"
              >
                <span v-if="showOpt === TABLE_VIEWS.detail.name">
                  <span
                    v-for="lvl, i in props.row[props.column.field].counters.lvls" :key="i"
                  >
                    <span
                      v-if="lvl !== 'small' || showSmallLvlProblems"
                      :class="`${PAGE_NAME}__table__td__severity__detail-${lvl}`"
                    ><!--
                    -->&nbsp;{{props.row[props.column.field].counters[lvl]}}&nbsp;<!--
                  --></span>
                  </span>
                </span>
                <span v-if="showOpt === TABLE_VIEWS.max.name">
                  {{ props.row[props.column.field].counters[
                    showSmallLvlProblems ? showOpt : 'maxWithoutSmall'
                  ] }}
                </span>
                <span v-if="showOpt === TABLE_VIEWS.total.name">
                  {{ props.row[props.column.field].counters[
                    showSmallLvlProblems ? showOpt : 'totalWithoutSmall'
                  ] }}
                </span>
                <span
                  v-if="!showSmallLvlProblems &&
                    props.row[props.column.field].flags.flashOK"
                  :class="`${PAGE_NAME}__table__td__severity__detail-small`"
                >
                  &nbsp;{{props.row[props.column.field].counters.small}}&nbsp;
                </span>
              </div>
              <div
                v-else-if="props.row[props.column.field].value"
                :class="`${PAGE_NAME}__table__td__value`"
              >
                <span v-if="props.column.field === 'type'">
                  <span
                    :title="props.row[props.column.field].value + ' - ' +
                    getDescriptionOfNodeType(props.row[props.column.field].value)"
                  > 
                    {{props.row[props.column.field].value}}
                  </span>
                </span>
                <span v-else>
                  {{ props.row[props.column.field].value }}
                </span>
              </div>
              <div
                v-if="!props.row[props.column.field].value &&
                  !props.row[props.column.field].flags.hasProblems &&
                  props.row[props.column.field].flags.flashOK"
                  :class="`${PAGE_NAME}__table__td__flash-ok`"
              >
                OK
              </div>
            </div>
          </template>
        </base-table>
      </span>
      <span :class="PAGE_NAME + '__table-legend'">
        <node-table-legend />
      </span>
      <base-buttons-set
        :btnSetName="PAGE_NAME + '__print-btns'"
        :btns="printBtnsSet"
        @buttons-set-btn="args => printPage(args[0])"
      />
      <!-- {{printMode}}: 
      table={{printTableShow}}, cards={{printCardsShow}}, page={{printSize}},
      все карточки = {{printCardsAllInOneShow}}, поля = {{printMargin}}
      <button @click="()=>printMode = printBtns.table.key">печ таб</button>
      <button @click="()=>printMode = printBtns.cards.key">печ кар</button>
      <button @click="()=>printMode = printBtns.allInOne.key">печ всех кар</button> -->
    </template>
  </base-page>
</template>

<style lang="scss">

.nodes-table {
  &__after-title {
    &__fulltime {
      @media screen {
        display: none;
      }
    }
    &__select-card {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      width: min(250px, 20vw);
      max-width: 20vw;

      select {
        position: relative;
        font-size: 14px;
        max-width: calc(100vw - 250px - 290px - 570px - 1rem);
      }
      &__close-btns {
        // &__one {}
        &__all {
          // &__1X {}
          &__2X {
            display: inherit;
            transform: translate(-2px, -3px);
          }
        }
      }
    }
    &__cb, &__radio {
      font-size: 14px;
    }
    &__radio {
      &__text-end {
        @media (max-width: 1485px) {
          display: none;
        }
      }
      &__choise {
      text-decoration: underline;
      }
    }
  }
  &__table {
    --no-data-color: grey;
    --data-text-color: rgb(75, 12, 12);

    th {
      line-break: normal;
      text-align: center !important;
      vertical-align: middle !important;
      width: min-content;
    }
    &__th {
      &__custom {
        display: block;
        position: relative;
        min-width: 100%;
        width: 100%;
        min-height: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;

        &__info {
          pointer-events: auto;
          font-weight: 700;
          font-size: smaller;
          color: var(--info-tooltip-color);
          opacity: .6;
        }
      }
    }
    td {
      padding: 0 !important;
      height: 1.4em;
      border-left: 1px solid #DCDFE6;
      border-right: 1px solid #DCDFE6;
    }
    &__td {
      width: 100%;
      height: 100%;

      &__cell-connect__connect-fail,
      &__cell__connect-fail,
      &__cell-connect__connect-ok,
      &__severity,
      &__value {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      &__cell {
        &-connect__connect-fail {
          background-color: var(--critical-problem-color);
          color: yellow;
          font-size: 16px !important;
          text-align: center;
          cursor: pointer;
        }
        &__connect-fail {
          background-color: var(--no-data-color);
          color: var(--data-text-color);
          text-align: center;
        }
        &-connect__connect-ok, &__connect-ok {
          background-color: var(--ok-problem-color);
          color: var(--data-text-color);
        }
      }
      &__severity {
      text-align: center; // when details view on 2 strings
      font-size: 16;
      font-weight: bold;
      color: var(--data-text-color);
        &-critical {
          background-color: var(--critical-problem-color);
          border-color: var(--critical-problem-color);
        }
        &-high {
          background-color: var(--high-problem-color);
          border-color: var(--high-problem-color);
        }
        &-middle {
          background-color: var(--middle-problem-color);
          border-color: var(--middle-problem-color);
        }
        .show-small-problems &-small{
          background-color: var(--small-problem-color);
          border-color: var(--small-problem-color);
        }
        &__detail {
          width: min-content;
          &-critical {
            background-color: var(--critical-problem-color);
          }
          &-high {
            background-color: var(--high-problem-color);
          }
          &-middle {
            background-color: var(--middle-problem-color);
          }
          &-small {
            background-color: var(--small-problem-color);
          }
        }
      }
      &__flash-ok {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-weight: normal;
        color: var(--data-text-color);
      }
    }
  }
}
.glassy-cards {
  display: v-bind(cardsHideOnH) !important;
}

@media print {
  body {
    margin: 0pt;
    background-color: white !important;
  }
  .sidebar {
    display: none !important;
  }
  .vfm {
    display: v-bind(printVFMShow);
  }
  .base-page__head, .base-page__head-row {
    display: block !important;
    position: relative !important;
    min-height: 50px !important;
    margin: 0px !important;
    padding: 0px !important;
  }
  .page-nodes-table {
    background-color: white !important;
    margin: 0px !important;
    padding: 0px !important;
    &__board,
    &__dashboard {
      background-color: white !important;
    }
    &__title {
      display: none;
    }
  }
  .nodes-table {
    &__print-btns {
      display: none !important;
    }
    &__after-title {
      display: flex;
      flex-direction: row;
      align-content: space-between;
      &__fulltime {
        padding-left: 9pt;
        font-size: 13pt;
        font-weight: bold;
        letter-spacing: 0.2px;
        word-spacing: 4px;
      }
      &__select-card, &__cb {
        display: none !important;
      }
      &__radio {
        display: v-bind(printTableShow) !important;
        font-size: 10pt !important;
        margin-left: auto;
        margin-right: 0pt;
        &__cb-small-problems {
          display: inline !important;
        }
      }
    }
    &__table {
      margin-top: 0px !important;
      padding-top: 0px !important;
      display: v-bind(printTableShow) !important;
      color: black;
      &__th__custom__info {
        display: none !important;
      }
      &__td {
        background-color: white !important;
        &__cell {
          &__connect-fail {
            color: rgb(30,30,30);
          }
          &-connect__connect {
            &-ok {
              color: black
            }
            &-fail {
              color: rgb(30,30,30);
              font-size: 10pt !important;
            }
          }
        }
        &__severity {
          color: black;
          &-critical {
            width: calc(100% - 4pt);
            height: calc(100% - 4pt);
            border: var(--critical-problem-border);
          }
          &-high, &-middle, &-small {
            width: calc(100% - 2pt);
            height: calc(100% - 2pt);
          }
          &-high {
            border: var(--high-problem-border);
          }
          &-middle {
            border: var(--middle-problem-border);
          }
          .show-small-problems &-small{
            border: var(--small-problem-border);
          }
          .show-detail &-critical,
          .show-detail &-high,
          .show-detail &-middle,
          .show-detail &-small{
            width: 100%;
            height: 100%;
            border: none !important;
          }
          &__detail {
            font-weight: normal;
            width: min-content;
            background-color: white !important;
            &-critical, &-high, &-middle, &-small {
              background-color: white !important;
              margin: 0px 1pt;
              width: calc(100% - 2pt) !important;
              height: calc(100% - 2pt) !important;
            }
            &-critical {
              border: var(--critical-problem-border);
              width: calc(100% - 4pt) !important;
              height: calc(100% - 4pt) !important;
            }
            &-high {
              border: var(--high-problem-border);
            }
            &-middle {
              border: var(--middle-problem-border);
            }
            &-small {
              border: var(--small-problem-border);
            }
          }
        }
      }
    }
    &__table-legend {
      display: v-bind(printTableShow) !important;
    }
  }
  table.vgt-table {
    font-size: 9pt !important;
    thead th, tr td {
      color: black;
    }
    th {
      border: #DCDFE6 solid;
      border-width: 5pt 1pt;
      div {
        margin-left: 4pt;
      }
    }
    th button::before {
      border-top-color: white !important;
    }
    th button::after {
      border-bottom-color: white !important;
    }
  }
  .modal-size-print {
    display: v-bind(printCardsAllInOneShow) !important;
  }
  .modal-size-card {
    display: v-bind(printCardsShow) !important;
  }
}
</style>