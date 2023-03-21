// Запуск скриптов (логика работы)
const CITIZEN = {
  UserNft: {},
  initTg: function (){
    Telegram.init();
  },
  initGeneralParameters: async function () {
    await GeneralParameters.setInInput();
    return true;
  },
  initTrigger: async function () {
    $(document).on('click', '#__page__addSocialTies .form__footer .button#add', debounce(async (e) => {
      e.currentTarget.disabled = true;
      if ($('#__page__addSocialTies .form__userName').val()) {
        userId = await Telegram.searchByUsername($('#__page__addSocialTies .form__userName').val());
        if (userId && Number.isInteger(+userId)) {
          this.UserNft.set('Social ties', `${userId}`);
          const constUser = {
            token: Telegram.data.nftAddress || 'undefined',
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
      'addAttitude':'Attitude',
      'addCharacters':'Characters',
      'addEmotions':'Emotions',
      'addMorality':'Morality',
      'addSkills': 'Skills',
      'addVices':'Vices',
    };

    for(const page of Object.keys(formsPage)) {
      $(document).on('click', `#__page__${page} .form__footer .button#add`, async (e) => {
        if ($(`#__page__${page} .add__form .form__property `).val()) {
          console.log(`add in ${page}`);
          const val = {}
          val[$(`#__page__${page} .add__form .form__property `).val()] = [0, 0];
          this.UserNft.set(
            formsPage[page],
            val
          );

          const { user, userParam } = await this.getParamsAndUserParameter(this.UserNft);
          User.__constr(user, userParam);
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
  getParamsAndUserParameter: async function (Nft) {
    let user = {};
    let userParam = [];
    const userParameterMatching = {
      'name': 'First name',
      'surname': 'Last name',
      'gender': 'Gender',
      'birth': 'Date of birth',
      'userImg': 'Photo',
      'dateReg': 'Date of issue',
      'points': 'Action Points',
      'thanks':'Thanks'
    };

    const userParamsMatching = {
      'attitudes' : 'Attitude',
      'vices': 'Vices',
      'characters': 'Characters',
      'emotions': 'Emotions',
      'moralities': 'Morality',
      'skills': 'Skills',
    }

    const countOtherUser = (await this.UserNft.search('Social ties')).value || [];

    for (const element of Object.keys(Object.assign({},userParameterMatching,userParamsMatching))) {
        if (userParameterMatching[element]) {
          const elm = userParameterMatching[(element)];
          switch (element) {
            case 'userImg':
              user[element] = (await $.get((await Nft.search(elm))?.value))|| ''; 
              break;
        
            default:
              user[element] = Array.isArray((await Nft.search(elm))?.value)?(await Nft.search(elm))?.value[0]: (await Nft.search(elm))?.value;
              break;
          }          
          
        } else if (userParamsMatching[element] && (await Nft.search(userParamsMatching[(element).toLowerCase()]))?.value) {
          userParam.push([
            userParamsMatching[(element).toLowerCase()],
            (await Nft.search(userParamsMatching[(element).toLowerCase()]))?.value,
            countOtherUser.length||0
          ]);
        }
    }

    user['token'] = Nft?.owner;
    user['balance'] = Nft?.owner ? await TonWallet.__constr(Nft?.owner).getBalance() : '';
    const params = new URLSearchParams(window.location.search);
    const tgName = params.get("userName") || Telegram.user.username ;
    user['tgName'] = tgName;
    return {user, userParam}
  },
  initUsers: async function () {
    await this.initUser();
    await this.initOtherUser();

    return true;
  },
  initUser: async function () {
    let UserTgId = Telegram.user?.id || '';
    if (!UserTgId) {
      UserTgId = window.location.search.slice(1).split('&').find((elm) => {
        if (elm.search('another_id=') >= 0) {
          return true;
        }
      }) || ''
      UserTgId = UserTgId.slice('another_id='.length) || '';
    }
    this.UserNft = NFT.__constr(UserTgId);
    await this.UserNft.updatePoints();

    const { user, userParam } = await this.getParamsAndUserParameter(this.UserNft);
    User.__constr(user, userParam);
    User.render();
    if (!this.UserNft.nftAddress) {
      window.location.hash = '';
      User.setView();
    }
    return true;
  },
  initOtherUser: async function () {
    let OtherUsersId = (await this.UserNft.search('Social ties'))?.value || [];
    let OtherUsersNFT = [];
    const OtherNFT = [];
    const paramForOtherUsers = [];


    OtherUsersId.forEach((tgId) => {
      const OtherUserNFT = NFT.__constr(tgId);
      OtherUsersNFT.push(OtherUserNFT.get());
      OtherNFT.push(OtherUserNFT);
    });

    OtherUsersNFT = await Promise.all(OtherUsersNFT);
    
    for(const NFT of OtherNFT) {
      console.log(NFT);
      const { user, userParam:UserParams } = await this.getParamsAndUserParameter(NFT);
        paramForOtherUsers.push({ ...user, UserParams , id:NFT.userId});

    };
    otherUsers.__constr(paramForOtherUsers);
    otherUsers.render();
    return true;
  },
  init: function () { 
    const load = [];
    OpenPage.bindAction();
    this.initTg();
    if (!Telegram.user?.id) {
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
    Telegram.ready();
  }

}

window.addEventListener("load", function () {
  CITIZEN.init();
});


