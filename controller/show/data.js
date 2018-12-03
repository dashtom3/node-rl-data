'use strict';

import DataModel from '../../models/data'
import formidable from 'formidable'
import dtime from 'time-formater'

class Data  {
	constructor(){
        this.collectData = this.collectData.bind(this)
    }
    async getDataRL(){ 	//人流数据接口
        
    }
	async getDataDL(req, res, next){ //逗留时长接口
        const {id} = req.params
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const {data} = fields;
			console.log(data)
			try{
                DataModel.create({id:id,data:data})
                res.send({
					status: 1,
					message: 1,
				})
			}catch(err){
				res.send({
					status: 0,
					message: 0,
				})
			}
		})
    }
}
export default new Data()