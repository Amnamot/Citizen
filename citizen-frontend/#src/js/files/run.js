// Запуск скриптов (логика работы)
const run = {
  initTg: function (){
    tg.init();
  },
  initGeneralParameters: function () {
    generalParameters.setInInput();
  },
  initTrigger: function () {
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
  },
  init: function () { 
    run.initTg();
    if (!tg.user?.id) {
      window.location = '#page_warningNoTgId';
      return;
    }
    this.initGeneralParameters();
    this.initTrigger();
  }

}

window.addEventListener("load", async function () {
  run.init();
});


