'use strict';
import DswifiModel from '../../models/data/dswifi'
import HkrlModel from '../../models/data/hkrl'
import formidable from 'formidable'
import dtime from 'time-formater'
// import DataDSWIFI from '../../models/'
class Collect  {
	constructor(){
		this.collectDSWIFI = this.collectDSWIFI.bind(this)
		this.collectHKRL = this.collectHKRL.bind(this)
	}
    async collectHKRL(req, res, next){
        let starttime = dtime(req.body.eventnotificationalert.peoplecounting.timerange.starttime).format('YYYY-MM-DD HH:mm:ss')
		let endtime = dtime(req.body.eventnotificationalert.peoplecounting.timerange.endtime).format('YYYY-MM-DD HH:mm:ss')
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