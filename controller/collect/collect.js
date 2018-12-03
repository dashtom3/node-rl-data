'use strict';

import DataModel from '../models/data'
import formidable from 'formidable'
import dtime from 'time-formater'
import DataDSWIFI from '../../models/'
class Collect  {
	constructor(){
        this.collectData = this.collectData.bind(this)
    }
    async collectDSWIFI(){
        let starttime = dtime(req.body.eventnotificationalert.peoplecounting.timerange.starttime).format('YYYY-MM-DD HH:mm:ss')
		let endtime = dtime(req.body.eventnotificationalert.peoplecounting.timerange.endtime).format('YYYY-MM-DD HH:mm:ss')
		// console.log(starttime,endtime)
		let enter = req.body.eventnotificationalert.peoplecounting.enter
		let exit = req.body.eventnotificationalert.peoplecounting.exit
		let pass = req.body.eventnotificationalert.peoplecounting.pass
		const {id} = req.params
		try{
			TestModel.create({id:id,start_time:starttime,end_time:endtime,enter:enter,exit,pass})
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
    }
	async collectHKRL(req, res, next){
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
export default new Collect()