import { $vfm } from 'vue-final-modal';
import UnderConstructionModal from '@/components/modal/UnderConstructionModal.vue';
export const openUnderConstructionModal = () => {
  $vfm.show({
    component: UnderConstructionModal,
    on: {
      underConstructionConfirm(close) {
        close();
      },
    }
  });
};