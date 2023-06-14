// LEGACY from backend

/* Заметки и сделать:
+ 1. состояние соединения (reconnecting) вынести в pinia store => isConnected
+ 2. всё в camelCase
  3. вынести clear_bold_in3sec_proc - в отдельный таймер в компоненте
  4. sorted_messages => в pinia store
+ 5. var и вообще без варов -- в let и const
  6. не пользоваться jquery => делать MVC архитектуру
  7. вместо sessionStorage с потерей непрочитанных сообщений использовать localStorage
    под каждого пользователя на машине
  8. status_unseen - это класс что ли? переписать в actions в store, но без сайд-эффектов.
    Использовать actions в компоненте message
  9. функция рисования таблицы - в компонент сообщений
  10. функция загрузки всех сообщений - декомпозировать и раскидать
  11. основную часть -- декомпозировать и раскидать
  12. всё из sessionStorage в pinia
  13. что делает $.getJSON ? => переделать в нужное
! 14. listenForTaskRecords => в новую службу вебсокетов;
  15. listenForTaskRecords использует рекурсивный вызов себя,
    не использовать при наличии сайд-эффектов -- сожрёт память,
    использовать чистую функцию и враппер; вынести все сайд-эффекты в другую функцию
? 16. alert_inline -- прибегает из какого-то другого файла,
    понять откуда, что делает, зачем, перетащить, вызвать
  17. заменить alert на модальное окно -- отдельный компонент
? 18. spdu support -- перенести на страницу с spdu;
    что за final_status ? + ошибки в коде...
? 19. window.local_message_handlers -- прибегает из какого-то другого файла (2)
  20. if message.url is current url : reload window  ==>
    для разных сообщений разное поведение на разных страницах.
    Какие-то апдейтятся целиком, какие-то свои части... в общем декомпозировать...
+ 21. в max_pk  Math.max.apply - чернокнижие переписать!
  22. safe_string - использовать защиту, скринить сообщения (важно!)
*/

let reconnecting = false;
let statusMessageData = []; // list of recevied message
const statusMessageView = []; // presentation of received messages
let clearBoldIn3secProc = null; // function to clear bold status

// это расширенный Set что ли?
// с кучей сайд-эффектов? как класс но более гнусно-хакерски? ))
const statusUnseen =  { // set of bold (unseen) messages
  value: new Set(),
  set(v) {
    this.value = v;
    window.sessionStorage.setItem("statusUnseen", JSON.stringify(Array.from(v)));
    document.jQuery("#pending-unseen").get()[0].innerHTML = this.value.size;
  },
  add(v) {
    this.value.add(v);
    window.sessionStorage.setItem(
      "statusUnseen", JSON.stringify(Array.from(this.value)));
    document.jQuery("#pending-unseen").get()[0].innerHTML = this.value.size;
  },
  load() {
    this.value = new Set(JSON.parse(window.sessionStorage.getItem("statusUnseen")));
    document.jQuery("#pending-unseen").get()[0].innerHTML = this.value.size;
  },
  get() {return this.value},
  has(v) {return this.value.has(v)}
};

const finalStatus = ['COMPLETED', 'ERROR', 'FAILED'];

