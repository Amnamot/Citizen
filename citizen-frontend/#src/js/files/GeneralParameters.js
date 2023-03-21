//start получение глобальных параметров
const GeneralParameters = {
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
  domain: CONST.DOMAIN,
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
