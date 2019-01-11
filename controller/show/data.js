'use strict';

import formidable from 'formidable'
import dtime from 'time-formater'
import axios from 'axios'
import qs from 'qs'
import hkrl from '../analyse/hkrl'
import hkdl from '../analyse/hkdl'
import hkrq from '../analyse/hkrq'
import dxmrl from '../analyse/dxmrl'
class Data  {
	constructor(){
		this.getDataRLByHour = this.getDataRLByHour.bind(this)
		this.getDataRLByDay = this.getDataRLByDay.bind(this)
		//海康热区
		this.getDataRQByHour = this.getDataRQByHour.bind(this)
		this.getDataRQByDay = this.getDataRQByDay.bind(this)
		this.getDataRQTotal = this.getDataRQTotal.bind(this)
		this.getDataRQEchartsByHour = this.getDataRQEchartsByHour.bind(this)
		this.getDataRQByOneDay = this.getDataRQByOneDay.bind(this)
		//店小喵人脸
		this.getDataDXMbyPeople = this.getDataDXMbyPeople.bind(this)
	}
	async getDataRQTotal(req, res, next) {//海康热区总览
		const { from_time, to_time } = req.query
		try {
			const resHKRQ = await hkrq.getRQbyAll(from_time,to_time)
			res.send({
				status: 1,
				data: resHKRQ
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	async getDataRQByOneDay(req, res, next){//海康热区实时(一天)
		try{
			const { time, staySecond } = req.query
			const resHKRQ = await hkrq.getDataRQByOneDay(time, staySecond)
			res.send({
				status:1,
				data:resHKRQ.data
			})
		}catch(err){
			res.send({
				status:0,
				message:'获取数据失败'
			})
		}
		
	}
	async getDataRQByHour(req, res, next) { //海康热区数据接口(按小时查询)
		const { from_time, to_time, staySecond } = req.query
		try {
			const resHKRQ = await hkrq.getRQbyHour(from_time,to_time,staySecond)
			res.send({
				status: 1,
				data: resHKRQ
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	async getDataRQEchartsByHour(req, res, next) { //海康热区数据接口(分时段echarts数据)
		const { from_time, to_time, staySecond } = req.query
		try {
			const resHKRQ = await hkrq.getRQechatrsByHour(from_time, to_time, staySecond)
			res.send({
				status: 1,
				data: resHKRQ
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}

	async getDataRQByDay(req, res, next) { //海康热区数据接口(按天查询)
		const { from_time, to_time, staySecond } = req.query
		try {
			const resHKRQ = await hkrq.getDataRQByDay(from_time, to_time, staySecond)
			res.send({
				status: 1,
				data: resHKRQ
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	async getDataRLByHour(req, res, next) { 	//海康人流数据接口(按小时查询)
		const { id, from_time, to_time } = req.query;
		try {
			const resHKRL = await hkrl.getDataRLByHour(id, from_time, to_time)
			res.send({
				status: 1,
				data: resHKRL
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	async getDataRLByDay(req, res, next) { //海康人流数据接口(按天查询)
		const { id, from_time, to_time } = req.query;
		try {
			const resHKRL = await hkrl.getDataRLByDay(id, from_time, to_time)
			res.send({
				status: 1,
				data: resHKRL
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	async getDataDL(req, res, next) { //逗留时长接口
		const { id } = req.params
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const { data } = fields;
			console.log(data)
			try {
				DataModel.create({ id: id, data: data })
				res.send({
					status: 1,
					message: 1,
				})
			} catch (err) {
				res.send({
					status: 0,
					message: 0,
				})
			}
		})
	}
	//店小喵判断设备是否在线接口 
	async getDXMDeviceIsOnline(req,res,next){
		try{
			const resDXMRL = await dxmrl.getDeviceIsOnline()
			res.send({
				status:1,
				data:resDXMRL.resData
			})
		}catch(err){
			console.log(err)
			res.send({
				status:0,
				message:'获取数据失败'
			})
		}
	}
	//店小喵客群分析接口 
	async getDataDXMbyPeople(req,res,next){
		try{
			const {from_time,to_time,type} = req.query
			const resDXMRL = await dxmrl.getDataDXMbyPeople(from_time,to_time,type)
			res.send({
				status:1,
				data:resDXMRL.resData
			})
		}catch(err){
			console.log(err)
			res.send({
				status:0,
				message:'获取数据失败'
			})
		}
	}
	//店小喵详细的客群分析 //type
	async getDataDXMbyDetail(req,res,next){
		try{
			const {from_time,to_time,type} = req.query
			const resDXMRL = await dxmrl.getDataDXMbyDetail(from_time,to_time,type)
			res.send({
				status:1,
				data:resDXMRL.resData
			})
		}catch(err){
			console.log(err)
			res.send({
				status:0,
				message:'获取数据失败'
			})
		}
	}
	//店小喵客流趋势接口 
	async getDataDXMByFlowTrend(req,res,next){
		try{
			const resDXMRL = await dxmrl.getDataDXMByFlowTrend()
			res.send({
				status:1,
				data:resDXMRL.resData
			})
		}catch(err){
			console.log(err)
			res.send({
				status:0,
				message:'获取数据失败'
			})
		}
	}

	// from_time: 起始日期'2018-12-20', to_time:结束日期'2018-12-29', from_hour:起始时间点'5',hours:小时数'24' 
	async getDataHKDLByDay(req, res, next){ //逗留时长接口
        // const {id} = req.params
		const {from_time,to_time,from_hour,hours} = req.query
		console.log(req.query)
		try {
			const resHKDL = await hkdl.getDLByDay(from_time,to_time,from_hour,parseInt(hours))
			res.send({
				status:1,
				data:resHKDL
			})
		} catch (error) {
			console.log(error)
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	// from_time: 起始日期'2018-12-20', to_time:结束日期'2018-12-29', type 0 包含
	async getDataHKDLByHour(req, res, next){ //逗留时长接口
        
        // const {id} = req.params
		const {from_time,to_time,type} = req.query
		try {
			const resHKDL = await hkdl.getDLByDay(from_time,to_time,type)
			res.send({
				status:1,
				data:resHKDL
			})
		} catch (error) {
			console.log(error)
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
    }
}
export default new Data()