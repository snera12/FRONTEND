import { $vfm } from 'vue-final-modal';
import BaseModal from '@/components/base/BaseModal.vue';
import UserPermissionsModal from '@/components/modal/UserPermissionsModal.vue';

export const openUserPermissionsModal = () => {
  const modalName = 'userPermissionsModal';
  $vfm.show({
    component: BaseModal,
    bind: {
      'size': 'card',
      'name': modalName,
      'btns': { close: 'ОК (закрыть)' },
      'zIndex': 9999,
    },
    on: {
      baseModalBtn() {
        $vfm.hide(modalName);
      },
    },
    slots: {
      'content': {
        component: UserPermissionsModal,
        bind: {
          showTitle: true,
        },
      },
    },
  });
};