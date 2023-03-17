const otherUserType = {
  allType: [],
  type: {},
  set: function (type = {}, allType = []) {
    this.type = type;
    this.allType = [...new Set([...allType, ...Object.keys(type)])];
    return Object.assign({}, this);
  },
};

const userListParams = {
  id: "",
  elType: {},
  tabListsTemplate: "standard",
  inputList: null,
  __constr: function (id, values, type) {
    const newUserParams = Object.assign({}, this);
    newUserParams.__set(id, values, type);
    return newUserParams;
  },
  __set: function (id, values, type) {
    this.id = id;
    this.input = type;
    this.setType(values);
  },
  setType: function (values) {
    this.elType = otherUserType.set({}, values);
  },
  addPageRenderList: function () {
    this.inputList = inputList.render(
      `#__page__add${this.id} .add__form .form__property`,
      this.id,
      this.elType.allType,
      this.input
    );
  },
  render: function () {
    this.addPageRenderList();
  },
};

const UserParams = {
  id: "",
  elType: {},
  tabListsTemplate: "standard",
  inputList: null,
  __constr: function (id, type, allType) {
    const newUserParams = Object.assign({}, this);
    newUserParams.__set(id, type, allType);
    return newUserParams;
  },
  __set: function (id, type, allType) {
    this.id = id;
    this.setType(type, allType);
  },
  setType: function (type, allType) {
    this.elType = otherUserType.set(type, allType);
  },
  tabListRender: function () {
    if ("content" in document.createElement("template")) {
      this.tabListClear();
      let template = document.querySelector(
        `#tabListsTemplate__${this.tabListsTemplate}`
      );
      if (!template) {
        return;
      }
      const arrayType = Object.entries(this.elType.type);
      if (!arrayType.length) {
        document
          .querySelector(`#${this.id}.tabList #tabList__Count`)
          .setHTML(0);
      }
      arrayType.forEach((element) => {
        let clone = template.content.cloneNode(true);
        clone.querySelector(".list__content").prepend(element[0]);
        clone.querySelectorAll(".field__stat .value").forEach((elm, selKey) => {
          elm.setHTML(element[1][selKey] ?? 0);
        });
        document
          .querySelector(`#${this.id}.tabList #tabList__Count`)
          .setHTML(Object.values(this.elType.type).length);

        document.querySelector(`#${this.id}.tabList ul.list`).prepend(clone);
      });
    } else {
      console.error("template не поддерживается");
    }
  },
  tabListClear: function () {
    const list = document.querySelectorAll(`#${this.id}.tabList ul.list li`);
    list.forEach((elm, key) => {
      if (list.length - 1 != key) {
        elm.remove();
      }
    });
  },
  addPageRenderList: function () {
    this.inputList = inputList.render(
      `#__page__add${this.id} .add__form .form__property`,
      this.id,
      this.elType.allType,
      this.elType.input
    );
  },
  popupDescribeRender: function () {
    const Describe = document.querySelector(".popup_Describe");
    if (!("content" in document.createElement("template"))) {
      console.error("template не поддерживается");
      return;
    }

    let template = document.querySelector(`#popup_DescribeTemplate`);
    const arrayType = Object.entries(this.elType.type);
    this.popupDescribeDel();
    arrayType.forEach((element) => {
      let clone = template.content.cloneNode(true);
      clone.querySelector(".list__inline p").setHTML(element[0]);
      clone
        .querySelectorAll(".field__value.field__stat .value")
        .forEach((elm, selKey) => {
          elm.setHTML(element[1][selKey] ?? 0);
        });
      document
        .querySelector(`#${this.id}.tabList #tabList__Count`)
        .setHTML(Object.values(this.elType.type).length);

      Describe.querySelector(
        `.Describe__${this.id}_add .${this.id}__list`
      ).prepend(clone);
    });
  },
  popupDescribeDel: function (id) {
    (
      document.querySelectorAll(
        `.popup_Describe .Describe__${this.id}_add .${this.id}__list :not(#popup_DescribeTemplate)`
      ) || []
    ).forEach((elm) => {
      elm.remove();
    });
  },
  render: function () {
    this.tabListRender();
  },
};

