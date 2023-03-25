const Telegram = {
  app: window?.Telegram?.WebApp || {},
  init: function () {
    this.data = this.app?.initData || {};
    this.user = this.app?.initDataUnsafe?.user || {};
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
      Telegram.sendData(data);
      //при клике на основную кнопку отправляем данные в строковом виде
    });
  },
  searchByUsername: async function (userName) {
    let res = {};
    try {
      res =  JSON.parse(await $.get(`${CONST.DOMAIN}/api/v1/isuser/${userName}`));
      if (!res?.telegram_id && res.error) {
        popup_open('UserAlertNotFound');
        setTimeout(() => {
          popup_close(
            document.querySelector('.popup_UserAlertNotFound'),
            false
          );
        }, 300);
      }
    } catch (e) {
      console.trace(e);
      popup_open('UserAlertNotFound');
      setTimeout(() => {
        popup_close(
          document.querySelector('.popup_UserAlertNotFound'),
          false
        );
      }, 300);
    }
    return res?.telegram_id || '';
  },
};

window.Telegram = Telegram;
