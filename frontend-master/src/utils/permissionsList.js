export const emptyPermission = {
  codeName: 'smth',
  id: 0,
  rawName: 'smth',
  ruName: 'Неизвестное разрешение',
  contentId: 0,
  appLabel: 'zero',
  model: 'zero',
  URLs: []
};

export const permissions = [
  {
    codeName: 'view_accessview',
    id: 160,
    rawName: 'Can view access view',
    ruName: 'Может просматривать вид доступа',
    contentId: 37,
    appLabel: 'accounts',
    model: 'accessview',
    URLs: []
  },
  {
    codeName: 'change_accessview',
    id: 158,
    rawName: 'Can change access view',
    ruName: 'Может изменить вид доступа',
    contentId: 37,
    appLabel: 'accounts',
    model: 'accessview',
    URLs: []
  },
  {
    codeName: 'add_accessview',
    id: 157,
    rawName: 'Can add access view',
    ruName: 'Может добавить вид доступа',
    contentId: 37,
    appLabel: 'accounts',
    model: 'accessview',
    URLs: []
  },
  {
    codeName: 'delete_accessview',
    id: 159,
    rawName: 'Can delete access view',
    ruName: 'Может удалить вид доступа',
    contentId: 37,
    appLabel: 'accounts',
    model: 'accessview',
    URLs: []
  },
  {
    codeName: 'view_accessviewright',
    id: 156,
    rawName: 'Can view access view right',
    ruName: 'Может просматривать права доступа к просмотру',
    contentId: 36,
    appLabel: 'accounts',
    model: 'accessviewright',
    URLs: []
  },
  {
    codeName: 'delete_accessviewright',
    id: 155,
    rawName: 'Can delete access view right',
    ruName: 'Может удалить право просмотра доступа',
    contentId: 36,
    appLabel: 'accounts',
    model: 'accessviewright',
    URLs: []
  },
  {
    codeName: 'change_accessviewright',
    id: 154,
    rawName: 'Can change access view right',
    ruName: 'Может изменить права доступа',
    contentId: 36,
    appLabel: 'accounts',
    model: 'accessviewright',
    URLs: []
  },
  {
    codeName: 'add_accessviewright',
    id: 153,
    rawName: 'Can add access view right',
    ruName: 'Может добавить право просмотра доступа',
    contentId: 36,
    appLabel: 'accounts',
    model: 'accessviewright',
    URLs: []
  },
  {
    codeName: 'delete_user',
    id: 3,
    rawName: 'Может удалить пользователя',
    ruName: 'Может удалить пользователя',
    contentId: 1,
    appLabel: 'accounts',
    model: 'customuser',
    URLs: [] // ADD: endpoint
  },
  {
    codeName: 'view_customuser',
    id: 140,
    rawName: 'Can view user',
    ruName: 'Может просматривать пользователя',
    contentId: 1,
    appLabel: 'accounts',
    model: 'customuser',
    URLs: [] // ADD: viewpoint modal
  },
  {
    codeName: 'list_user',
    id: 1,
    rawName: 'Видит список пользователей',
    ruName: 'Может смотреть список пользователей',
    contentId: 1,
    appLabel: 'accounts',
    model: 'customuser',
    URLs: ['accounts/list/']
  },
  {
    codeName: 'create_user',
    id: 2,
    rawName: 'Может создать пользователя',
    ruName: 'Может добавить пользователя',
    contentId: 1,
    appLabel: 'accounts',
    model: 'customuser',
    URLs: [ // ADD: viewpoint modal, endpoint;
      'accounts/register_application_list/',
      'accounts/create/',
      'accounts/activitylist/', // replace url
      'accounts/problems/', // replace url
    ]
  },
  {
    codeName: 'change_customuser',
    id: 138,
    rawName: 'Can change user',
    ruName: 'Может изменить данные пользователя',
    contentId: 1,
    appLabel: 'accounts',
    model: 'customuser',
    URLs: [] // ADD: viewpoint modal,
  },
  {
    codeName: 'add_customuser',
    id: 137,
    rawName: 'Can add user',
    ruName: 'Может добавить пользователя',
    contentId: 1,
    appLabel: 'accounts',
    model: 'customuser',
    URLs: []
  },
  {
    codeName: 'delete_customuser',
    id: 139,
    rawName: 'Can delete user',
    ruName: 'Может удалить пользователя',
    contentId: 1,
    appLabel: 'accounts',
    model: 'customuser',
    URLs: [] // // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_historicalaccessviewright',
    id: 152,
    rawName: 'Can view historical access view right',
    ruName: 'Может просматривать исторические права доступа к просмотру',
    contentId: 35,
    appLabel: 'accounts',
    model: 'historicalaccessviewright',
    URLs: []
  },
  {
    codeName: 'add_historicalaccessviewright',
    id: 149,
    rawName: 'Can add historical access view right',
    ruName: 'Может добавить исторические права доступа к просмотру',
    contentId: 35,
    appLabel: 'accounts',
    model: 'historicalaccessviewright',
    URLs: []
  },
  {
    codeName: 'change_historicalaccessviewright',
    id: 150,
    rawName: 'Can change historical access view right',
    ruName: 'Может изменить исторические права доступа',
    contentId: 35,
    appLabel: 'accounts',
    model: 'historicalaccessviewright',
    URLs: []
  },
  {
    codeName: 'delete_historicalaccessviewright',
    id: 151,
    rawName: 'Can delete historical access view right',
    ruName: 'Может удалить историческое право просмотра доступа',
    contentId: 35,
    appLabel: 'accounts',
    model: 'historicalaccessviewright',
    URLs: []
  },
  {
    codeName: 'change_historicalcustomuser',
    id: 146,
    rawName: 'Can change historical user',
    ruName: 'Может изменить исторического пользователя',
    contentId: 34,
    appLabel: 'accounts',
    model: 'historicalcustomuser',
    URLs: []
  },
  {
    codeName: 'add_historicalcustomuser',
    id: 145,
    rawName: 'Can add historical user',
    ruName: 'Может добавить исторического пользователя',
    contentId: 34,
    appLabel: 'accounts',
    model: 'historicalcustomuser',
    URLs: []
  },
  {
    codeName: 'view_historicalcustomuser',
    id: 148,
    rawName: 'Can view historical user',
    ruName: 'Может просматривать историю пользователя',
    contentId: 34,
    appLabel: 'accounts',
    model: 'historicalcustomuser',
    URLs: []
  },
  {
    codeName: 'delete_historicalcustomuser',
    id: 147,
    rawName: 'Can delete historical user',
    ruName: 'Может удалить исторического пользователь',
    contentId: 34,
    appLabel: 'accounts',
    model: 'historicalcustomuser',
    URLs: []
  },
  {
    codeName: 'change_registrationapplication',
    id: 142,
    rawName: 'Can change Registration application',
    ruName: 'Может изменить заявку на регистрацию',
    contentId: 33,
    appLabel: 'accounts',
    model: 'registrationapplication',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'add_registrationapplication',
    id: 141,
    rawName: 'Can add Registration application',
    ruName: 'Может добавить заявку на регистрацию',
    contentId: 33,
    appLabel: 'accounts',
    model: 'registrationapplication',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_registrationapplication',
    id: 144,
    rawName: 'Can view Registration application',
    ruName: 'Может просматривать заявки на регистрацию',
    contentId: 33,
    appLabel: 'accounts',
    model: 'registrationapplication',
    URLs: ['register_application_list/'] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_registrationapplication',
    id: 143,
    rawName: 'Can delete Registration application',
    ruName: 'Может удалить заявку на регистрацию',
    contentId: 33,
    appLabel: 'accounts',
    model: 'registrationapplication',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_activitylog',
    id: 50,
    rawName: 'Can view activity log',
    ruName: 'Может просматривать журнал действий',
    contentId: 12,
    appLabel: 'activity_log',
    model: 'activitylog',
    URLs: ['accounts/activitylist/']
  },
  {
    codeName: 'add_activitylog',
    id: 47,
    rawName: 'Can add activity log',
    ruName: 'Может добавить журнал активности',
    contentId: 12,
    appLabel: 'activity_log',
    model: 'activitylog',
    URLs: []
  },
  {
    codeName: 'change_activitylog',
    id: 48,
    rawName: 'Can change activity log',
    ruName: 'Может изменить журнал действий',
    contentId: 12,
    appLabel: 'activity_log',
    model: 'activitylog',
    URLs: []
  },
  {
    codeName: 'delete_activitylog',
    id: 49,
    rawName: 'Can delete activity log',
    ruName: 'Может удалить журнал действий',
    contentId: 12,
    appLabel: 'activity_log',
    model: 'activitylog',
    URLs: []
  },
  {
    codeName: 'add_logentry',
    id: 19,
    rawName: 'Can add log entry',
    ruName: 'Может добавить запись в журнал',
    contentId: 5,
    appLabel: 'admin',
    model: 'logentry',
    URLs: []
  },
  {
    codeName: 'change_logentry',
    id: 20,
    rawName: 'Can change log entry',
    ruName: 'Может изменить запись в журнале',
    contentId: 5,
    appLabel: 'admin',
    model: 'logentry',
    URLs: []
  },
  {
    codeName: 'delete_logentry',
    id: 21,
    rawName: 'Can delete log entry',
    ruName: 'Может удалить запись в журнале',
    contentId: 5,
    appLabel: 'admin',
    model: 'logentry',
    URLs: []
  },
  {
    codeName: 'view_logentry',
    id: 22,
    rawName: 'Can view log entry',
    ruName: 'Может просматривать запись журнала',
    contentId: 5,
    appLabel: 'admin',
    model: 'logentry',
    URLs: []
  },
  {
    codeName: 'change_group',
    id: 28,
    rawName: 'Can change group',
    ruName: 'Может сменить группу',
    contentId: 7,
    appLabel: 'auth',
    model: 'group',
    URLs: []
  },
  {
    codeName: 'view_group',
    id: 30,
    rawName: 'Can view group',
    ruName: 'Может просматривать группу',
    contentId: 7,
    appLabel: 'auth',
    model: 'group',
    URLs: []
  },
  {
    codeName: 'add_group',
    id: 27,
    rawName: 'Can add group',
    ruName: 'Может добавить группу',
    contentId: 7,
    appLabel: 'auth',
    model: 'group',
    URLs: []
  },
  {
    codeName: 'delete_group',
    id: 29,
    rawName: 'Can delete group',
    ruName: 'Может удалить группу',
    contentId: 7,
    appLabel: 'auth',
    model: 'group',
    URLs: []
  },
  {
    codeName: 'change_permission',
    id: 24,
    rawName: 'Can change permission',
    ruName: 'Может изменить разрешение',
    contentId: 6,
    appLabel: 'auth',
    model: 'permission',
    URLs: []
  },
  {
    codeName: 'view_permission',
    id: 26,
    rawName: 'Can view permission',
    ruName: 'Может просматривать разрешение',
    contentId: 6,
    appLabel: 'auth',
    model: 'permission',
    URLs: []
  },
  {
    codeName: 'delete_permission',
    id: 25,
    rawName: 'Can delete permission',
    ruName: 'Может удалить разрешение',
    contentId: 6,
    appLabel: 'auth',
    model: 'permission',
    URLs: []
  },
  {
    codeName: 'add_permission',
    id: 23,
    rawName: 'Can add permission',
    ruName: 'Может добавить разрешение',
    contentId: 6,
    appLabel: 'auth',
    model: 'permission',
    URLs: []
  },
  {
    codeName: 'view_accessattempt',
    id: 54,
    rawName: 'Can view access attempt',
    ruName: 'Может просматривать попытки доступа',
    contentId: 13,
    appLabel: 'axes',
    model: 'accessattempt',
    URLs: []
  },
  {
    codeName: 'add_accessattempt',
    id: 51,
    rawName: 'Can add access attempt',
    ruName: 'Может добавить попытку доступа',
    contentId: 13,
    appLabel: 'axes',
    model: 'accessattempt',
    URLs: []
  },
  {
    codeName: 'delete_accessattempt',
    id: 53,
    rawName: 'Can delete access attempt',
    ruName: 'Может удалить попытку доступа',
    contentId: 13,
    appLabel: 'axes',
    model: 'accessattempt',
    URLs: []
  },
  {
    codeName: 'change_accessattempt',
    id: 52,
    rawName: 'Can change access attempt',
    ruName: 'Может изменить попытку доступа',
    contentId: 13,
    appLabel: 'axes',
    model: 'accessattempt',
    URLs: []
  },
  {
    codeName: 'view_accesslog',
    id: 58,
    rawName: 'Can view access log',
    ruName: 'Может просматривать журнал доступа',
    contentId: 14,
    appLabel: 'axes',
    model: 'accesslog',
    URLs: []
  },
  {
    codeName: 'delete_accesslog',
    id: 57,
    rawName: 'Can delete access log',
    ruName: 'Может удалить запись журнала доступа',
    contentId: 14,
    appLabel: 'axes',
    model: 'accesslog',
    URLs: []
  },
  {
    codeName: 'add_accesslog',
    id: 55,
    rawName: 'Can add access log',
    ruName: 'Может добавить журнал доступа',
    contentId: 14,
    appLabel: 'axes',
    model: 'accesslog',
    URLs: []
  },
  {
    codeName: 'change_accesslog',
    id: 56,
    rawName: 'Can change access log',
    ruName: 'Может изменить журнал доступа',
    contentId: 14,
    appLabel: 'axes',
    model: 'accesslog',
    URLs: []
  },
  {
    codeName: 'change_captchastore',
    id: 162,
    rawName: 'Can change captcha store',
    ruName: 'Может изменить хранилище капчи',
    contentId: 38,
    appLabel: 'captcha',
    model: 'captchastore',
    URLs: []
  },
  {
    codeName: 'view_captchastore',
    id: 164,
    rawName: 'Can view captcha store',
    ruName: 'Может просматривать хранилище капч',
    contentId: 38,
    appLabel: 'captcha',
    model: 'captchastore',
    URLs: []
  },
  {
    codeName: 'delete_captchastore',
    id: 163,
    rawName: 'Can delete captcha store',
    ruName: 'Может удалить хранилище капчи',
    contentId: 38,
    appLabel: 'captcha',
    model: 'captchastore',
    URLs: []
  },
  {
    codeName: 'add_captchastore',
    id: 161,
    rawName: 'Can add captcha store',
    ruName: 'Может добавить хранилище капчи',
    contentId: 38,
    appLabel: 'captcha',
    model: 'captchastore',
    URLs: []
  },
  {
    codeName: 'change_contenttype',
    id: 32,
    rawName: 'Can change content type',
    ruName: 'Может изменить тип контента',
    contentId: 8,
    appLabel: 'contenttypes',
    model: 'contenttype',
    URLs: []
  },
  {
    codeName: 'delete_contenttype',
    id: 33,
    rawName: 'Can delete content type',
    ruName: 'Может удалить тип контента',
    contentId: 8,
    appLabel: 'contenttypes',
    model: 'contenttype',
    URLs: []
  },
  {
    codeName: 'view_contenttype',
    id: 34,
    rawName: 'Can view content type',
    ruName: 'Может просматривать тип контента',
    contentId: 8,
    appLabel: 'contenttypes',
    model: 'contenttype',
    URLs: []
  },
  {
    codeName: 'add_contenttype',
    id: 31,
    rawName: 'Can add content type',
    ruName: 'Может добавить тип контента',
    contentId: 8,
    appLabel: 'contenttypes',
    model: 'contenttype',
    URLs: []
  },
  {
    codeName: 'view_globalsettings',
    id: 42,
    rawName: 'Can view global settings',
    ruName: 'Может просматривать глобальные настройки',
    contentId: 10,
    appLabel: 'core',
    model: 'globalsettings',
    URLs: ['core/settings'] // ???
  },
  {
    codeName: 'add_globalsettings',
    id: 39,
    rawName: 'Can add global settings',
    ruName: 'Может добавить глобальные настройки',
    contentId: 10,
    appLabel: 'core',
    model: 'globalsettings',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'change_globalsettings',
    id: 40,
    rawName: 'Can change global settings',
    ruName: 'Может изменить глобальные настройки',
    contentId: 10,
    appLabel: 'core',
    model: 'globalsettings',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_globalsettings',
    id: 41,
    rawName: 'Can delete global settings',
    ruName: 'Может удалять глобальные настройки',
    contentId: 10,
    appLabel: 'core',
    model: 'globalsettings',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'add_historicalglobalsettings',
    id: 43,
    rawName: 'Can add historical global settings',
    ruName: 'Может добавить историю глобальных настроек',
    contentId: 11,
    appLabel: 'core',
    model: 'historicalglobalsettings',
    URLs: []
  },
  {
    codeName: 'view_historicalglobalsettings',
    id: 46,
    rawName: 'Can view historical global settings',
    ruName: 'Может просматривать исторические глобальные настройки',
    contentId: 11,
    appLabel: 'core',
    model: 'historicalglobalsettings',
    URLs: []
  },
  {
    codeName: 'change_historicalglobalsettings',
    id: 44,
    rawName: 'Can change historical global settings',
    ruName: 'Может изменить исторические глобальные настройки',
    contentId: 11,
    appLabel: 'core',
    model: 'historicalglobalsettings',
    URLs: []
  },
  {
    codeName: 'delete_historicalglobalsettings',
    id: 45,
    rawName: 'Can delete historical global settings',
    ruName: 'Может удалить исторические глобальные настройки',
    contentId: 11,
    appLabel: 'core',
    model: 'historicalglobalsettings',
    URLs: []
  },
  {
    codeName: 'start_stop_switch',
    id: 18,
    rawName: 'Может запустить/остановить свитч',
    ruName: 'Может запустить/остановить коммутатор',
    contentId: 4,
    appLabel: 'data',
    model: 'Switch',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_historicalswitch',
    id: 103,
    rawName: 'Can delete historical switch',
    ruName: 'Может удалить исторический переключатель',
    contentId: 24,
    appLabel: 'data',
    model: 'historicalswitch',
    URLs: []
  },
  {
    codeName: 'change_historicalswitch',
    id: 102,
    rawName: 'Can change historical switch',
    ruName: 'Может изменить исторический переключатель',
    contentId: 24,
    appLabel: 'data',
    model: 'historicalswitch',
    URLs: []
  },
  {
    codeName: 'add_historicalswitch',
    id: 101,
    rawName: 'Can add historical switch',
    ruName: 'Может добавить исторический переключатель',
    contentId: 24,
    appLabel: 'data',
    model: 'historicalswitch',
    URLs: []
  },
  {
    codeName: 'view_historicalswitch',
    id: 104,
    rawName: 'Can view historical switch',
    ruName: 'Может просматривать историю коммутатора',
    contentId: 24,
    appLabel: 'data',
    model: 'historicalswitch',
    URLs: []
  },
  {
    codeName: 'delete_historicalswitchconnection',
    id: 99,
    rawName: 'Can delete historical switch connection',
    ruName: 'Может удалить историю подключения коммутатора',
    contentId: 23,
    appLabel: 'data',
    model: 'historicalswitchconnection',
    URLs: []
  },
  {
    codeName: 'add_historicalswitchconnection',
    id: 97,
    rawName: 'Can add historical switch connection',
    ruName: 'Может добавить историю подключения коммутатора',
    contentId: 23,
    appLabel: 'data',
    model: 'historicalswitchconnection',
    URLs: []
  },
  {
    codeName: 'view_historicalswitchconnection',
    id: 100,
    rawName: 'Can view historical switch connection',
    ruName: 'Может просматривать историю подключений коммутатора',
    contentId: 23,
    appLabel: 'data',
    model: 'historicalswitchconnection',
    URLs: []
  },
  {
    codeName: 'change_historicalswitchconnection',
    id: 98,
    rawName: 'Can change historical switch connection',
    ruName: 'Может изменить историческое подключение коммутатора',
    contentId: 23,
    appLabel: 'data',
    model: 'historicalswitchconnection',
    URLs: []
  },
  {
    codeName: 'view_switch',
    id: 92,
    rawName: 'Can view switch',
    ruName: 'Может просматривать переключатель',
    contentId: 21,
    appLabel: 'data',
    model: 'switch',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'add_switch',
    id: 89,
    rawName: 'Can add switch',
    ruName: 'Может добавить переключатель',
    contentId: 21,
    appLabel: 'data',
    model: 'switch',
    URLs: ['data/switch_create/'] // deprecated ?
  },
  {
    codeName: 'delete_switch',
    id: 91,
    rawName: 'Can delete switch',
    ruName: 'Может удалить коммутатор',
    contentId: 21,
    appLabel: 'data',
    model: 'switch',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'change_switch',
    id: 90,
    rawName: 'Can change switch',
    ruName: 'Может изменять коммутаторы',
    contentId: 21,
    appLabel: 'data',
    model: 'switch',
    URLs: [] // deprecated ?
  },
  {
    codeName: 'change_switchconnection',
    id: 94,
    rawName: 'Can change switch connection',
    ruName: 'Может изменить подключение коммутатора',
    contentId: 22,
    appLabel: 'data',
    model: 'switchconnection',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_switchconnection',
    id: 95,
    rawName: 'Can delete switch connection',
    ruName: 'Может удалить соединение коммутатора',
    contentId: 22,
    appLabel: 'data',
    model: 'switchconnection',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'add_switchconnection',
    id: 93,
    rawName: 'Can add switch connection',
    ruName: 'Может добавить подключение коммутатора',
    contentId: 22,
    appLabel: 'data',
    model: 'switchconnection',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_switchconnection',
    id: 96,
    rawName: 'Can view switch connection',
    ruName: 'Может просматривать подключения коммутатора',
    contentId: 22,
    appLabel: 'data',
    model: 'switchconnection',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_switchcustomerconnection',
    id: 107,
    rawName: 'Can delete switch customer connection',
    ruName: 'Может удалить подключения клиента на коммутаторе',
    contentId: 25,
    appLabel: 'data',
    model: 'switchcustomerconnection',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'change_switchcustomerconnection',
    id: 106,
    rawName: 'Can change switch customer connection',
    ruName: 'Может изменить подключение клиента к коммутатору',
    contentId: 25,
    appLabel: 'data',
    model: 'switchcustomerconnection',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_switchcustomerconnection',
    id: 108,
    rawName: 'Can view switch customer connection',
    ruName: 'Может просматривать клиентские подключения коммутаторов',
    contentId: 25,
    appLabel: 'data',
    model: 'switchcustomerconnection',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'add_switchcustomerconnection',
    id: 105,
    rawName: 'Can add switch customer connection',
    ruName: 'Может добавить клиентское подключение на коммутаторе',
    contentId: 25,
    appLabel: 'data',
    model: 'switchcustomerconnection',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'change_switchport',
    id: 110,
    rawName: 'Can change switch port',
    ruName: 'Может изменить порт коммутатора',
    contentId: 26,
    appLabel: 'data',
    model: 'switchport',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_switchport',
    id: 112,
    rawName: 'Can view switch port',
    ruName: 'Может просматривать порт коммутатора',
    contentId: 26,
    appLabel: 'data',
    model: 'switchport',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_switchport',
    id: 111,
    rawName: 'Can delete switch port',
    ruName: 'Может удалить порт коммутатора',
    contentId: 26,
    appLabel: 'data',
    model: 'switchport',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'add_switchport',
    id: 109,
    rawName: 'Can add switch port',
    ruName: 'Может добавить порт коммутатора',
    contentId: 26,
    appLabel: 'data',
    model: 'switchport',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_gw',
    id: 76,
    rawName: 'Can view gw',
    ruName: 'Может просматривать узел',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'log_view',
    id: 17,
    rawName: 'Видит логи сессии',
    ruName: 'Может просматривать логи сессий передачи данных',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: [] // TODO: ['gws/historysession/'] 
  },
  {
    codeName: 'change_gw',
    id: 74,
    rawName: 'Can change gw',
    ruName: 'Может изменить узел',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_gw',
    id: 75,
    rawName: 'Can delete gw',
    ruName: 'Может удалить узел',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'add_gw',
    id: 73,
    rawName: 'Can add gw',
    ruName: 'Может добавить узел',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_session_gw',
    id: 13,
    rawName: 'Видит сессию',
    ruName: 'Может смотреть сеансы передачи данных',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: ['services/listdataservice/'] 
  },
  {
    codeName: 'list_gw',
    id: 11,
    rawName: 'Видит список ОУ',
    ruName: 'Может просматривать список ОУ',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: [] 
  },
  {
    codeName: 'create_session_gw',
    id: 12,
    rawName: 'Может создать сессию',
    ruName: 'Может создать сеанс передачи данных',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: ['services/createdataservice/', 'gws/historysession/'] 
  },
  {
    codeName: 'select_user_session_gw',
    id: 16,
    rawName: 'Выбирает пользователя для сессии',
    ruName: 'Может выбрать клиента для сеанса связи',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_session_gw',
    id: 14,
    rawName: 'Может удалить сессию',
    ruName: 'Может удалить сеанс передачи данных',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'run_session_gw',
    id: 15,
    rawName: 'Может запустить сессию',
    ruName: 'Может запустить сеанс передачи данных',
    contentId: 3,
    appLabel: 'gws',
    model: 'gw',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_historicalgw',
    id: 88,
    rawName: 'Can view historical gw',
    ruName: 'Может просматривать историю узла',
    contentId: 20,
    appLabel: 'gws',
    model: 'historicalgw',
    URLs: [] 
  },
  {
    codeName: 'delete_historicalgw',
    id: 87,
    rawName: 'Can delete historical gw',
    ruName: 'Может удалить историю узла',
    contentId: 20,
    appLabel: 'gws',
    model: 'historicalgw',
    URLs: []
  },
  {
    codeName: 'add_historicalgw',
    id: 85,
    rawName: 'Can add historical gw',
    ruName: 'Может добавить историю узла',
    contentId: 20,
    appLabel: 'gws',
    model: 'historicalgw',
    URLs: []
  },
  {
    codeName: 'change_historicalgw',
    id: 86,
    rawName: 'Can change historical gw',
    ruName: 'Может изменить историю узла',
    contentId: 20,
    appLabel: 'gws',
    model: 'historicalgw',
    URLs: []
  },
  {
    codeName: 'view_historicalsession',
    id: 84,
    rawName: 'Can view historical session',
    ruName: 'Может просматривать историю сеанса узла',
    contentId: 19,
    appLabel: 'gws',
    model: 'historicalsession',
    URLs: []
  },
  {
    codeName: 'change_historicalsession',
    id: 82,
    rawName: 'Can change historical session',
    ruName: 'Может изменить историю сеанса узла',
    contentId: 19,
    appLabel: 'gws',
    model: 'historicalsession',
    URLs: []
  },
  {
    codeName: 'add_historicalsession',
    id: 81,
    rawName: 'Can add historical session',
    ruName: 'Может добавить историю сессии узла',
    contentId: 19,
    appLabel: 'gws',
    model: 'historicalsession',
    URLs: []
  },
  {
    codeName: 'delete_historicalsession',
    id: 83,
    rawName: 'Can delete historical session',
    ruName: 'Может удалить историю сеанса узла',
    contentId: 19,
    appLabel: 'gws',
    model: 'historicalsession',
    URLs: []
  },
  {
    codeName: 'delete_session',
    id: 79,
    rawName: 'Can delete session',
    ruName: 'Может удалить сеанс узла',
    contentId: 18,
    appLabel: 'gws',
    model: 'session',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'add_session',
    id: 77,
    rawName: 'Can add session',
    ruName: 'Может добавить сеанс связи (с узла)',
    contentId: 18,
    appLabel: 'gws',
    model: 'session',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'view_session',
    id: 80,
    rawName: 'Can view session',
    ruName: 'Может просматривать сеанс узла',
    contentId: 18,
    appLabel: 'gws',
    model: 'session',
    URLs: [] // ADD: viewpoint modal, endpoint 'services/dataservice/pk'
  },
  {
    codeName: 'change_session',
    id: 78,
    rawName: 'Can change session',
    ruName: 'Может изменить сеанс узла',
    contentId: 18,
    appLabel: 'gws',
    model: 'session',
    URLs: [] // unused??
  },
  {
    codeName: 'delete_proxygrantingticket',
    id: 167,
    rawName: 'Can delete proxy-granting ticket',
    ruName: 'Может удалить билет на предоставление прокси',
    contentId: 39,
    appLabel: 'mama_cas',
    model: 'proxygrantingticket',
    URLs: []
  },
  {
    codeName: 'view_proxygrantingticket',
    id: 168,
    rawName: 'Can view proxy-granting ticket',
    ruName: 'Может просматривать билет на предоставление прокси',
    contentId: 39,
    appLabel: 'mama_cas',
    model: 'proxygrantingticket',
    URLs: []
  },
  {
    codeName: 'change_proxygrantingticket',
    id: 166,
    rawName: 'Can change proxy-granting ticket',
    ruName: 'Может изменить билет на предоставление прокси',
    contentId: 39,
    appLabel: 'mama_cas',
    model: 'proxygrantingticket',
    URLs: []
  },
  {
    codeName: 'add_proxygrantingticket',
    id: 165,
    rawName: 'Can add proxy-granting ticket',
    ruName: 'Может добавить билет на предоставление прокси',
    contentId: 39,
    appLabel: 'mama_cas',
    model: 'proxygrantingticket',
    URLs: []
  },
  {
    codeName: 'view_proxyticket',
    id: 172,
    rawName: 'Can view proxy ticket',
    ruName: 'Может просматривать прокси-билет',
    contentId: 40,
    appLabel: 'mama_cas',
    model: 'proxyticket',
    URLs: []
  },
  {
    codeName: 'add_proxyticket',
    id: 169,
    rawName: 'Can add proxy ticket',
    ruName: 'Может добавить прокси-билет',
    contentId: 40,
    appLabel: 'mama_cas',
    model: 'proxyticket',
    URLs: []
  },
  {
    codeName: 'delete_proxyticket',
    id: 171,
    rawName: 'Can delete proxy ticket',
    ruName: 'Может удалить прокси-билет',
    contentId: 40,
    appLabel: 'mama_cas',
    model: 'proxyticket',
    URLs: []
  },
  {
    codeName: 'change_proxyticket',
    id: 170,
    rawName: 'Can change proxy ticket',
    ruName: 'Может изменить прокси-билет',
    contentId: 40,
    appLabel: 'mama_cas',
    model: 'proxyticket',
    URLs: []
  },
  {
    codeName: 'change_serviceticket',
    id: 174,
    rawName: 'Can change service ticket',
    ruName: 'Может изменить сервисный билет',
    contentId: 41,
    appLabel: 'mama_cas',
    model: 'serviceticket',
    URLs: []
  },
  {
    codeName: 'add_serviceticket',
    id: 173,
    rawName: 'Can add service ticket',
    ruName: 'Может добавить сервисный билет',
    contentId: 41,
    appLabel: 'mama_cas',
    model: 'serviceticket',
    URLs: []
  },
  {
    codeName: 'delete_serviceticket',
    id: 175,
    rawName: 'Can delete service ticket',
    ruName: 'Может удалить сервисный билет',
    contentId: 41,
    appLabel: 'mama_cas',
    model: 'serviceticket',
    URLs: []
  },
  {
    codeName: 'view_serviceticket',
    id: 176,
    rawName: 'Can view service ticket',
    ruName: 'Может просматривать сервисный билет',
    contentId: 41,
    appLabel: 'mama_cas',
    model: 'serviceticket',
    URLs: []
  },
  {
    codeName: 'add_historicalproduct',
    id: 65,
    rawName: 'Can add historical product',
    ruName: 'Может добавить историю продукта',
    contentId: 16,
    appLabel: 'products',
    model: 'historicalproduct',
    URLs: []
  },
  {
    codeName: 'delete_historicalproduct',
    id: 67,
    rawName: 'Can delete historical product',
    ruName: 'Может удалить историю продукта',
    contentId: 16,
    appLabel: 'products',
    model: 'historicalproduct',
    URLs: []
  },
  {
    codeName: 'view_historicalproduct',
    id: 68,
    rawName: 'Can view historical product',
    ruName: 'Может просматривать историю продукта',
    contentId: 16,
    appLabel: 'products',
    model: 'historicalproduct',
    URLs: []
  },
  {
    codeName: 'change_historicalproduct',
    id: 66,
    rawName: 'Can change historical product',
    ruName: 'Может изменить историю продукта',
    contentId: 16,
    appLabel: 'products',
    model: 'historicalproduct',
    URLs: []
  },
  {
    codeName: 'view_logs',
    id: 64,
    rawName: 'Can view logs',
    ruName: 'Может просматривать логи',
    contentId: 15,
    appLabel: 'products',
    model: 'logs',
    URLs: [] // unused ??
  },
  {
    codeName: 'change_logs',
    id: 62,
    rawName: 'Can change logs',
    ruName: 'Может менять логи',
    contentId: 15,
    appLabel: 'products',
    model: 'logs',
    URLs: []
  },
  {
    codeName: 'delete_logs',
    id: 63,
    rawName: 'Can delete logs',
    ruName: 'Может удалять логи',
    contentId: 15,
    appLabel: 'products',
    model: 'logs',
    URLs: []
  },
  {
    codeName: 'add_logs',
    id: 61,
    rawName: 'Can add logs',
    ruName: 'Может добавлять логи',
    contentId: 15,
    appLabel: 'products',
    model: 'logs',
    URLs: []
  },
  {
    codeName: 'add_product',
    id: 5,
    rawName: 'Может создать ЛСУ',
    ruName: 'Может создать ЛСУ',
    contentId: 2,
    appLabel: 'products',
    model: 'product',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'list_product',
    id: 4,
    rawName: 'Видит список ЛСУ',
    ruName: 'Может просматривать список ЛСУ',
    contentId: 2,
    appLabel: 'products',
    model: 'product',
    URLs: ['products/', 'products/nodes-table/']
  },
  {
    codeName: 'change_product',
    id: 6,
    rawName: 'Может изменить ЛСУ',
    ruName: 'Может изменить ЛСУ',
    contentId: 2,
    appLabel: 'products',
    model: 'product',
    URLs: []
  },
  {
    codeName: 'view_product',
    id: 59,
    rawName: 'Can view product',
    ruName: 'Может просматривать узел',
    contentId: 2,
    appLabel: 'products',
    model: 'product',
    URLs: []
  },
  {
    codeName: 'stop_product',
    id: 8,
    rawName: 'Может остановить ЛСУ',
    ruName: 'Может остановить ЛСУ',
    contentId: 2,
    appLabel: 'products',
    model: 'product',
    URLs: [] // all roles
  },
  {
    codeName: 'delete_product',
    id: 7,
    rawName: 'Может удалить ЛСУ',
    ruName: 'Может удалить ЛСУ',
    contentId: 2,
    appLabel: 'products',
    model: 'product',
    URLs: []
  },
  {
    codeName: 'start_product',
    id: 9,
    rawName: 'Может запустить ЛСУ',
    ruName: 'Может запустить ЛСУ',
    contentId: 2,
    appLabel: 'products',
    model: 'product',
    URLs: [] // all roles
  },
  {
    codeName: 'create_product',
    id: 60,
    rawName: 'Can create a PDU',
    ruName: 'Может создать узел',
    contentId: 2,
    appLabel: 'products',
    model: 'product',
    URLs: [] // unused ?
  },
  {
    codeName: 'log_view', // double name, need rename
    id: 10,
    rawName: 'Видит лог ЛСУ',
    ruName: 'Может просматривать лог ЛСУ',
    contentId: 2,
    appLabel: 'products',
    model: 'product',
    URLs: [] //
  },
  {
    codeName: 'delete_requests',
    id: 71,
    rawName: 'Can delete requests',
    ruName: 'Может удалять запросы (устаревшее)',
    contentId: 17,
    appLabel: 'products',
    model: 'requests',
    URLs: [] // deprecated
  },
  {
    codeName: 'view_requests',
    id: 72,
    rawName: 'Can view requests',
    ruName: 'Может просматривать запросы (устаревшее)',
    contentId: 17,
    appLabel: 'products',
    model: 'requests',
    URLs: [] // deprecated
  },
  {
    codeName: 'add_requests',
    id: 69,
    rawName: 'Can add requests',
    ruName: 'Может добавлять запросы (устаревшее)',
    contentId: 17,
    appLabel: 'products',
    model: 'requests',
    URLs: [] // deprecated
  },
  {
    codeName: 'change_requests',
    id: 70,
    rawName: 'Can change requests',
    ruName: 'Может изменять запросы (устаревшее)',
    contentId: 17,
    appLabel: 'products',
    model: 'requests',
    URLs: [] // deprecated
  },
  {
    codeName: 'view_dataservice',
    id: 136,
    rawName: 'Can view data service',
    ruName: 'Может просматривать сервис данных',
    contentId: 32,
    appLabel: 'services',
    model: 'dataservice',
    URLs: ['services/listdataservice/']
  },
  {
    codeName: 'add_dataservice',
    id: 133,
    rawName: 'Can add data service',
    ruName: 'Может создать сеанс передачи данных',
    contentId: 32,
    appLabel: 'services',
    model: 'dataservice',
    URLs: ['services/createdataservice/'] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'change_dataservice',
    id: 134,
    rawName: 'Can change data service',
    ruName: 'Может изменить сеанс передачи данных',
    contentId: 32,
    appLabel: 'services',
    model: 'dataservice',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_dataservice',
    id: 135,
    rawName: 'Can delete data service',
    ruName: 'Может удалить сеанс передачи данных',
    contentId: 32,
    appLabel: 'services',
    model: 'dataservice',
    URLs: [] // ADD: viewpoint modal, endpoint
  },
  {
    codeName: 'delete_historicaldataservice',
    id: 131,
    rawName: 'Can delete historical data service',
    ruName: 'Может удалить сервис исторических данных',
    contentId: 31,
    appLabel: 'services',
    model: 'historicaldataservice',
    URLs: []
  },
  {
    codeName: 'view_historicaldataservice',
    id: 132,
    rawName: 'Can view historical data service',
    ruName: 'Может просматривать сервис исторических данных',
    contentId: 31,
    appLabel: 'services',
    model: 'historicaldataservice',
    URLs: []
  },
  {
    codeName: 'add_historicaldataservice',
    id: 129,
    rawName: 'Can add historical data service',
    ruName: 'Может добавить сервис исторических данных',
    contentId: 31,
    appLabel: 'services',
    model: 'historicaldataservice',
    URLs: []
  },
  {
    codeName: 'change_historicaldataservice',
    id: 130,
    rawName: 'Can change historical data service',
    ruName: 'Может изменить сервис исторических данных',
    contentId: 31,
    appLabel: 'services',
    model: 'historicaldataservice',
    URLs: []
  },
  {
    codeName: 'change_historicalkeyservice',
    id: 126,
    rawName: 'Can change historical key service',
    ruName: 'Может изменить исторический сервис ключей',
    contentId: 30,
    appLabel: 'services',
    model: 'historicalkeyservice',
    URLs: []
  },
  {
    codeName: 'add_historicalkeyservice',
    id: 125,
    rawName: 'Can add historical key service',
    ruName: 'Может добавить исторический сервис ключей',
    contentId: 30,
    appLabel: 'services',
    model: 'historicalkeyservice',
    URLs: []
  },
  {
    codeName: 'view_historicalkeyservice',
    id: 128,
    rawName: 'Can view historical key service',
    ruName: 'Может просматривать историческую службу ключей',
    contentId: 30,
    appLabel: 'services',
    model: 'historicalkeyservice',
    URLs: []
  },
  {
    codeName: 'delete_historicalkeyservice',
    id: 127,
    rawName: 'Can delete historical key service',
    ruName: 'Может удалить исторический сервис ключей',
    contentId: 30,
    appLabel: 'services',
    model: 'historicalkeyservice',
    URLs: []
  },
  {
    codeName: 'view_historicalservicesession',
    id: 124,
    rawName: 'Can view historical service session',
    ruName: 'Может просматривать исторический сеанс обслуживания',
    contentId: 29,
    appLabel: 'services',
    model: 'historicalservicesession',
    URLs: []
  },
  {
    codeName: 'delete_historicalservicesession',
    id: 123,
    rawName: 'Can delete historical service session',
    ruName: 'Может удалить историческую служебную сессию',
    contentId: 29,
    appLabel: 'services',
    model: 'historicalservicesession',
    URLs: []
  },
  {
    codeName: 'change_historicalservicesession',
    id: 122,
    rawName: 'Can change historical service session',
    ruName: 'Может изменить историческую сессию службы',
    contentId: 29,
    appLabel: 'services',
    model: 'historicalservicesession',
    URLs: []
  },
  {
    codeName: 'add_historicalservicesession',
    id: 121,
    rawName: 'Can add historical service session',
    ruName: 'Может добавить историческую сессию службы',
    contentId: 29,
    appLabel: 'services',
    model: 'historicalservicesession',
    URLs: []
  },
  {
    codeName: 'delete_keyservice',
    id: 119,
    rawName: 'Can delete key service',
    ruName: 'Может удалить службу ключей',
    contentId: 28,
    appLabel: 'services',
    model: 'keyservice', // ???
    URLs: []
  },
  {
    codeName: 'add_keyservice',
    id: 117,
    rawName: 'Can add key service',
    ruName: 'Может добавить службу ключей',
    contentId: 28,
    appLabel: 'services',
    model: 'keyservice',
    URLs: []
  },
  {
    codeName: 'change_keyservice',
    id: 118,
    rawName: 'Can change key service',
    ruName: 'Может изменить службу ключей',
    contentId: 28,
    appLabel: 'services',
    model: 'keyservice',
    URLs: []
  },
  {
    codeName: 'view_keyservice',
    id: 120,
    rawName: 'Can view key service',
    ruName: 'Может просматривать службу ключей',
    contentId: 28,
    appLabel: 'services',
    model: 'keyservice',
    URLs: []
  },
  {
    codeName: 'delete_service',
    id: 179,
    rawName: 'Can delete service',
    ruName: 'Может удалить сервис', // ???
    contentId: 42,
    appLabel: 'services',
    model: 'service',
    URLs: []
  },
  {
    codeName: 'view_service',
    id: 180,
    rawName: 'Can view service',
    ruName: 'Может просматривать сервис', // ???
    contentId: 42,
    appLabel: 'services',
    model: 'service',
    URLs: []
  },
  {
    codeName: 'change_service',
    id: 178,
    rawName: 'Can change service',
    ruName: 'Может изменить сеанс передачи данных', // ??? Double ?
    contentId: 42,
    appLabel: 'services',
    model: 'service',
    URLs: []
  },
  {
    codeName: 'add_service',
    id: 177,
    rawName: 'Can add service',
    ruName: 'Может добавить сервис',
    contentId: 42,
    appLabel: 'services',
    model: 'service',
    URLs: []
  },
  {
    codeName: 'change_servicesession',
    id: 114,
    rawName: 'Can change service session',
    ruName: 'Может изменить сеанс обслуживания', // ???
    contentId: 27,
    appLabel: 'services',
    model: 'servicesession',
    URLs: []
  },
  {
    codeName: 'delete_servicesession',
    id: 115,
    rawName: 'Can delete service session',
    ruName: 'Может удалить сеанс обслуживания', // ???
    contentId: 27,
    appLabel: 'services',
    model: 'servicesession',
    URLs: []
  },
  {
    codeName: 'add_servicesession',
    id: 113,
    rawName: 'Can add service session',
    ruName: 'Может добавить сеанс обслуживания', // ???
    contentId: 27,
    appLabel: 'services',
    model: 'servicesession',
    URLs: []
  },
  {
    codeName: 'view_servicesession',
    id: 116,
    rawName: 'Can view service session',
    ruName: 'Может просматривать сеансы связи', // ???
    contentId: 27,
    appLabel: 'services',
    model: 'servicesession',
    URLs: []
  },
  {
    codeName: 'add_session',
    id: 35,
    rawName: 'Can add session',
    ruName: 'Может добавить сеанс', // ???
    contentId: 9,
    appLabel: 'sessions',
    model: 'session',
    URLs: []
  },
  {
    codeName: 'delete_session',
    id: 37,
    rawName: 'Can delete session',
    ruName: 'Может удалить сеанс', // ???
    contentId: 9,
    appLabel: 'sessions',
    model: 'session',
    URLs: []
  },
  {
    codeName: 'view_session',
    id: 38,
    rawName: 'Can view session',
    ruName: 'Может просматривать сеанс', // ???
    contentId: 9,
    appLabel: 'sessions',
    model: 'session',
    URLs: []
  },
  {
    codeName: 'change_session',
    id: 36,
    rawName: 'Can change session',
    ruName: 'Может изменить сеанс',  // ???
    contentId: 9,
    appLabel: 'sessions',
    model: 'session',
    URLs: []
  }];