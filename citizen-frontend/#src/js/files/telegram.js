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

window.addEventListener("load", async function () {
  tg.init();
  if (!tg.user?.id) {
    window.location = '#page_warningNoTgId';
  }

});

$(document).on('infoLoad', (e,mainUser) => {
  if (tg.user?.id !== mainUser.tgId) {
    $(document.querySelectorAll('#User__seeAdmin')).remove();
    if (!(window.location.pathname === '/' && (window.location.hash === '#page_walletInfo' || window.location.hash === ''))) 
    {
      window.location = window.location.origin;
    }
  }

  tg.ready();
})