// construct table from messages and information of new(bold, unseen) messages
function drawTable() {
  // messages as seen in table, unlike s_m_data - original messages
  // statusMessageView = [];
  // processing - shortend the result field
  // screen the result field
  // bolding unseen messages
  // trnaslate status field
  const sortedMessages = [...statusMessageData]
    .sort((a, b) => a.timestamp < b.timestamp);

  sortedMessages.forEach(oldrow => {
    const row = {};
    Object.assign(row, oldrow);// copy row
    statusMessageView.push(row);

    row['status'] = translateMessages(row['status']);

    const res = row['result'].toString();
    row['result'] = res.slice(0, 50);
    if (res.length > 50) row['result'] += "...+";
    row['result'] = safeString(row['result']);

    if (statusUnseen.has(row.id)) {
      for (const prop in row) {
        if (prop !== 'id') row[prop] = '<b>' + row[prop] + '</b>';
      }
    }
  });
  // load data in table
  document.jQuery('#pending-table').bootstrapTable('load', statusMessageView);
}

    
// initial load of all status message - 
// could be huge - done once per window session (ie per tab)
function loadAllData() {
  statusMessageData = [];
  console.log("full load of statuses");

  document.jQuery.getJSON("/tasks/viewtasks/", function(data) {
    document.jQuery.each(data, function(key, val) {
      //      console.log("Loading ",val);
      statusMessageData.push({
        'id': val.id,
        'status': val.status,
        'url': '<a href="'+val.url+'">'+val.object_name+"</a>",
        'result': val.result_message ? val.result_message : "",
        'op': val.operation,
        'date': new Date(val.started*1000).toLocaleString(),
        'timestamp': val.started
      });        
    });

    window.sessionStorage.setItem(
      "statusMessageData", JSON.stringify(statusMessageData));
    window.sessionStorage.setItem("status_lastpk", maxPk());
  
    drawTable();
  });
}


// main part - on load of document
document.addEventListener('DOMContentLoaded', 
  function() {
    // register listening for incoming messages
    listenForTaskRecords();
  
    statusMessageData = window.sessionStorage.getItem("statusMessageData");
    // const pendingShow = window.sessionStorage.getItem("pendingShow");
    const su = window.sessionStorage.getItem("statusUnseen");
    if (su) statusUnseen.load();

    // if session holds no message data load all data
    if (!statusMessageData.length) loadAllData();
    // then do incremental update
    statusMessageData = JSON.parse(statusMessageData);
    const lastpk = window.sessionStorage.getItem("status_lastpk");
      
    console.log("incremental load of statuses");
    document.jQuery.getJSON( "/tasks/viewtasks/?lastpk="+lastpk, function( data ) {
      document.jQuery.each( data, function( key, val ) {
        addData(val);
      });
      window.sessionStorage.setItem(
        "statusMessageData", JSON.stringify(statusMessageData));
      window.sessionStorage.setItem("status_lastpk", maxPk());
      drawTable();
    });

    // flag to show message table on window opening
    if (window.sessionStorage.getItem("pendingShow")) {
      setTimeout(()=>document.jQuery("#pending").collapse('show'), 500);
      window.sessionStorage.setItem("pendingShow", "");
    }
  });

// ща вот ненужный блок, забей на него:
// manage autoclose when click outside the list
document.jQuery('body').bind('click', function(e) {
// console.log(":"+document.jQuery(e.target).closest('#pending').length);
  const pending = document.jQuery("#pending");
  if (document.jQuery(e.target).closest('#pending').length == 0) {
    // do not close if target has class not-hide-pending - for buttons with ajax request
    if (document.jQuery(e.target).hasClass("nothidepending") ||
      document.jQuery(e.target.parentElement).hasClass("nothidepending")) return;

    const opened = pending.hasClass('collapse show');
    if ( opened === true ) pending.collapse("hide");
  }
});

// add data to status message data on incremental update or message received
function addData(data) {
  //  console.log(data)
  //      data = JSON.parse(data)

  const newRow = {     
    'id': data.id,
    'status': data.status,
    'url': '<a href="'+data.url+'">'+data.object_name+"</a>",
    'result': data.result_message?data.result_message:"",
    'op': data.operation,
    'date': new Date(data.started*1000).toLocaleString(),
    'timestamp': data.started
  };

  statusUnseen.add(data.id);
  
  const index = statusMessageData.findIndex( row => row.id == data.id );
  index === -1 ?
    statusMessageData.push(newRow) :
    statusMessageData[index] = newRow;
}

document.jQuery("#logout-menu").click( function(ev) {
  window.sessionStorage.setItem("statusMessageData", "");
});