const User = {
  tgName: "none",
  name: "none",
  surname: "none",
  birth: "1 april 2000",
  points: 0,
  thanks: 0,
  token: "none",
  balance: "0",
  dateReg: "01.01.2000",
  gender: "none",
  userImg: "./img/header/profile.svg",
  params: [],
  tgId: "",
  __constr: function (
    {
      tgName,
      name,
      surname,
      birth,
      points,
      thanks,
      token,
      balance,
      dateReg,
      userImg,
      gender,
      tgId,
    },
    params
  ) {
    this.tgName = tgName;
    this.name = name;
    this.surname = surname;
    this.birth = birth;
    this.points = points;
    this.thanks = thanks;
    this.token = token;
    this.balance = balance;
    this.dateReg = dateReg;
    this.gender = gender;
    this.tgId = tgId;
    this.userImg = userImg || this.userImg;
    this.setParams(params || []);
    return this;
  },
  /**
   * Права только наа просмотр
   */
  setView: function () {
    $(document.querySelectorAll('#User__seeAdmin')).remove();
  },
  setParams: function (value = null) {
    this.params = [];
    value.forEach((elm) => {
      const [id, type] = elm;
      this.params.push(UserParams.__constr(id, type));
    });
  },
  insertValues: function () {
    this.setSelectorValues("#__User_tgName", `${this.tgName}`);
    this.setSelectorValues("#__User_name", `${this.name}`);
    this.setSelectorValues("#__User_surname", `${this.surname}`);
    this.setSelectorValues("#__User_birth", `${this.birth}`);
    this.setSelectorValues("#__User_points", `${this.points||'0'}`);
    this.setSelectorValues("#__User_gender", `${this.gender}`);
    this.setSelectorValues("#__User_thanks", `${this.thanks||0}`);
    this.setSelectorValues(
      "#__User_token",
      `${this.token.slice(0, 3)}...${this.token.slice(-3)}`
    );
    const balanceArray = this.balance?.toString()?.split(".");
    balanceArray[1]?.slice(0, 2);
    const balanceStr =
      `${balanceArray[0]}` +
      `${balanceArray[1] ? "." + balanceArray[1]?.slice(0, 2) : ""}`;
    this.setSelectorValues("#__User_balance", `${balanceStr} TON`);
    this.setSelectorValues("#__User_dateReg", `${this.dateReg}`);
    this.setImg("#__User_img", this.userImg);
    this.setSelectorValues("#__User_tokenCopy", `${this.token}`);
    document
      .querySelector("#__User_tokenCopy")
      .setAttribute("copy", this.token);
    document
      .querySelector("#__User_tokenToScan")
      .setAttribute("token_to_scan", this.token);
    this.hideBalanceText();
  },
  hideBalanceText: function () {
    if (this.balance || 0 > 0) {
      document.querySelectorAll(".hideBalanceNotNull").forEach((elm) => {
        elm.classList.add("hide");
        document.querySelectorAll(".hideBalanceNull").forEach((elm) => {
          elm.classList.remove("hide");
        });
      });
    } else {
      document.querySelectorAll(".hideBalanceNull").forEach((elm) => {
        elm.classList.add("hide");
        document.querySelectorAll(".hideBalanceNotNull").forEach((elm) => {
          elm.classList.remove("hide");
        });
      });
    }
  },
  setImg: function (selector, value) {
    document.querySelectorAll(`${selector} img`).forEach((elm) => {
      elm.setAttribute("src", value);
    });
    document.querySelectorAll(`${selector} source`).forEach((elm) => {
      elm.setAttribute("srcset", value);
    });
  },
  setSelectorValues: function (selector, value) {
    document.querySelectorAll(selector).forEach((elm) => {
      elm.textContent = value;
    });
  },
  render: function () {
    this.insertValues();
    if (!this.params.length) {
      document.querySelectorAll("#tabList__Count").forEach((elm) => {
        elm.setHTML("0");
      });
    } else {
      this.params.forEach((elm) => {
        elm.render();
      });
    }
  },
};

