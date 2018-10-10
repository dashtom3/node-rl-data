'use strict';

import DataModel from '../../models/data'

class Test{
    constructor() {
        this.doTest()
    }

    async doTest(){
        // setInterval(function(){
            
        // },1000)
        const data = await DataModel.findOne({})
        let lastdata = JSON.parse(data.data)
        console.log(lastdata)

    }
    
}
export default Test
  