// Запуск скриптов (логика работы)
const CITIZEN = {
  User:{},
  UserNft: {},
  OtherUserNft:[],
  initTg: function (){
    Telegram.init();
  },
  initGeneralParameters: async function () {
    await GeneralParameters.setInInput();
    return true;
  },
  initTrigger: async function () {
    $(document).on('click', '#__page__addSocialTies .form__footer .button#add', async (e) => {
      const inputUser = $('#__page__addSocialTies .form__userName');
      const inputRole = $('#__page__addSocialTies .form__socialRole');
      if (inputUser.val() && inputRole.val()) {
        userId = await Telegram.searchByUsername($('#__page__addSocialTies .form__userName').val());
        if (userId && Number.isInteger(+userId)) {
          const val = {};
          val[userId] = $('#__page__addSocialTies .form__socialRole').val() || '';
          this.UserNft.set('Social ties', val);
          await this.initOtherUser();
          window.history.back();
          inputRole.val('');
          inputUser.val('');
          $('#__page__addSocialTies .custom-combobox-input').val('');
        }
      }
    });

    $(document).on('click', '.popup_ChangeTheTies._active  div.button', async (e) => {
      const inputRole = $('.popup_ChangeTheTies._active .ChangeTheTies__add .form__Ties');
      const button = $('.popup_ChangeTheTies._active  div.button');
      if (inputRole.val() && button.attr('data-user')) {
        const val = {};
        val[button.attr('data-user')] = inputRole.val();
        await this.UserNft.update('Social ties', val);
        await this.initOtherUser();
        setTimeout(() => {
          popup_close(
            document.querySelector('.popup_ChangeTheTies'),
            false
          );
        }, 300);
      }
    });

    $(document).on('click', '.popup_Describe._active  div.button.button__add', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const AddParams = document.querySelector('.popup_Describe._active')?.getAttribute('data-user-id') || '';
      popup_close(
        document.querySelector('.popup_Describe'),
        false,
        false
      );
      window.otherUserAddParams = AddParams;
    });

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
          const otherUser = (await this.UserNft.search('Social ties')).value || {};
          if (window.otherUserAddParams && otherUser[window.otherUserAddParams]) {
            const index = this.OtherUserNft.findIndex((elm) => { return elm.userId == window.otherUserAddParams });
            if (index >=0) {
              this.OtherUserNft[index].set(
                formsPage[page],
                val
              );
              this.OtherUserNft[index].save();
    
              await this.initOtherUser(false);
              window.otherUserAddParams = '';
            }
          } else {
            this.UserNft.set(
              formsPage[page],
              val
            );
  
            const { user, userParam } = await this.getParamsAndUserParameter(this.UserNft, true);
            User.__constr(user, userParam);
            User.render();
            
          }
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
  getParamsAndUserParameter: async function (Nft, needBalance = false ,needTgName = false) {
    let user = {};
    let userParam = [];
    let countRecords = 0;
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

    const countOtherUser = (await Nft.search('Social ties')).value || {};

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
          const params = (await Nft.search(userParamsMatching[(element).toLowerCase()]))?.value;
          const val = {};
          Object.keys(params).forEach((elm) => {
            const positive = params[elm][0]||0;
            const negative = params[elm][1]||0;
            let ignor = ((Object.values(countOtherUser).length || 0) - positive - negative) || 0;

            if (ignor < 0 || !(typeof ignor === 'number' && isFinite(ignor))) {
              ignor = Object.values(countOtherUser).length || 0;
            }
            if (!Array.isArray(val[elm])) {
              val[elm] = [];
            }
            val[elm].push(...params[elm]);
            countRecords = countRecords + (+positive + negative);
            if (val[elm].length == 2) {
              val[elm].push(ignor);
            }
          })


          userParam.push([
            userParamsMatching[element],
            val
          ]);
          
        }
    }

    user['token'] = Nft?.owner;
    user['balance'] = Nft?.owner && needBalance ? await TonWallet.__constr(Nft?.owner).getBalance() : '';
    const params = new URLSearchParams(window.location.search);
    const tgName = params.get("userName") || Telegram.user.username ;
    user['tgName'] = (tgName && needTgName) ? tgName : user['name'];
    return { user, userParam, countRecords };
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
    this.UserNft = await NFT.__constr(UserTgId);
    await this.UserNft.updatePoints();

    const { user, userParam } = await this.getParamsAndUserParameter(this.UserNft, true, true);
    this.User = User.__constr(user, userParam);
    User.render();
    if (!this.UserNft.nftAddress) {
      window.location.hash = '';
    }
    return true;
  },
  initOtherUser: async function (needUpdate = true) {
    if (!document.querySelector('#SocialTies.tabList')) {
      return true;
    }
    let OtherUsersId = (await this.UserNft.search('Social ties'))?.value || {};
    const paramForOtherUsers = [];
    if (needUpdate) {
      let OtherUsersNFT = [];
     
      Object.keys(OtherUsersId).forEach((tgId) => {
        const OtherUserNFT = NFT.__constr(tgId);
        OtherUsersNFT.push(OtherUserNFT);
      });

      OtherUsersNFT = await Promise.all(OtherUsersNFT);
      this.OtherUserNft = OtherUsersNFT;
    }
 

    for(const NFT of this.OtherUserNft) {
      console.log(NFT);
      const { user, userParam:UserParams, countRecords } = await this.getParamsAndUserParameter(NFT);
        paramForOtherUsers.push({ ...user, UserParams , id:NFT.userId, socialRole:{name: OtherUsersId[NFT.userId], count:countRecords}});

    };
    otherUsers.__constr(paramForOtherUsers);
    otherUsers.render();
    return true;
  },
  init: function () { 
    const load = [];
    OpenPage.bindAction();
    this.initTg();
    window.location.hash = '';
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
    if (!this.UserNft.admin) {
      User.setView();
    }
    
    console.info('загрузка завершена');
    Telegram.ready();
  }

}

window.addEventListener("load", function () {
  CITIZEN.init();
});