window.otherUserList = [];
const otherUser = {
  tgName: "none",
  userImg: "./img/header/profile.svg",
  uniqueId: 0,
  token: "",
  socialRole: { name: "none", count: 0 },
  params: [],
  tabListsTemplate: "otherUser",
  __constr: function (tgName, socialRole, params, id, userImg, token) {
    const otherUser = Object.assign({}, this);
    otherUser.__set(tgName, socialRole, params, id, userImg, token);
    window.otherUserList.push(otherUser);
    return otherUser;
  },
  __set: function (tgName, socialRole, params, id, userImg, token) {
    this.tgName = tgName;
    this.socialRole = socialRole;
    this.setParams(
      params || [
        ["Characters"],
        ["Skills"],
        ["Vices"],
        ["Morality"],
        ["Attitude"],
        ["Emotions"],
      ]
    );
    this.uniqueId = id || 0;
    this.userImg = userImg || this.userImg;
    this.token = token || this.token;
  },
  setParams: function (value = null) {
    this.params = [];
    value.forEach((elm) => {
      const [id, type, allType] = elm;
      this.params.push(UserParams.__constr(id, type, allType));
    });
  },
  setImg: function (selector, value) {
    document.querySelectorAll(`${selector} img`).forEach((elm) => {
      elm.setAttribute("src", value);
    });
    document.querySelectorAll(`${selector} source`).forEach((elm) => {
      elm.setAttribute("srcset", value);
    });
  },
  tabListRender: function () {
    if ("content" in document.createElement("template")) {
      let template = document.querySelector(
        `#tabListsTemplate__${this.tabListsTemplate}`
      );
      if (!template) {
        return;
      }
      let clone = template.content.cloneNode(true);
      clone.querySelector(".user__name").prepend(this.tgName);
      clone
        .querySelector(".user__value")
        .setHTML(
          `${this.socialRole?.name || "none"} (${this.socialRole?.count || 0})`
        );
      clone.querySelectorAll(".user__action .list li").forEach((elm) => {
        elm.setAttribute("user_id", this.uniqueId);
        if (elm.getAttribute("href") == "#Thank" && !this.token) {
          elm.setAttribute("href", "#ThankNo");
        }
      });

      document
        .querySelector(`#SocialTies.tabList .field__list `)
        .prepend(clone);

      let count =
        +document
          .querySelector(`#SocialTies.tabList #tabList__Count`)
          .getInnerHTML() || 0;
      document
        .querySelector(`#SocialTies.tabList #tabList__Count`)
        .setHTML(count + 1);
    } else {
      console.error("template не поддерживается");
    }
  },
  popupDescribeRender: function () {
    this.params.forEach((elm) => {
      elm.popupDescribeRender();
    });
    document.querySelector(`.popup_Describe .__UserName`).setHTML(this.tgName);
    this.setImg(".popup_Describe .Describe__photo", this.userImg);
  },
  popupChangeTheTiesRender: function () {
    document
      .querySelector(".popup_ChangeTheTies .__User_Name")
      .setHTML(this.tgName);
    this.setImg(".popup_ChangeTheTies .ChangeTheTies__photo", this.userImg);
  },
  popupThankRender: function () {
    document.querySelector(".popup_Thank .__User_Name").setHTML(this.tgName);
    this.setImg(".popup_Thank .Thank__photo", this.userImg);
  },
  popupThankNoRender: function () {
    document
      .querySelector(".popup_ThankNo .data__info")
      .setAttribute("copy", User.token);
  },
  render: function () {
    this.tabListRender();
  },
};

const otherUsers = {
  __constr: function (otherUsers) {
    window.otherUserList = [];
    otherUsers.forEach((user, key) => {
      const { tgName, socialRole, userImg, UserParams: params, token } = user;
      otherUser.__constr(tgName, socialRole, params, key, userImg, token);
    });

    return otherUserList;
  },
  render: function () {
    (
      document.querySelectorAll(
        "#SocialTies.tabList .field__list>.user__select"
      ) || []
    ).forEach((elm) => {
      elm.remove();
    });
    document.querySelector("#SocialTies.tabList #tabList__Count")?.setHTML(0);
    otherUserList.forEach((user) => {
      user.render();
    });
    telegramUserTabList.bindAction();
  },
};