// register incoming status messages
function listenForTaskRecords() {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';

  let chatSocketTaskRecords;
  new Promise(function(resolve, reject) {
    chatSocketTaskRecords = new WebSocket(
      wsProtocol + window.location.host + '/ws/status_message');
    chatSocketTaskRecords.onerror = function() {
      // NOTE: исправить предупреждение
      // eslint-disable-next-line prefer-promise-reject-errors
      reject("couldn't connect");
    };
  }).catch(function(err) {
    setTimeout(()=>listenForTaskRecords(), 1000);
    reconnecting = true;
    console.log("ERROR: ws connection failed("+err+"): reconnting in 1 sec");
  });

  chatSocketTaskRecords.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.type === "reload") {
      if (data.message) alert(data.message);
      window.location.reload();
    }
    if (data.type === "message") {
      if (data.message) alert(data.message); 
      return;
    }
    if (data.type === "inform") {
      if (data.message) {
        // NOTE: что за функция, откуда такая и как переписывать?
        // eslint-disable-next-line no-undef
        alert_inline(
          data.message.title ?
            data.message.title :
            "Сообщение от внешних систем",
          data.message.text,
          data.message.url);
      }
      return;
    }

    if (data.type === "access") {
      access(data);
      return;
    }
    if (data.type === 'record_state') {
      let message;
      // console.log("websocket for records new message: ", data.data);
      try {
        message = JSON.parse(data.data);
      } catch {
        message = data.data;
      }
      addData(message);
      window.sessionStorage.setItem(
        "statusMessageData", JSON.stringify(statusMessageData));
      window.sessionStorage.setItem("status_lastpk", maxPk());

      // show alert
      if (!document.jQuery("#message-alert").get()[0]) {
        footerAlert("message-alert", " Пришло сообщение ");
      }

      // SPDU support - should probably be moved to spdu, modularity!
      let spduResponse = window.sessionStorage.getItem("spduResponse");
      if (spduResponse) {
        let changed = false;
        spduResponse = JSON.parse(spduResponse);
        const empty = spduResponse.filter(spdu => !(spdu.response) );
        empty.forEach( spdu => {
          const corrdata = statusMessageData.filter(message =>
            // NOTE: думаю тут ошибка, иначе id будет true или false;
            message.id === spdu.id && finalStatus.has(message.status));
          if (corrdata.length) changed = true;
          corrdata.forEach(a => spdu.response = a.result);
        });
        if (changed) {
          console.log("spdu postprocess changes spdu list");
          window.sessionStorage.setItem("spduResponse", JSON.stringify(spduResponse));
          setTimeout(() => window.location.reload(), 200);
        }
      }
  
      if (document.jQuery("#pending").hasClass('collapse show')) planPendingClear();

      // NOTE: лучше б тут было updateTable();
      drawTable();
  
      // if message.url is current url : reload window 
      // #TODO sepcial field for reloading (ie message updates browser information or not)
      const href = "/" + window.location.href.split("/").splice(3).join("/");
      //        console.log("COmparing "+message.url+" and "+href);
      const exceptUrls = ["/data/switch/", "/accounts/list/", '/data/ipmi/list'];

      const needShowPendingFlag = (
        message.url === href &&
        !exceptUrls.find(url => url === message.url) &&
        finalStatus.has(message.status)
      );
      
      if (needShowPendingFlag) {
        setTimeout(() => window.location.reload(), 200);
        if (document.jQuery("#pending").hasClass("show")) {
          window.sessionStorage.setItem("pendingShow", true);
        }
      }
     
      // adding local handling of different event types
      // handler may be a function or function list
      const localMessageHandlers = window.localMessageHandlers;
      if (localMessageHandlers) {
        Object.keys(localMessageHandlers).forEach(key => {
          try {
            const result = (message.operation + '').match(key);
            if (result && result.length > 0) {
              const handler = localMessageHandlers[key];
              // console.log("Pattern succedeed "+key,handler)
              if (Array.isArray(handler)) {
                handler.forEach(h => {
                  localMessageHandlers[key][h](
                    message, message.object_name, message.result_message);
                });
              } else {
                localMessageHandlers[key](
                  message, message.object_name, message.result_message);
              }
            }
          } catch (ex) {
            console.log(ex);
          }
        });
      }
    }
  };

  chatSocketTaskRecords.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
    if (!reconnecting) setTimeout(()=>listenForTaskRecords(), 1000);
    reconnecting = true;
    console.log("ERROR: ws connection closed unexpedctedly: reconnecting in 1 sec");
  };

  chatSocketTaskRecords.onopen = function(e) {
    console.log("onopen websocket for status records");
    reconnecting = false;
  };
}

