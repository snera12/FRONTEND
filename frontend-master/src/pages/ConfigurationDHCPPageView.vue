<script setup>
import { computed, ref } from 'vue';
import { $vfm } from 'vue-final-modal';
import { sortIP } from '@/utils/utils.js';
import { timestampInSecondsToDate } from '@/utils/ApiUtils.js';
import useBaseUrl from '@/composables/useBaseUrl.js';
import useJSON from '@/composables/useJSON.js';
import SecondTitle from '@/components/elements/SecondTitle.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import DHCPEntryView from '@/views/DHCPEntryView.vue';
import DelDHCPModal from '@/components/modal/DelDHCPModal.vue';

const addZero = str => (''+str).length > 1 ? str : '0' + str;
const getLeaseBySecondsAfter1970 = seconds => {
  const d = timestampInSecondsToDate(seconds);
  if (!d) return ({open: false, expireDateString: 'Ошибка в данных!'});

  const string = `${addZero(d.getDate())}.${addZero(d.getMonth()+1)}.${d.getFullYear()} `+
    `${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
  return {
    open: true,
    expireDate: d,
    expireDateString: string
  };
};

const getEntry = ( entry = {}, options = {
  needLease: false,
  isLeaseOnly: false,
  isLaeseSeparated: false,
  _devSign: '!!!noSign',
}) => {
  let errors = '';
  if (options.isLeaseOnly && !options.isLaeseSeparated) errors += 'Только аренда; ';
  if (!entry.ip) errors += 'Нет IP-адреса; ';
  if (!entry.hostname) errors += 'Нет имени хоста; ';
  if (!entry.mac) errors += 'Нет MAC-адреса; ';
  if (!options.isLaeseOnly && !entry.vlan) errors += 'Нет VLAN; ';

  entry = {
    'host': entry.hostname,
    'ip': entry.ip || 'НЕТ_IP-адреса(!)',
    'mac': entry.mac || 'НЕТ_MAC-адреса(!)',
    'vlan': entry.vlan || '',
    'actions': (options.isLaeseSeparated || options.isLaeseOnly) ? false : '',
    'lease': options.needLease ? getLeaseBySecondsAfter1970(entry.expire) : {},
    'errors': errors,
  };
  entry.lease.only = !!options.isLaeseOnly;
  return entry;
};

const getEditedEntry = (entry = {}, addon) => {
  if (addon) {
    entry.lease = getLeaseBySecondsAfter1970(addon.expire);
    if (addon.mac !== entry.mac) entry.errors += `MAC (аренда): "${addon.mac}"; `;
    if (addon.hostname !== entry.host) {
      entry.errors += `Хост (аренда): "${addon.hostname}"; `;
    }
  }
  return entry;
};

const { baseUrl } = useBaseUrl();
const { json: dhcp, updateJSON: updateDHCP} = useJSON({
  url: `${baseUrl.value}network/dhcp`,
  suffixName: 'data',
});
const rawEntriesDHCP = ref(dhcp);

const { json: leases} = useJSON({
  url: `${baseUrl.value}network/dhcp/lease`,
  suffixName: 'data',
});
const rawEntriesLeases = ref(leases);

const getDHCPEntries = computed(() => {
  if (!rawEntriesDHCP.value.length) return [];
  const entries = [];
  const options = {_devSign: 'getDHCPEntries'};
  rawEntriesDHCP.value.forEach(entry => entries.push(getEntry(entry, options)));
  return entries;
});

const getLeaseEntries = computed(() => {
  if (!rawEntriesLeases.value.length) return [];
  const entries = [];
  const options = {
    isLaeseOnly: true,
    isLaeseSeparated: true,
    needLease: true,
    _devSign: 'getLeaseEntries',
  };
  rawEntriesLeases.value.forEach( lease => entries.push(getEntry(lease, options)));
  return entries;
});

const getMergedEntries = computed(() => {      
  if (!rawEntriesDHCP.value?.length || !rawEntriesLeases.value?.length) return [];
  const entries = [...getDHCPEntries.value];
  rawEntriesLeases.value.forEach( lease => {
    let host = entries.find(entry => entry.ip === lease.ip);
    if (host) host = getEditedEntry(host, lease);
    if (!host) {
      const options = {
        needLease: true,
        isLaeseOnly: true,
        _devSign: 'getMergeEntries_pureLease'
      };
      entries.push(getEntry(lease, options));
    }
  });
  return entries;
});

const headersNames = {
  host: { label: 'Хост', field: 'host', width: '15%' },
  ip: { label: 'Адрес', field: 'ip', width: '10%', sortFn: sortIP},
  mac: { label: 'MAC', field: 'mac', width: '15%'},
  vlan: { label: 'VLAN', field: 'vlan', width: '5%', table: 'dhcp'},
  lease: {
    label: 'Аренда до',
    field: 'lease.expireDateString',
    width: '20%',
    table: 'lease'
  },
  actions: {
    label: 'Действия',
    field: 'actions',
    width: '5%',
    table: 'dhcp',
    sortable: false,
    globalSearchDisabled: true,
  },
  errors: { label: 'Замечания', field: 'errors'},
};

const getHeaders = table => {
  const headers = [];
  let entries = {
    dhcp: getDHCPEntries,
    lease: getLeaseEntries,
    merge: getMergedEntries,
  };
  entries = entries[table].value;
  if (!entries) return headers;

  Object.keys(headersNames).forEach(key => {
    if (key !== 'errors') {
      const header = headersNames[key];
      if (!header.table || header.table === table) headers.push(header);
      if (header.table && table === 'merge') headers.push(header);
    }
  });
  if (entries.find(entry => entry.errors.length)) headers.push({ ...headersNames.errors});
  return headers;
};

const areTablesMerged = ref(true);

const onClickDelEntry = dhcp => {
  $vfm.show({
    component: DelDHCPModal,
    bind: {dhcp},
    on: {
      delDhcpConfirm(close) {
        close();
        updateDHCP();
      },
      delDhcpCancel(close) {
        close();
      },
    }
  });
};

const openDHCPEntryModal = ({ mode = 'create', entry = {} }) => {
  const modalName = mode + '-dhcp-modal';
  let title = mode === 'create' ? 'Добавление' : 'Редактирование';
  title += ' записи в DHCP';
  $vfm.show({
    component: BaseModal,
    bind: {
      'size': 'md',
      'name': modalName,
      'title': title,
    },
    on: {},
    slots: {
      'content': {
        component: DHCPEntryView,
        bind: {
          mode: mode,
          showTitle: false,
          dhcp: entry,
        },
        on: {
          dhcpEntryConfirm(mode) {
            $vfm.hide(modalName);
            updateDHCP();
          },
          dhcpEntryCancel(mode) {
            $vfm.hide(modalName);
          },
        },
      },
    },
  });
};

</script>

<template>
  <base-page
    kebabName="network-dhcp"
    path="network/dhcp"
    title="Конфигурация DHСP"
  >
    <template #after-title>
      <span>
        <input type="checkbox" id="merge-tables-checkbox"
          v-model="areTablesMerged" />
        <label for="merge-tables-checkbox">
          Объединить таблицы
        </label>
      </span>
      <span>
        <base-button
          @click="openDHCPEntryModal({mode: 'create'})"
          btnName="add-dhcp"
          text="Добавить DHCP"
        />
      </span>
    </template>
    <template #dashboard>
      <div v-if="areTablesMerged">
        <base-table
          :fixedHeader="true"
          :columns="getHeaders('merge')"
          :rows="getMergedEntries"
          :sortOptions="{
            enabled: true,
            multipleColumns: true,
            initialSortBy: {field: 'host', type: 'asc'},
          }"
          :paginationOptions="{
            enabled: true,
            mode: 'pages',
            perPage: 100,
            position: 'bottom',
            perPageDropdown: [15, 25, 50, 100],
            dropdownAllowAll: true,
          }"
          :searchOptions="{enabled: true}"
        >
          <template #base-table-table-row="props">
            <span v-if="props.column.field === 'actions'">
              <span v-if="!props.row.lease.only">
                <i class="fas fa-sm fa-trash .btn-table btn-danger icon-btn"
                  @click="onClickDelEntry(props.row)"
                ></i>
              </span>
              <span>
                <i class="fas fa-sm fa-edit .btn-table btn-success icon-btn"
                  @click="openDHCPEntryModal({ mode:'edit', entry: props.row})"
                ></i>
              </span>
            </span>
          </template>
        </base-table>
      </div>
      <div v-else>
        <base-table
          :fixedHeader="true"
          :columns="getHeaders('dhcp')"
          :rows="getDHCPEntries"
          :sortOptions="{
            enabled: true,
            multipleColumns: true,
            initialSortBy: {field: 'host', type: 'asc'},
          }"
          :paginationOptions="{
            enabled: true,
            mode: 'pages',
            perPage: 12,
            position: 'bottom',
            perPageDropdown: [15, 25, 50, 100],
            dropdownAllowAll: true,
          }"
        >
          <template #base-table-table-row="props">
            <span v-if="props.column.field === 'actions'">
              <span>
                <i class="fas fa-sm fa-trash .btn-table btn-danger icon-btn"
                  @click="onClickDelEntry(props.row)"
                ></i>
              </span>
              <span>
                <i class="fas fa-sm fa-edit .btn-table btn-success icon-btn"
                  @click="openDHCPEntryModal({ mode:'edit', entry: props.row})"
                ></i>
              </span>
            </span>
          </template>
        </base-table>
        <second-title title="Аренда DHCP для IP-адресов" kebabName="leases"/>
        <base-table
          :fixedHeader="true"
          :columns="getHeaders('lease')"
          :rows="getLeaseEntries"
          :sortOptions="{
            enabled: true,
            multipleColumns: true,
            initialSortBy: {field: 'host', type: 'asc'},
          }"
          :paginationOptions="{
            enabled: true,
            mode: 'pages',
            perPage: 12,
            position: 'bottom',
            perPageDropdown: [15, 25, 50, 100],
            dropdownAllowAll: true,
          }"
        >
        </base-table>
      </div>
    </template>
  </base-page>
</template>

<style lang="scss">
.icon-btn:hover{
  cursor: pointer;
}
</style>