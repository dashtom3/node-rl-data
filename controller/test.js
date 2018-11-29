'use strict';

import TestModel from '../models/test'
import formidable from 'formidable'
import dtime from 'time-formater'
import querystring from 'querystring'
import data from './data';
class Data  {
	constructor(){
		this.collectData = this.collectData.bind(this)
	}
	async collectData(req, res, next){
		// console.log(req.body)
		// console.log(data)
		// console.log(req.body.eventnotificationalert.peoplecounting.timerange)
		// console.log(req.body.eventnotificationalert.peoplecounting.enter)
		// console.log(req.body.eventnotificationalert.peoplecounting.timerange.endtime)
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
}
export default new Data()