const tg = {
  app: window?.Telegram?.WebApp || {},
  init: function () {
    this.data = window?.Telegram?.WebApp?.initData || {};
    this.user = window?.Telegram?.WebApp?.initDataUnsafe?.user || {};
  },
  data: {},
  user: {},
  close: function () {
    this.app?.close();
  },
  ready: function () {
    this.app?.ready();
  },
  sendData: function (event = "", data = "") {
    this.app?.onEvent(event, function () {
      tg.sendData(data);
      //при клике на основную кнопку отправляем данные в строковом виде
    });
  },
};

window.tg = tg;
