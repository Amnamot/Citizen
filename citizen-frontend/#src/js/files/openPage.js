
const openPage = {
  list: {
    index: '__page__index',
    addSocialTies: '__page__addSocialTies',
    addSkills: '__page__addSkills',
    addMoral: '__page__addMoral',
    addEmotions: '__page__addEmotions',
    addCharacters: '__page__addCharacters',
    addAttitude: '__page__addAttitude',
    addMorality: '__page__addMorality',
    addVices: '__page__addVices',
    addAttitudeInfo: '__page__addAttitudeInfo',
    addCharactersInfo: '__page__addCharactersInfo',
    addEmotionsInfo: '__page__addEmotionsInfo',
    addMoralityInfo: '__page__addMoralityInfo',
    addSkillsInfo: '__page__addSkillsInfo',
    addSocialTiesInfo: '__page__addSocialTiesInfo',
    addVicesInfo: '__page__addVicesInfo',
    walletInfo: '__page__walletInfo',
    warningNoTgId: '__page__warningNoTgId',
  },
  osnOpenClass: '.__page_open__',
  getKeyByOpenClass: function (element, selectorList) {
    const selOpen = element.classList.value.split(' ').find((el) => {
      return 0 <= selectorList.findIndex((sel) => {
        return sel === `.${el}`
      })
    });
    return selOpen.slice(this.osnOpenClass.length-1);
  },
  osnOpenHash: 'page_',
  checkHash: function () {
    keyPage = window.location.hash.slice(this.osnOpenHash.length+1) || Object.keys(this.list)[0] ||'';
    if (keyPage && this.list[keyPage]) {
      const event = new CustomEvent("pageChange",{detail:{key:keyPage, self:this}});
      document.dispatchEvent(event);
    } else {
      // перенаправляем на дефолтную страницу
      const event = new CustomEvent("pageChange",{detail:{key:'index', self:this}});
      document.dispatchEvent(event);
    }

  },
  eventOpen: function (event) {
    let { key } = event.detail;
    key = key|| Object.keys(this.list)[0];
    document.querySelector(`#${this.list[key]}`)?.classList?.remove('hide');
    Object.values(this.list).forEach((el) => {
      if (el === this.list[key]) {
        return;
      }
      document.querySelector(`#${el}`)?.classList?.add('hide');
    });
    if (Object.keys(this.list)[0] != key) {
      window.location.hash = `${this.osnOpenHash}${key}`;
    }
    
  },
  bindAction: function () {
    const openClass = this.osnOpenClass;
    const selectors = Object.keys(this.list).map(element => {
      return `${openClass}${element}`;
    });


    document.querySelectorAll(selectors.join(', ')).forEach((el) => {
      el.addEventListener('click', (e) => {
        const event = new CustomEvent("pageChange", {
          detail: {
            key: this.getKeyByOpenClass(e.currentTarget, selectors)
          }
        });
        document.dispatchEvent(event);
      })
    });

    

    //Проверка страницы по хешу
    document.addEventListener('pageChange', (e) => { this.eventOpen(e) } );
    this.checkHash();

    // события изменения ссылки
    addEventListener("popstate", (e)=>{
      this.checkHash();
    });
  }
};

openPage.bindAction();