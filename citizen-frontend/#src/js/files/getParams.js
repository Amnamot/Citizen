// Получение данных

//start получение глобальных параметров
const generalParameter = {
  param:{
    id: '',
    inputType: '',
    value: [],
  },
  domain: 'http://127.0.0.1:8000',
  /**
   * 
   * @param {string} id 
   * @param {string|'input'|'select'} inputType  
   * @returns {Promise}
   */
  __constr: async function(id,inputType, apiParam) {
    this.id = id;
    this.inputType = inputType;
    this.apiParam = apiParam?apiParam:id;
    this.value = await this.getValue();
    return { id, inputType, value: this.value };
  },
  getValue: async function () {
    const values = [];
    try {
      values = (await $.get(`${this.domain}/api/v1/${this.apiParam}`))||[];
    } catch (error) {
      console.trace(error);
    }
    return values;
  }
}

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
      api:'Moralitys'
    },
    Attitude: {
      id: 'Attitude',
      inputType: 'select',
      api:'Attitudes'
    },
    Skills: {
      id: 'Skills',
      inputType:'input',
    }
  },
  /**
   * 
   * @param {*} parameter 
   * @returns {Promise} 
   */
  getOne: async function (parameter) {
    if (!this.params[parameter]) {
      console.warn('empty: ' + parameter);
      return;
    }
    return generalParameter.__constr(this.params[parameter].id, this.params[parameter].inputType, this.params[parameter].api);
  },
  setInInput: async function () {
    const values = [];
    Object.keys(this.params).forEach((value) => {
      const res = this.getOne(value);
      values.push(res);
      res.then(value => {
        userListParams.__constr(value.id, value.value).render();
      });
    });
    return await Promise.all(values).then(value => {
      console.log('load generalParameter completed');
    }, error => {
      console.trace(error);
    });
  }
}
//end получение глобальных параметров
