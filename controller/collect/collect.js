'use strict';

import DataModel from '../../models/data' //wifi(旧)
import TestModel from '../../models/test' //摄像头(旧)

import DswifiModel from '../../models/data/dswifi'
import HkrlModel from '../../models/data/hkrl'
import formidable from 'formidable'
import dtime from 'time-formater'
// import DataDSWIFI from '../../models/'
class Collect  {
	constructor(){
		this.collectWifi = this.collectWifi.bind(this)//旧
		this.collectData = this.collectData.bind(this)//旧

		this.collectDSWIFI = this.collectDSWIFI.bind(this)
		this.collectHKRL = this.collectHKRL.bind(this)
	}
	async collectWifi(req, res, next){//wifi数据收集(旧)
        const {id} = req.params
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const {data} = fields;
			// console.log(data)
			try{
                DataModel.create({id:id,time:dtime(new Date()).format('YYYY-MM-DD HH:mm:ss'),data:data})
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
	async collectData(req, res, next){//摄像头数据收集(旧)
		let starttime = dtime(req.body.eventnotificationalert.peoplecounting.timerange.starttime).format('YYYY-MM-DD HH:mm:ss')
		let endtime = dtime(req.body.eventnotificationalert.peoplecounting.timerange.endtime).format('YYYY-MM-DD HH:mm:ss')
		// console.log(starttime,endtime)
		let enter = req.body.eventnotificationalert.peoplecounting.enter
		let exit = req.body.eventnotificationalert.peoplecounting.exit
		let pass = req.body.eventnotificationalert.peoplecounting.pass
		const {id} = req.params
		try{
			HkrlModel.create({id:id,start_time:starttime,end_time:endtime,enter:enter,exit,pass})
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
    async collectHKRL(){
        let starttime = dtime(req.body.eventnotificationalert.peoplecounting.timerange.starttime).format('YYYY-MM-DD HH:mm:ss')
		let endtime = dtime(req.body.eventnotificationalert.peoplecounting.timerange.endtime).format('YYYY-MM-DD HH:mm:ss')
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
	async collectDSWIFI(req, res, next){
        const {id} = req.params
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const {data} = fields;
			// console.log(data)
			try{
                DswifiModel.create({id:id,time:dtime(new Date()).format('YYYY-MM-DD HH:mm:ss'),data:data})
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