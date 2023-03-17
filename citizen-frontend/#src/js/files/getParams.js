// Получение данных

//start получение глобальных параметров
const generalParameters = {
  params: {
    Vices: {
      id: 'Vices',
      inputType:'select',
    },
    Characters: {
      id: 'Characters',
      inputType:'select',
    },
    Emotions: {
      id: 'Emotions',
      inputType:'select',
    },
    Morality: {
      id: 'Morality',
      inputType: 'select',
      key:'moralities'
    },
    Attitude: {
      id: 'Attitude',
      inputType: 'select',
      key:'attitudes'
    },
    Skills: {
      id: 'Skills',
      inputType: 'input',
    }
  },
  domain: 'http://80.87.110.6',
  /**
   * 
   * @param {*} parameter 
   * @returns {Promise} 
   */
  getValues: async function () {
    
    try {
      values = JSON.parse(await $.get(`${this.domain}/api/v1/data`))||[];
    } catch (error) {
      console.trace(error);
    }
    return values;
  },
  setInInput: async function () {
    const values = await this.getValues();
    const generalParameters = []
    Object.values(this.params).forEach((value) => {
      userListParams.__constr(value.id, values[(value.key ? value.key.toLowerCase() : value.id.toLowerCase())], value.inputType).render();
      generalParameters.push({id: value.id, values: values[(value.key ? value.key.toLowerCase() : value.id.toLowerCase())], inputType: value.inputType})
    });
    return generalParameters;
  }
}
//end получение глобальных параметров

//start получение NFT
const NFT = {
  domain: 'http://80.87.110.6',
  userId: '',
  nft: {},
  __constr: function (userId) {
    this.userId = userId;
    return Object.assign({},this)
  },
  get: async function () {
    if (!$.isEmptyObject(this.nft)) {
      return this.nft;
    }
    try {
      let url = JSON.parse(await $.get(`${this.domain}/api/v1/getNFT/${this.userId}`)).URI || '';
      if (!url) {
        console.error('empty response')
        return;
      }
      this.nft = await $.get(`https://arweave.net/${url}`) || {};
      return this.nft;
    } catch (error) {
      console.trace(error);
    } finally {
      return this.nft;
    }
  },
  getAttributes: async function () {
    await this.get();
    return this.nft?.attributes || [];
  },
  set: async function (AttrName, AttrValue) {
    const attr = await this.getAttributes() || [];
    const { key: search } = await this.search(AttrName);
    if (!Array.isArray(attr[search].value)) {
      attr[search].value = AttrValue;
    }else if(Array.isArray(attr[search].value) && AttrName === 'Action Points') {
      attr[search].value = AttrValue;
    } else if(Array.isArray(attr[search].value)  && AttrName === 'Social ties') {
      console.log(attr[search].value);
      attr[search].value.push(AttrValue);
    } else if (Array.isArray(attr[search].value)) {
      console.log(attr[search].value);
      attr[search].value[0] = Object.assign(attr[search].value[0] || {}, AttrValue);
      console.log(attr[search].value);
    }
    
    return this.nft;
  },
  search: async function (AttrName) {
    const attr = await this.getAttributes() || [];
    const search = attr.findIndex((elm) => {
      if (elm.trait_type === AttrName) {
        return true;
      }
    });
    
    return {value:attr[search].value, key:search};
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
    const passedWeeks = Math.round(passedTime / 86400000*10);
    const otherUserCount = (await this.search('Social ties')).value || [];
    if (passedWeeks) {
      const r = {
        'Citizen': 1,
        'Sponsor': 2,
        'Micenatus': 4,
      };
      const rate = (await this.search('Rate')).value || 'Citizen';
      const actionPoints = (await this.search('Action Points')).value || [];
      const points = (passedWeeks-actionPoints[1]) * r[rate] * Math.round(otherUserCount.length/12);
      this.set('Action Points',[Math.round(points),passedWeeks])
      return true;
    }
    return false
  },
  save: async function () {
    return await $.post(`${this.domain}/api/v1/editNFT`,
      {
        "address": this?.address,
        "content": this.nft
      }
    );
  }
}
//end получение NFT