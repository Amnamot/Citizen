// Запуск скриптов (логика работы)
const run = {
  UserNft: {},
  initTg: function (){
    tg.init();
  },
  initGeneralParameters: async function () {
    await generalParameters.setInInput();
    return true;
  },
  initTrigger: async function () {
    $(document).on('infoLoad', (e, mainUser) => {
      if (tg.user?.id !== mainUser.tgId) {
        if (!(window.location.pathname === '/' && (window.location.hash === '#page_walletInfo' || window.location.hash === ''))) {
          window.location = window.location.origin;
        }
      }
      
    });
    $(document).on('click', '#__page__addSocialTies .form__footer .button#add', debounce(async (e) => {
      e.currentTarget.disabled = true;
      if ($('#__page__addSocialTies .form__userName').val()) {
        userId = await tg.searchByUsername($('#__page__addSocialTies .form__userName').val());
        if (userId && Number.isInteger(+userId)) {
          this.UserNft.set('Social ties', `${userId}`);
          const constUser = {
            token: tg.data.nftAddress || 'undefined',
            balance: 0,
          };
          const NftAttributes = await this.UserNft.getAttributes();
          const { user, userParam } = await this.getParamsAndUserParameter(NftAttributes);
          User.__constr(Object.assign(user,constUser),userParam);
          User.render();
          window.history.back();
        }
      }
      e.currentTarget.disabled = false;
    }, 400));

    const formsPage = {
      'addSocialTies':'Social ties',
      'addAttitude':'Attitudes',
      'addCharacters':'Characters',
      'addEmotions':'Emotions',
      'addMorality':'Moralities',
      'addSkills':'Skills',
    };

    for(const page of Object.keys(formsPage)) {
      $(document).on('click', `#__page__${page} .form__footer .button#add`, async (e) => {
        if ($(`#__page__${page} .add__form .form__property `).val()) {
          console.log(`add in ${page}`);
          const val = {}
          const countOtherUser = (await this.UserNft.search('Social ties')).value || [];
          val[$(`#__page__${page} .add__form .form__property `).val()] = [0, 0, countOtherUser.length];
          this.UserNft.set(
            formsPage[page],
            val
          );

          const constUser = {
            token: tg.data.nftAddress || 'undefined',
            balance: 0,
          };
          const NftAttributes = await this.UserNft.getAttributes();
          const { user, userParam } = await this.getParamsAndUserParameter(NftAttributes);
          User.__constr(Object.assign(user,constUser),userParam);
          User.render();
          window.history.back();
        }
        return true;
      });
    }

    window.addEventListener('beforeunload', async (event) => {
      await this.UserNft.save();
      return '';
    });
    
    return true;
  },
  getParamsAndUserParameter: async function (NftAttributes) {
    let user = {};
    let userParam = [];
    const userParameterMatching = {
      'First name': 'name',
      'Last name': 'surname',
      'Gender': 'gender',
      'Date of birth': 'birth',
      'Photo': 'userImg',
      'Date of issue': 'dateReg',
      'Action Points': 'points',
    };

    const userParamsMatching = {
      'attitudes' : 'Attitude',
      'vices': 'Vices',
      'characters': 'Characters',
      'emotions': 'Emotions',
      'moralities': 'Morality',
      'attitudes': 'Attitude',
      'skills': 'Skills',
    }
    
    for (const element of NftAttributes) {
      if (userParameterMatching[element?.trait_type]) {
        const elm = userParameterMatching[(element?.trait_type)];
        switch (element?.trait_type) {
          case 'Photo':
            user[elm] = (await $.get(element?.value))|| ''; 
            break;
        
          default:
            user[elm] = Array.isArray(element?.value)?element?.value[0]: element?.value;
            break;
        }
        
        
      } else if (userParamsMatching[(element?.trait_type).toLowerCase()]) {
        userParam.push([
          userParamsMatching[(element?.trait_type).toLowerCase()],
          element?.value[0]
        ]);
      }
    };

    return {user, userParam}
  },
  initUsers: async function () {
    await this.initUser();
    await this.initOtherUser();

    return true;
  },
  initUser: async function () {
    let UserTgId = tg.user?.id;
    if (!UserTgId) {
      UserTgId = window.location.search.slice(1).split('&').find((elm) => {
        if (elm.search('another_id=') >= 0) {
          return true;
        }
      }) || ''
      UserTgId = UserTgId.slice('another_id='.length);
    }
    this.UserNft = NFT.__constr(UserTgId);
    const NftAttributes = await this.UserNft.getAttributes();
    await this.UserNft.updatePoints();
    const constUser = {
      token: tg.data.nftAddress || 'undefined',
      balance: 0,
    };

    const { user, userParam } = await this.getParamsAndUserParameter(NftAttributes);
    User.__constr(Object.assign(user,constUser),userParam);
    User.render();
    if (tg.user?.id !== (await this.UserNft.search('Telegram ID')).value) {
      window.location.hash = '';
      User.setView();
    }
    return true;
  },
  initOtherUser: async function () {
    const NftAttributes = await this.UserNft.getAttributes();
    let OtherUsersId = [];
    let OtherUsersNFT = [];
    const paramForOtherUsers = [];

    for (let elm of NftAttributes) {
      if (elm.trait_type === 'Social ties') {
        OtherUsersId = elm?.value || [];
        break;
      }
    }
    OtherUsersId.forEach((tgId) => {
      const OtherUserNFT = NFT.__constr(tgId);
      OtherUsersNFT.push(OtherUserNFT.get());
    });

    OtherUsersNFT = await Promise.all(OtherUsersNFT);
    
    for(const NFT of OtherUsersNFT) {
      console.log(NFT?.attributes);
      const { user, userParam:UserParams } = await this.getParamsAndUserParameter(NFT?.attributes);
        paramForOtherUsers.push({ ...user, UserParams });

    };
    otherUsers.__constr(paramForOtherUsers);
    otherUsers.render();
    return true;
  },
  init: function () { 
    const load = [];
    run.initTg();
    if (!tg.user?.id) {
      window.location = '#page_warningNoTgId';
      return;
    }
    load.push(this.initTrigger());
    load.push(this.initGeneralParameters());
    load.push(this.initUsers());
    Promise.all(load).then(() => {
      this.loadComplite();
    }).catch((error) => {
      console.error(error);
    });
  },
  loadComplite: function () {
    console.info('загрузка завершена');
    tg.ready();
  }

}

window.addEventListener("load", function () {
  run.init();
});


