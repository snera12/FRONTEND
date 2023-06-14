<script setup>
import { computed, ref } from 'vue';
import useBaseUrl from '@/composables/useBaseUrl.js';
import useJSON from '@/composables/useJSON.js';
import { $vfm } from 'vue-final-modal';
import DelSwitchModal from '@/components/modal/DelSwitchModal.vue';
import AddClientConnectionModal from '@/components/modal/AddClientConnectionModal.vue';
import { getWordEndingAfterNum } from '@/utils/utils.js';

const PAGE_NAME = 'switch';

const SWITCH_TYPE_NAMES = {
  'client': { short: 'cl', name: 'Клиентский' },
  'transport': { short: 'tr', name: 'Транспорт' },
  'managment': { short: 'co', name: 'Управление' }, // After update backend: 'ma'
  'security': { short: 'sh', name: 'Безопасность' }, // After update backend: 'se'
  'unknown': { short: 'un', name: 'Неизвестный тип' },
  'none': { short: 'un', name: 'Не задан' },
};

const allTypeNamesByShortNames = () => {
  const names = {};
  Object.values(SWITCH_TYPE_NAMES).forEach(value => names[value.short] = value.name);
  return names;
};

const TABLE_ROLES_VIEWS = {
  all: {
    name: 'all',
    text: 'Все',
    types: Object.values(SWITCH_TYPE_NAMES).map(value => value.name),
  },
  client: {
    name: 'client',
    text: 'Для клиентских соединений',
    types: [SWITCH_TYPE_NAMES.client.name],
  },
  childs: {
    name: 'childs',
    text: 'Для подключения коммутаторов',
    types: [SWITCH_TYPE_NAMES.transport.name]
  }, 
  other: {
    name: 'other',
    text: 'Другие',
    types: Object.values(SWITCH_TYPE_NAMES)
      .map(value => value.name)
      .filter(name =>
        name !== SWITCH_TYPE_NAMES.client.name &&
        name !== SWITCH_TYPE_NAMES.transport.name
      ),
  },
};

const showRole = ref(TABLE_ROLES_VIEWS.all.name);

const { baseUrl } = useBaseUrl();
const { json: switchesJson, updateJSON: updateSwitches} = useJSON({
  url: `${baseUrl.value}data/${PAGE_NAME}`,
  suffixStr: '/?json=true&json_switch_list',
  jsonMethod: 'text',
});

const KEYS = {
  name: { label: 'Идентификатор', sort: true, },
  node: {
    label: 'Узел',
    sort: true,
    useKey: 'node_id',
    useFn: node => node.name,
  },
  role: {
    label: 'Роль',
    sort: true,
    useKey: 'logical_type', // After update backend: 'role'
    useFn: type => { // After update backend: update Fn
      let role = 'Другие';
      if (type === SWITCH_TYPE_NAMES.client.short) role = TABLE_ROLES_VIEWS.client.text;
      if (type === SWITCH_TYPE_NAMES.transport.short) {
        role = TABLE_ROLES_VIEWS.transport.text;
      }
      return role;
    },
    skipViews: ['client', 'childs', 'other'],
  },
  type: {
    label: 'Тип',
    sort: true,
    useKey: 'logical_type',
    useFn: type => !type ? SWITCH_TYPE_NAMES.none.name :
      allTypeNamesByShortNames()[type] || SWITCH_TYPE_NAMES.unknown.name,
    skipViews: ['client', 'childs'],
  },
  model: { label: 'Модель', sort: true, },
  ports: {
    label: 'Порты',
    multiKey: true,
    useFn: curSw => `${curSw.ports} / ${curSw.control_port} / ${curSw.test_port}`,
    sort: false,
    customHeaderHTML: `<span
      class="exprerimenty"
      title="Число портов / Порт управления / Порт тестирования"
    >
    <span>Порты</span>
    <span class="itooltip">&#9432;</span>`,
  },
  connect: {
    label: 'Соединения',
    sort: false,
    multiKey: true,
    useFn: curSw => {
      const useConnections = curSw.logical_type === SWITCH_TYPE_NAMES.client.short;
      if (!useConnections) return { useConnections };
      return {
        useConnections,
        hasConnections: useConnections && curSw.get_connections?.length,
        connections: curSw.get_connections,
        hasFreePorts: !!curSw.get_freeports.length,
        freePorts: curSw.get_freeports,
      };
    },
    skipViews: ['childs', 'other'],
  },
  actions: {
    label: 'Действия',
    sort: false,
    cssClass: false,
    multiKey: true,
    useFn: curSw => ({
      canDel: !curSw.get_connections.length && !curSw.get_down.length,
      hasConnections: !!curSw.get_connections.length,
      hasChilds: !!curSw.get_down.length,
    })
  },
};

