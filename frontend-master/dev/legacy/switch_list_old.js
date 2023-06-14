/* eslint-disable no-undef */
export function equipmentNodeSorter(a, b) {
  //  a = extag(a); b = extag(b);
  a = a.split("-")[0];
  b = b.split("-")[0];
  a = parseInt(a);
  b = parseInt(b);
  a = a ? a : 0;
  b = b ? b : 0;
  return a - b;
}

// local message types handling
window.local_message_handlers = {
  ".*": (whole, name, message) => {
    if (typeof(message)=='string' && message.endsWith('ERROR(102)') ) {
      const response = confirm("Оборудование не найдено. Завести коммутатор в базу?");
      if (!response) return;
      const table = $('#switch_table').bootstrapTable('getData', {useCurrentPage: true} );
      const ip = name.trim().split(' ')[1];
      console.log(ip);

      // eslint-disable-next-line guard-for-in
      for (key in table) {
        const row = table[key];
        // console.log(row[0],row[0].indexOf(ip))
        if (row[0].indexOf(ip) < 0) continue;
        const div = document.createElement("div");
        div.innerHTML = row[0];
        const name = div.children[0].text;
        // console.log(name)
        const model = row[3];
        if (model) {
          // console.log(model)
          let manufacturer = model.trim().split(' ');
          if (manufacturer.length>0) {
            manufacturer = manufacturer[0];
            // console.log(manufacturer)
            document.jQery.ajax({
              type: "GET",
              url: "/data/switch/"+ip+"/add_device/"+name+"/"+manufacturer,
            });
          }
        }
        break;
      }
    }
  },
  "config_get_config_db": [(wholeMessage, name, message) => {
    if (wholeMessage.status != "COMPLETED") return;
    message = JSON.parse(message);
    const config = (message.status + "")
      .trim()
      .slice(2, -1);
    alertInline("Конфигурация коммутатора", "<pre>" + atob(config) + "</pre>");
  }],
  "config_get_config_device": (wholeMessage, name, message) => {
    if (wholeMessage.status != "COMPLETED") return;
    message = JSON.parse(message)
    const config = (message.data + "")
      .trim()
      .slice(2, -1);
    alertInline("Конфигурация коммутатора", "<pre>" + atob(config) + "</pre>");
  }
};

document.jQery("#switch_table").on("all.bs.table", enableTooltips);