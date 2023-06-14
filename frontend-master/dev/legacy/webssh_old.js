// LEGACY from backend

let stopped = 0;
let playing = false;

function getConnectInfo() {
  const port = document.jQuery('#port').text() || 22;
  const host = document.jQuery('#hostname').text(); // || baseURL();
  const user = document.jQuery('#username').text(); // || "root";
  const auth = "password";
  const pwd = document.jQuery('#password').text();
  const file = document.jQuery('#file').text();
  if (file !== 'None') playing = true;
  const timetostart = document.jQuery('#timetostart').text();
  const password = pwd ? window.btoa(pwd) : '';
  let sshKey = null;
  const ip = document.jQuery("#ip").text();

  if (auth === 'key') {
    const pkey = document.jQuery('#pkey')[0].files[0];
    const csrf = document.jQuery("[name='csrfmiddlewaretoken']").val();
    const formData = new FormData();

    formData.append('pkey', pkey);
    formData.append('csrfmiddlewaretoken', csrf);

    document.jQuery.ajax({
      url: '/upload_ssh_key/',
      type: 'post',
      data: formData,
      async: false,
      processData: false,
      contentType: false,
      mimeType: 'multipart/form-data',
      success: data => sshKey = data,
    });
  }

  return 'host=' + host +
    '&port=' + port +
    '&user=' + user +
    '&auth=' + auth +
    '&password=' + password +
    '&sshKey=' + sshKey +
    '&ip=' + ip +
    "&file=" + file +
    "&timetostart="+timetostart;
}


function getTermSize() {
  const INIT_WIDTH = 9;
  const INIT_HEIGHT = 17;

  const windowsWidth = document.jQuery(window).width();
  const windowsHeight = document.jQuery(window).height();

  return {
    cols: Math.floor(windowsWidth / INIT_WIDTH),
    rows: Math.floor(windowsHeight / INIT_HEIGHT),
  };
}


// eslint-disable-next-line no-unused-vars
function websocket() {
  const cols = getTermSize().cols;
  const rows = getTermSize().rows;
  const connectInfo = getConnectInfo();

  // eslint-disable-next-line no-undef
  const term = new Terminal({
    cols,
    rows,
    useStyle: true,
    cursorBlink: true,
    screenReaderMode: true
  });
  const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
  const socketURL = protocol + location.hostname +
    ((location.port) ? (':' + location.port) : '') +
    '/ws/webssh/?' + connectInfo + '&width=' + cols + '&height=' + rows;

  const sock = new WebSocket(socketURL);

  sock.addEventListener('open', function() {
    document.jQuery('#form').addClass('hide');
    document.jQuery('#django-webssh-terminal').removeClass('hide');
    term.open(document.getElementById('terminal'));
  });

  sock.paused = false;

  document.addEventListener("dblclick", function() {
    if (!playing) return;
    document.jQuery("#message").get()[0].innerHTML = sock.paused ? "" : "Paused";
    sock.paused = !sock.paused;
    sock.send(JSON.stringify({'status': 3, 'mouse': 'down'}));
  });

  sock.addEventListener('message', function(recv) {
    const data = JSON.parse(recv.data);
    const message = data.message;
    const status = data.status;
    if (status === 0) { // text
      term.write(message);
      const screen = document.jQuery(".xterm-accessibility-tree")
        .children()
        .toArray()
        .map(a => a.innerHTML === "Blank line" ? "" : a.innerHTML);
      const sendData = JSON.stringify({'status': 2, 'screen': screen});
      if (stopped === 0) sock.send(sendData);
    } else if (status === 1) { // stop
      stopped = 1;
      term.write(message);
    }
  });

  /*
    * Когда статус равен 0, данные, введенные пользователем, передаются в фоновый режим
    * через веб-сокет, данные — это переданные данные, а параметры cols и rows
    * игнорируются.
    * Когда статус равен 1, измените размер терминала pty ssh,
    * cols — это максимальное количество слов, отображаемых в каждой строке,
    * rows — это максимальное количество слов, отображаемых в каждом столбце,
    * игнорируйте параметр данных.
  */
  const message = {'status': 0, 'data': null, 'cols': null, 'rows': null};

  const file = document.jQuery('#file').text();
  const startcommand = document.jQuery("#startcommand").text();

  if (file === "None") {
    term.on('data', data => {
      message['status'] = 0;
      message['data'] = data;
      const sendData = JSON.stringify(message);
      if (stopped === 0) sock.send(sendData);
    });
  }
    
  if (startcommand !== "None") {
    setTimeout(() => {
      console.log("start command: " + startcommand);
      message['status'] = 0;
      message['data'] = startcommand + '\n\r';
      sock.send(JSON.stringify(message));
    }, 1000);
  }


  // Отслеживание окна браузера и изменение размера терминала
  // в соответствии с размером окна браузера
  document.jQuery(window).resize(function() {
    const cols = getTermSize().cols;
    const rows = getTermSize().rows;
    message['status'] = 1;
    message['cols'] = cols;
    message['rows'] = rows;
    sock.send(JSON.stringify(message));
    term.resize(cols, rows);
  });
}