const switchCommands = {
  pingDevice: {
    text: '',
    shortText: '',
    djangoUrl: false, // TODO: update after backend update
  },
  getDeviceStatus: {
    text: 'Узнать текущее состояние устройства',
    shortText: '',
    djangoUrl: 'status',
  },
  setConfigToDevice: {
    text: 'Обновить конфигурацию на устройстве',
    shortText: '',
    djangoUrl: 'set_config/<str:version>', // TODO: update after backend update
  },
  compareDeviceConfigWithDB: {
    text: 'Сравнение конфигурации с записью в БД',
    shortText: '',
    djangoUrl: 'check',
  }, 
  getConfigFromDB: {
    text: 'Получить конфигурацию из БД',
    shortText: 'Конфигурация(БД)',
    djangoUrl: 'get_config',
  },
  getLastConfigFromDB: {
    text: 'Получить последнюю конфигурацию из БД',
    shortText: 'Последняя конфигурация(БД)',
    djangoUrl: 'get_config',
    params: { version: 'last' },
  },
  delSwitchFromDB: {
    text: 'Удалить устройство из БД',
    shortText: 'Удалить свитч(БД)',
    djangoUrl: 'delete_switch',
  },
  getConfigFromDevice: {
    text: 'Получить конфигурацию из устройства',
    shortText: 'Конфигурация на свитче',
    djangoUrl: 'get_config_device',
  },
  getDeviceConfigList: {
    text: 'Вывести список конфигураций для устройства',
    shortText: 'Список конфигураций(БД)',
    djangoUrl: 'list_config',
  },
  addNewSwitchToDB: {
    text: 'Добавить в БД запись о новом устройстве switch',
    shortText: '',
    api: 'add new switch',
    // TODO: update after backend update:
    djangoUrl: 'add_device/<str:hostname>/<str:manufacturer>',
  },
  addNewConfigOfSwitchToDB: {
    text: 'Добавить в БД запись о новой конфигурации switch',
    shortText: '',
    // TODO: update after backend update:
    djangoUrl: 'add_config/<str:seqid>', // seqid: unic integer number
  },
};

const getTableHeaders = () => {
  const tableHeaders = [];
  Object.keys(KEYS).forEach(key => {
    const options = KEYS[key];
    if (!options.skipViews?.includes(showRole.value)) {
      tableHeaders.push({
        field: key,
        label: options.label,
        width: options.width || '12.5%',
        sortable: options.sort || false,
      });
    }
  });
  return tableHeaders;
};

const getRowsDataForAllRoles = computed(() => {
  const rowsData = [];
  const switches = switchesJson.value.switch_list;
  if (!switches || !switches.length) return rowsData;
  switches.forEach(curSw => {
    const row = { id: curSw.id };
    Object.keys(KEYS).forEach(key => {
      const useKey = KEYS[key].multiKey ? false : KEYS[key].useKey || key;
      const rawData = useKey ? curSw[useKey] : curSw;
      row[key] = KEYS[key].useFn ? KEYS[key].useFn(rawData) : rawData;
    });
    rowsData.push(row);
  });
  return rowsData;
});

const getRowsData = computed(() => {
  if (showRole.value === TABLE_ROLES_VIEWS.all.name) return getRowsDataForAllRoles.value;
  const showTypes = TABLE_ROLES_VIEWS[showRole.value].types;
  return getRowsDataForAllRoles.value.filter(row => showTypes.includes(row.type));
});

