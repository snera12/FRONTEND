<template>
  <base-page
    kebabName="accounts-list"
    path="accounts/list"
    title="Пользователи"
  >
    <template #after-title>
      <base-button
        btnName="create-user"
        @click="openCreateUserModal"
        text="Добавить пользователя"
      />
    </template>
    <template #dashboard>
      <base-table
        :fixedHeader="true"
        :columns="getTableHeaders"
        :rows="getRowsData"
        :sortOptions="{
          enabled: true,
          multipleColumns: true,
          initialSortBy: [
            {field: 'roles', type: 'asc'},
            {field: 'login', type: 'asc'},
          ],
        }"
        :paginationOptions="{
          enabled: true,
          mode: 'pages',
          perPage: 21,
          position: 'bottom',
          perPageDropdown: [15, 25, 50, 100],
          dropdownAllowAll: true,
        }"
        :selectOptions="{
          enabled: true,
          selectionInfoClass:
            'page-accounts-list__dashboard__table-users__selection-row',
          selectAllByGroup: true,
        }"
        :searchOptions="{enabled: true}"
      >
        <template #base-table-table-row="props">
          <span
            :id="`${props.row.login}-actions-panel`"
            class="user-actions-panel"
            v-if="props.column.field === 'actions'"
          >
            <span>
              <i
                title="Сменить пароль"
                :id="`${props.row.login}-edit-password-btn`"
                class="fas fa-sm fa-key .btn-table btn-success icon-btn"
                @click="onClickOldLink(
                  `accounts/changepassword/${props.row.login}/?next=/accounts/list/`,
                  {notes: {pref: oldImplement}}
                )"
              ></i>
            </span>
            <span>
              <span v-if="props.row.lock">
                <i
                  title="Разблокировать пользователя"
                  :id="`${props.row.login}-unblock-btn`"
                  class="fas fa-sm fa-unlock .btn-table btn-success icon-btn"
                  @click="onClickUserAction({
                    'type': 'unblock',
                    'name': 'Разблокировать'
                  }, props.row.login)"
                ></i>
              </span>
              <span v-else>
                <i
                  title="Блокировать пользователя"
                  :id="`${props.row.login}-block-btn`"
                  class="fas fa-sm fa-lock .btn-table btn-danger icon-btn"
                  @click="onClickUserAction({
                    'type': 'block',
                    'name': 'Блокировать'
                  }, props.row.login)"
                ></i>
              </span>
            </span>
            <span>
              <i
                title="Удалить пользователя"
                :id="`${props.row.login}-del-btn`"
                class="fas fa-sm fa-trash .btn-table btn-danger icon-btn"
                @click="onClickUserAction({
                  'type': 'delete',
                  'name': 'Удалить'
                }, props.row.login)"
              ></i>
            </span>
            <span>
              <i
                title="Редактировать данные пользователя"
                :id="`${props.row.login}-edit-btn`"
                class="fas fa-sm fa-edit .btn-table btn-success icon-btn"
                @click="onClickOldLink(
                  `accounts/edit/${props.row.login}/?next=/accounts/list/`,
                  {notes: {pref: oldImplement}}
                )"
              ></i>
            </span>
          </span>
        </template>
        <template #base-table-selected-row-actions>
          <button
            id="block-selected-users-btn"
            class="table-btn"
            @click="onClickRowAction"
            title="Заблокировать всех выбранных пользователей"
          >
            &#128274;
          </button>
          <button
            id="del-selected-users-btn"
            class="table-btn"
            @click="onClickRowAction"
            title="Удалить всех выбранных пользователей"
          >
            &#128465;
          </button>
          <button
            id="edit-selected-users-btn"
            class="table-btn"
            @click="onClickRowAction"
            title="Редактировать группы всех выбранных пользователей"
          >
            &#128393;
          </button>
        </template>
      </base-table>
    </template>
  </base-page>
</template>

