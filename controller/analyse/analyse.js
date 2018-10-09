'use strict';

import DataModel from '../../models/data'

class Analyse{
    constructor() {
        this.getData()
    }
    async getData(){
      console.log('111')
      const data = await DataModel.findOne({})
      console.log(data)
    }
    
    
}
export default Analyse
  