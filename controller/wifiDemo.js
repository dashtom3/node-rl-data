'use strict';

import DataModel from '../models/wifidemo'
import formidable from 'formidable'
import dtime from 'time-formater'

class Data  {
	constructor(){
        this.collectData = this.collectData.bind(this)
	}
	async collectData(req, res, next){
        const {id,from_time,to_time} = req.query

			// console.log(data)
			try{
                const data = await DataModel.find({id:id}).sort({time:-1}).limit(30)
                // const data = await DataModel.find({id:id,time:{ $gte : dtime(from_time).format('YYYY-MM-DD HH:mm:ss'), $lte : dtime(to_time).format('YYYY-MM-DD HH:mm:ss') }}).sort({time:-1}).limit(30)
				// console.log(data)
				res.send({
					status: 1,
					data: data,
				})
			}catch(err){
				res.send({
					status: 0,
					message: 0,
				})
			}
		
    }
}
export default new Data()