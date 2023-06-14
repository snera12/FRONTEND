import JumpToOldVersModal from '@/components/modal/JumpToOldVersModal.vue';

const ALWAYS_ON_FRONT_Z_INDEX = 99999;

export const jumpToLinkDialog = {
  data() {
    return {
      oldImplement: 'Этот функционал ещё не реализован на новом дизайне. ' +
        'Вы можете вызвать его из старой версии.',
    };
  },
  methods: {
    onClickOldLink(link, options = {}) {
      if (!options.notes) options.notes = {pref: false, post: false};
      this.$vfm.show({
        component: JumpToOldVersModal,
        bind: {link, options, zIndex: ALWAYS_ON_FRONT_Z_INDEX},
        on: {
          jumpToOldVersConfirm(close) {
            close();
          },
          jumpToOldVersCancel(close) {
            close();
          },
        },
      });
    },
  }
};