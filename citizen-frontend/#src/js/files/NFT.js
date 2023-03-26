const NFT = {
  domain: CONST.DOMAIN,
  userId: '',
  nft: {},
  url: '',
  nftAddress: '',
  owner: '',
  needUpdate: true,
  admin: false,
  change: false,
  characteristics: [
    'Attitude',
    'Vices',
    'Characters',
    'Emotions',
    'Morality',
    'Attitude',
    'Skills',
    'Social ties',
    'Action Points',
    'Thanks'
  ],
  __constr: async function (userId = '') {
    const clone = deepClone(this);
    clone.userId = userId;
    if (!clone.userId) {
      let params = new URLSearchParams(window.location.search);
      clone.url = params.get("content");
      clone.nftAddress = params.get("nft_address");
      clone.owner = params.get("owner");
      if (clone.url && clone.nftAddress && clone.owner) {
        clone.admin = true;
      }
    }
    await clone.get();
    return clone;
  },
  getInfo: async function () {
    let res = JSON.parse(await $.get(`${this.domain}/api/v1/getNFT/${this.userId}`)) || '';
    if ($.isEmptyObject(res)) {
      console.error('empty response')
      return;
    }
    this.url = res?.content?.URI;
    this.owner = res?.owner;
    this.nftAddress = res?.nft_address;
  },
  get: async function () {
    if (!this.needUpdate) {
      return this.nft;
    }
    try {
      if (!(this.url && this.owner )) {
        await this.getInfo()
      }

      this.nft = await $.get(`https://arweave.net/${this.url}`) || {};
      this.needUpdate = false;
      return this.nft;
    } catch (error) {
      console.trace(error);
    } finally {
      this.needUpdate = false;
      return this.nft;
    }
  },
  getAttributes: async function () {
    await this.get();
    return this.nft?.attributes || [];
  },
  set: async function (AttrName, AttrValue) {
    if (!this.characteristics.includes(AttrName)) {
      // убрать
      const attr = await this.getAttributes() || [];
      const { key: search } = await this.search(AttrName);
      if (!Array.isArray(attr[search].value)) {
        attr[search].value = AttrValue;
      } else if (Array.isArray(attr[search].value) && AttrName === 'Action Points') {
        attr[search].value = AttrValue;
      } else if (Array.isArray(attr[search].value)) {
        console.log(attr[search].value);
        attr[search].value[0] = Object.assign(AttrValue, attr[search].value[0] || {});
        console.log(attr[search].value);
      }
    } else {
      if (Array.isArray(this.nft[AttrName])) {
        this.nft[AttrName].push(...AttrValue);
      } else if (this.nft[AttrName] && typeof this.nft[AttrName] === 'object') {
        this.nft[AttrName] = Object.assign({}, AttrValue, this.nft[AttrName]);
      } else {
        this.nft[AttrName] = AttrValue;
      }
    }
    this.change = true;
    return this.nft;
  },
  update: async function (AttrName, AttrValue) {
    if (!this.characteristics.includes(AttrName)) {
      // убрать
      const attr = await this.getAttributes() || [];
      const { key: search } = await this.search(AttrName);
      if (!Array.isArray(attr[search].value)) {
        attr[search].value = AttrValue;
      } else if (Array.isArray(attr[search].value) && AttrName === 'Action Points') {
        attr[search].value = AttrValue;
      } else if (Array.isArray(attr[search].value)) {
        console.log(attr[search].value);
        attr[search].value[0] = Object.assign( attr[search].value[0] || {}, AttrValue);
        console.log(attr[search].value);
      }
    } else {
      if (Array.isArray(this.nft[AttrName])) {
        this.nft[AttrName].push(...AttrValue);
      } else if (this.nft[AttrName] && typeof this.nft[AttrName] === 'object') {
        this.nft[AttrName] = Object.assign({}, this.nft[AttrName], AttrValue);
      } else {
        this.nft[AttrName] = AttrValue;
      }
    }
    this.change = true;
    return this.nft;
  },
  search: async function (AttrName) {
    
    if (!this.characteristics.includes(AttrName)) {
      const attr = await this.getAttributes() || [];
      const search = attr.findIndex((elm) => {
        if (elm.trait_type === AttrName) {
          return true;
        }
      });
      
      return {value:attr[search]?.value, key:search};
    }
    return {value: this.nft[AttrName], key:AttrName}

  },
  updatePoints: async function () {
    const timeNow = new Date();
    const { value: valueReg } = (await this.search('Date of issue'))||{};
    if (!valueReg) {
      return false;
    }
    const arrReg = valueReg?.split('.');
    const timeReg = new Date(arrReg[2], arrReg[1] - 1, arrReg[0]);
    const passedTime = timeNow - timeReg;
    const passedWeeks = Math.round(passedTime / 86400000/7);
    const otherUserCount = (await this.search('Social ties')).value || [];
    if (passedWeeks && Math.trunc(otherUserCount.length/12) > 0) {
      const r = {
        'Citizen': 1,
        'Sponsor': 2,
        'Micenatus': 4,
      };
      const rate = (await this.search('Rate')).value || 'Citizen';
      const actionPoints = (await this.search('Action Points')).value || [0,0];
      const points = (passedWeeks-actionPoints[1]) * r[rate] * Math.trunc(otherUserCount.length/12);
      this.set('Action Points',[Math.round(points+actionPoints[0]),passedWeeks])
      return true;
    }
    return false
  },
  save: async function () {
    if (!this.nftAddress || !this.change) {
      return;
    }
    return await $.post(`${this.domain}/api/v1/editNFT`, JSON.stringify(
      {
        "address": this.nftAddress || 'none',
        "content": this.nft
      }
    ));
  }
}