<script>
import useJSON from '@/composables/useJSON.js';
import { jumpToLinkDialog } from '@/mixins/jumpToLinkDialog.js';
import UnderConstructionModal from '@/components/modal/UnderConstructionModal.vue';
import UserActionModal from '@/components/modal/UserActionModal.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import AccountUserView from '@/views/AccountUserView.vue';

export default {
  name: 'AccountListView',
  mixins: [jumpToLinkDialog], // with onClickOldLink()
  setup(props) {
    const { json, updateJSON } = useJSON();
    return { json, updateJSON };
  },
  data() {
    return {
      searchOptions: {
        // main: true,
        headers: true,
        // dropDown: "OR",
      },
      noneRole: {
        key: 'none',
        name: 'Нет ролей'
      },
      underfindRole: {
        key: 'underfind',
        name: 'Неизвестная роль'
      },
    };
  },
  computed: {
    getTableHeaders() {
      if (!this.json) return [null];
      return [
        // defaults: type: 'text', sortable: true, firstSortType: 'asc'
        { 
          label: 'Псевдоним',
          field: 'login',
          filterOptions: {
            enabled: this.searchOptions ? this.searchOptions.headers : true,
            placeholder: 'Поиск по псевдониму'
          },
          width: '28%',
        },
        {
          label: 'Почта',
          field: 'mail',
          filterOptions: {
            enabled: this.searchOptions ? this.searchOptions.headers : true,
            placeholder: 'Поиск по почте' },
          width: '28%',
        },
        {
          label: 'Роли',
          field: 'roles',
          filterOptions: {
            enabled: this.searchOptions ? this.searchOptions.headers : true,
            filterDropdownItems: Object.values(this.getRolesTranslations),
            trigger: '',
            placeholder: 'Роль не выбрана'
          },
          width: '28%',
        },
        {
          label: "Действия",
          field: 'actions',
          sortable: false,
          globalSearchDisabled: true,
          html: true}
      ];
    },
    getRolesTranslations() {
      const roles = {
        [this.noneRole.key]: this.noneRole.name,
        [this.underfindRole.key]: this.underfindRole.name,
      };
      if (!(this.json?.translations)) return roles;
      this.json.translations.forEach(tuple => roles[tuple[0]] = tuple[1]);
      return roles;
    },
    getRowsData() {
      const rowsData = [];
      if (this.json?.ldap_users_and_groups) {
        const users = this.json.ldap_users_and_groups;
        const translations = this.getRolesTranslations;
        Object.keys(users).forEach(key => {
          const user = users[key];
          if (!user.groups.length) user.groups = [this.noneRole.key];
          const roles = user.groups.map(
            group => translations[group] || translations.underfind
          ).join(' ; ');
          rowsData.push({
            login: key,
            mail: user.mail,
            roles: roles,
            lock: !user.active,
            actions: '',
          });
        });
      }
      return rowsData;
    },
  },
  methods: {
    async updateTable() {
      this.updateJSON();
    },
    onClickRowAction() {
      this.$vfm.show({
        component: UnderConstructionModal,
        on: {
          underConstructionConfirm(close) {
            close();
          },
        }
      });
    },
    onClickUserAction(action, userName, self = this) {
      this.$vfm.show({
        component: UserActionModal,
        bind: {action, userName},
        on: {
          userActionConfirm(close) {
            close();
            self.updateTable();// обновить таблицу
          },
          userActionCancel(close) {
            close();
          },
        }
      });
    },
    openCreateUserModal() {
      const modalName = 'create-user-modal';
      const $vfm = this.$vfm;
      const updateTable = this.updateTable;
      $vfm.show({
        component: BaseModal,
        bind: {
          'size': 'md',
          'name': modalName,
          'title': 'Регистрация пользователя',
        },
        on: {},
        slots: {
          'content': {
            component: AccountUserView,
            bind: {
              mode: 'create',
              showTitle: false,
            },
            on: {
              accountUserConfirm(mode) {
                $vfm.hide(modalName);
                updateTable();
              },
              accountUserCancel(mode) {
                $vfm.hide(modalName);
              },
            },
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
.icon-btn:hover{
  cursor: pointer;
}
</style>