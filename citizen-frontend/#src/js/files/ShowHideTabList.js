
const ShowHideTabList = {
  mainSelector: '.tabList',
  clickToHideSelector: '.tabList__info',
  dontClickToHideSelector: 'button__moreInfoForStat',
  hideSelector: '.tabList__more',
  needCloseMoreOne: false,
  nameSpace: 'showHideTabList',
  bindAction: function () {
    //скрываем/показывай инфу
    document.querySelectorAll(`${this.mainSelector}`).forEach((elm) => {
      elm.querySelector(`${this.clickToHideSelector}`).addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`${this.dontClickToHideSelector}`)) {
          return;
        }
        addRemoveClass(elm.querySelector(`${this.hideSelector}`), 'hide');

        if (this.needCloseMoreOne && (document.querySelectorAll(`${this.mainSelector} ${this.hideSelector}.hide`).length+1 < document.querySelectorAll(`${this.mainSelector} ${this.hideSelector}`).length)) {
          document.querySelectorAll(`${this.mainSelector} ${this.hideSelector}`).forEach((elm) => {
            if (e.currentTarget == elm.parentElement.querySelector(`${this.clickToHideSelector}`)) {
              return;
            }
            elm.classList.add('hide');
          })
        }

      })
    });
  }
};

const telegramUserTabList = Object.assign({},ShowHideTabList, {
  mainSelector: '#SocialTies .field__list .user',
  clickToHideSelector: '.user__block',
  dontClickToHideSelector: 'user__value',
  hideSelector: '.user__action',
  needCloseMoreOne: true,
});

ShowHideTabList.bindAction();