// NOTE: 
function access(data) {
  const currentUser = window.local_user;
  console.log(data.message);
  const loc = new Set(window.local_events);
  if (loc.has(data.message.action)) {
    let row = document.jQuery(".table.my-2 tr:contains('"+data.message.resource+"')");
    if (row.length>0) {
      row = row[0];
      if (data.message.command === 'request') {
        flash(row, true);
        if (currentUser !== data.message.user) {
          tooltip(row, data.message.user+' запустил '+data.message.action);
        }
      }
    }
  } 
}

// Table bolds - hide them in 3 sec if seen for 3 sec
// -------------------------------------------------------------------
// when status messages are hidden -
// if closed too fast stop removing bolds
document.jQuery('#pending').on('hide.bs.collapse', function() {
  if (clearBoldIn3secProc) {
    clearTimeout(clearBoldIn3secProc);
    clearBoldIn3secProc = null;
  }
});


// when status messages are shown -
document.jQuery('#pending').on('show.bs.collapse', function() {
  planPendingClear();
});

// run on update of messages-or when table is shown
// plan toggle bold to non-bold in 3 secs
function planPendingClear() {
  if (statusUnseen.get().size>0) {
    clearBoldIn3secProc = setTimeout(function() {
      statusUnseen.set(new Set());
      drawTable();
    }, 3000);
  }
}

// Table presentation -- formatting + sign on left
// -------------------------------------------------------------------
// check whether to show expand sign for a row
// eslint-disable-next-line no-unused-vars
function detailFilter(index) {
  const id = document.jQuery("#pending-table").bootstrapTable('getData')[index].id;
  const data = statusMessageData.filter(x => x.id === id)[0]['result'];
  //  console.log(index+" filter:"+data.length+" "+data)
  return data.length > 50;
}

// what to show after expanded row
// eslint-disable-next-line no-unused-vars
function detailFormatter(index, row) {
  const id = row.id;
  row = statusMessageData.filter(x=>x.id==id)[0];
  return "<p>"+safeString(row['result'])+"</p>";
}

// Auxiliary
// -------------------------------------------------------------------
// translation

function translateMessages(stat) {
  const tr = {
    'COMPLETED': "Успешно выполнено",
    "INITIATED": "В очереди",
    "PENDING": "В обработке",
    "ERROR": "Произошла ошибка",
    "FAILED": "Не выполнено"
  };
  return tr[stat];
}


// get maximum number of pk of current status messages (only for final state messages)
function maxPk() {
  return Math.max(0,
    ...statusMessageData.filter(o => finalStatus.has(o.status)).
      map(o => o.timestamp)
  );
}

// convert string to html showable (screen <. >, & chars)
function safeString(input) {
  return document.jQuery('<span>').text(input).html();
}

// NOTE: какое-то прикольное мигание, не суть какое
function footerAlert(id, text, div, after) {
  if (!div) div = 'footer-navigation';
  if (!id) id = Math.floor(Math.random() * 10000) + "";
  if (!after) {
    document.jQuery("#"+div).append(
      `<div class="alert alert-warning" role="alert" id="`+id+`">`+text+`</div>`);
  } else {
    document.jQuery("#"+div).prepend(
      `<div class="alert alert-warning" role="alert" id="`+id+`">`+text+`</div>`);
  }
  setTimeout(function() {
    document.jQuery("#"+id).remove();
  }, 2000);
}

function flash(elem, mode) {
  const color = mode ? 'rgb(199,226,80)' : '';
  document.jQuery(elem).css('background', color);
  if (mode) setTimeout(() => flash(elem, false), 3000);
}

function tooltip(row, message) {
  document.jQuery(row).attr('data-toggle', 'tooltip');
  document.jQuery(row).attr('data-trigger', 'manual');
  document.jQuery(row).attr('data-original-title', message);
  document.jQuery(row).tooltip('show');
  setTimeout(()=>document.jQuery(row).tooltip('hide'), 3000);
}