const onClickDelSwitch = ({id, name, node}) => {
  $vfm.show({
    component: DelSwitchModal,
    bind: {
      curSwitch: {
        id,
        switchName: name,
        nodeName: node, 
      },
    },
    on: {
      delSwitchConfirm(close) {
        close();
        updateSwitches();
      },
      delSwitchCancel(close) {
        close();
      },
    },
  });
};

const onClickAddClientConnection = row => {
  console.log(row);
  $vfm.show({
    component: AddClientConnectionModal,
    bind: {
      curSwitch: {
        id: row.id,
        switchName: row.name,
        freePorts: row.connect.freePorts,
      },
    },
    on: {
      addClientConnectionConfirm(close) {
        close();
        updateSwitches();
      },
      addClientConnectionCancel(close) {
        close();
      },
    },
  });
};

</script>

<template>
  <base-page
    :kebabName="'data-'+PAGE_NAME"
    :path="'data/' + PAGE_NAME"
    title="Коммутаторы"
  >
    <template #after-title>
      <span :class="[PAGE_NAME + '__after-title', 'noselect']">
        <span :class="PAGE_NAME + '__after-title__radio'">
          Показать роли:
          <span v-for="(view, name) in TABLE_ROLES_VIEWS" :key="name" class="hovered">
            <input
              type="radio"
              :id="`showRole-${view.name}`"
              v-model="showRole"
              :value="view.name"
            />
            <label
              :for="`showRole-${view.name}`"
              :class="['hovered',
              showRole === view.name ? PAGE_NAME + '__after-title__radio__choise' : '']"
            >
              {{view.text}}
            </label>
          </span>
        </span>
      </span>
    </template>
    <template #dashboard>
      <base-table
        :classesNames="[PAGE_NAME + '__table']"
        :columns="getTableHeaders()"
        :rows="getRowsData"
        :sortOptions="{
          enabled: true,
          multipleColumns: true,
        }"
        :paginationOptions="{
          enabled: true,
          mode: 'pages',
          perPage: 21,
          position: 'bottom',
          perPageDropdown: [15, 25, 50, 100],
          dropdownAllowAll: true,
        }"
      >
        <template #base-table-table-row="props">
          <span v-if="props.column.field === 'connect'">
            <span v-if="props.row.connect.useConnections">
              <span
                v-if="props.row.connect.hasConnections"
              >
                {{ props.row.connect.connections.length }}
                соединени{{getWordEndingAfterNum(
                  props.row.connect.connections.length,
                  ['е', 'я', 'й']) }}
              </span>
              <span
                v-if="props.row[props.column.field].hasFreePorts"
                class="btn-table btn-success"
                @click="onClickAddClientConnection(props.row)"
              >
                +
              </span>
            </span>
          </span>
          <span v-if="props.column.field === 'actions'">
            <span v-if="props.row[props.column.field].canDel">
              <i class="fas fa-sm fa-trash .btn-table btn-danger icon-btn"
                @click="onClickDelSwitch(props.row)"
              ></i>
            </span>
            <span v-else>
              <span v-if="props.row[props.column.field].hasConnections">
                нельзя удалить: коннекты
              </span>
              <span v-if="props.row[props.column.field].hasChilds">
                нельзя удалить: подключены коммутаторы
              </span>
            </span>
          </span>
        </template>
        <template #base-table-column="props">
          <span
            v-if="KEYS[props.column.field].customHeaderHTML"
            v-html="KEYS[props.column.field].customHeaderHTML"
          />
          <span v-else>
            {{props.column.label}}
          </span>
        </template>
      </base-table>
    </template>
  </base-page>
</template>

<style lang="scss" scoped>

.switch {
  &__after-title {
    &__radio {
      font-size: 14px;
    }
    &__radio__choise {
      text-decoration: underline;
    }
  }
  &__table {
    th {
      line-break: normal;
      text-align: center !important;
      vertical-align: middle !important;
      width: min-content;
    }

    &__td {
      width: 100%;
      height: 100%;
    }
  }
}
.btn-success {
  color: green;
  font-size: 24px;
  font-weight: bold;
}
.btn-success:hover {
  cursor: pointer;
}
</style>