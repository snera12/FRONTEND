import { createRouter, createWebHistory } from 'vue-router';
import NodesListMapView from '@/pages/NodesListMapPageView.vue';
import NodesTablePageView from '@/pages/NodesTablePageView.vue';
import AccountListView from '@/pages/AccountListPageView.vue';
import AccountCreate from '@/pages/AccountCreatePageView.vue';
import ConfigurationDHCPPageView from '@/pages/ConfigurationDHCPPageView.vue';
// import SwitchesPageView from '@/pages/SwitchesPageView.vue';

const routes = [
  { 
    path: '/products/nodes-map',
    name: 'index',
    component: NodesListMapView,
    // children:  [
    //   {
    //     path:      'products',
    //     name:      'nodes',
    //     component: NodesListMapView,
    //     children:  [
    //       {
    //         path:      'nodes-map',
    //         name:      'NodesListMap',
    //         component: NodesListMapView
    //       }
    //     ]
    //   },
    // ],
  },
  { 
    path: '/products/nodes-table',
    name: 'nodes-table',
    component: NodesTablePageView,
  },
  {
    path: '/accounts/list',
    name: 'usersList',
    component: AccountListView,
    // children:  [
    //   {
    //     path:      'list',
    //     name:      'accounts',
    //     component: AccountListView,
  },
  {
    path: '/accounts/create',
    name: 'addUser',
    component: AccountCreate,
  },
  {
    path: '/network/dhcp',
    name: 'dhcp',
    component: ConfigurationDHCPPageView,
  },
  // {
  //   path: '/data/switch',
  //   name: 'data-switch',
  //   component: SwitchesPageView,
  // },  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;