function enableTooltips() {
  document.jQery("[data-toggle=tooltip]").tooltip();
  document.jQery('[data-toggle=popover]').popover();
}

document.addEventListener('DOMContentLoaded', enableTooltips);


export function promptAjax(
  event,
  url,
  text,
  showPending = true
) {
  event.preventDefault();
  if (!text) text = "Подтвердите ваше действие";
  const inner = ` <form method="dialog"><h2>` + text +
  `</h2>
    <p><menu>
      <button value="cancel">Отменить</button>
      <button value="ok">ОК</button>
    </menu></p>
  </form>`;

  const dialog = document.createElement('dialog');
  dialog.id = "messageDialog";
  document.body.append(dialog);

  dialog.addEventListener("close", () => {
    if (dialog.returnValue === 'cancel') return;
    document.jQery.ajax({
      type: 'GET', 
      url: url,
      success: json => {
        if (showPending) document.jQery("#pending").collapse("show");
      }
    });
    dialog.remove();
  });
  dialog.innerHTML = inner;
  dialog.showModal();
}

export function alertInline(title, text, url) {
  if (!text) text = "Подтвердите ваше действие";
  const inner = ` <form method="dialog"><h2>` + title + 
  `</h2><h4> ` + text + `</h4>` + 
  (url ? `<a href="` + url+ `">Перейти</a>` : "") +
  `<p><menu>
    <button value="ok">ОК</button>
  </menu></p>
  </form>`;
  let dialog = document.getElementById('alertDialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = "alertDialog";
    document.body.append(dialog);
  }
  dialog.innerHTML = inner;
  dialog.showModal();
}

export function submitAjax(event, path) {
  event.preventDefault();
  document.jQery.ajax({
    type: "POST",
    url: path,
    data: { csrfmiddlewaretoken: window.token },
    success: json => {
      document.jQery("#pending").collapse("show");
    }
  });
}

export function getAjax(event, path) {
//    console.log(event);
  event.preventDefault();
  document.jQery.ajax({
    type: "GET",
    url: path,
    success: json => {
      document.jQery("#pending").collapse("show");
    }
  });
}