import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import { vfmPlugin } from 'vue-final-modal';

import App from '@/App.vue';

// packages:
import Maska from 'maska';

// services:
import { startMessenger } from '@/services/messenger.js';
import { startMsgSubscriber } from '@/services/msgSubscriber';

// Components:
import BasePageView from '@/components/base/BasePageView.vue';
import BaseNavMenu from '@/components/base/BaseNavMenu.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseForm from '@/components/base/BaseForm.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseButtonsSet from '@/components/base/BaseButtonsSet.vue';
import BaseDialogModal from '@/components/base/BaseDialogModal.vue';
import UnderConstructionModal from '@/components/modal/UnderConstructionModal.vue';
import JumpToOldVersModal from '@/components/modal/JumpToOldVersModal.vue';
import UserActionModal from '@/components/modal/UserActionModal.vue';
import WebTerminal from '@/components/tools/WebTerminal.vue';

const components = [
  {name: 'BasePage', cmp: BasePageView},
  {name: 'BaseNavMenu', cmp: BaseNavMenu},
  {name: 'BaseTable', cmp: BaseTable},
  {name: 'BaseModal', cmp: BaseModal},
  {name: 'WebTerminal', cmp: WebTerminal},
  {name: 'BaseDialogModal', cmp: BaseDialogModal},
  {name: 'UnderConstructionModal', cmp: UnderConstructionModal},
  {name: 'JumpToOldVersModal', cmp: JumpToOldVersModal},
  {name: 'UserActionModal', cmp: UserActionModal},
  {name: 'BaseInput', cmp: BaseInput},
  {name: 'BaseForm', cmp: BaseForm},
  {name: 'BaseButton', cmp: BaseButton},
  {name: 'BaseButtonsSet', cmp: BaseButtonsSet},
];

const VueFinalModalSettings = {
  key: '$vfm',
  componentName: 'VueFinalModal',
  dynamicContainerName: 'VueModalsBox'
};

const app = createApp(App);
components.forEach(c => app.component(c.name, c.cmp));
// TODO: components.fillAutoName.fillCustomName
// TODO fillAutoName: name = cmp.constructor.name; 
app
  .use(createPinia()) // store
  .use(router)
  .use(vfmPlugin(VueFinalModalSettings))
  .use(Maska) // plugin
  .mount('#app');

// window.onbeforeunload = function(event) {
//   return confirm("Confirm refresh");
// };

const msgStore = startMessenger();
startMsgSubscriber(msgStore);