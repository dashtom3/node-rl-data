'use strict';

import HKrqModel from '../../models/data/hkrq'
import HkrlModel from '../../models/data/hkrl'
import formidable from 'formidable'
import dtime from 'time-formater'
import axios from 'axios'
import qs from 'qs'
class Data {
	constructor() {
		//海康人流
		this.getDataRLByhour = this.getDataRLByhour.bind(this)
		this.getDataRLByday = this.getDataRLByday.bind(this)
		//海康热区
		this.getDataRQByhour = this.getDataRQByhour.bind(this)
		this.getDataRQByday = this.getDataRQByday.bind(this)
		this.getDataRQTotal = this.getDataRQTotal.bind(this)
		this.getDataRQEchartsByhour = this.getDataRQEchartsByhour.bind(this)
		//店小喵人脸
		this.getDataDXMbyPeople = this.getDataDXMbyPeople.bind(this)
	}
	async getDataRQTotal(req, res, next) {//海康热区总览
		const { from_time, to_time } = req.query
		try {
			const constNum = await HKrqModel.find({ start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm'), $lte: dtime(to_time).format('YYYY-MM-DD HH:mm') } }).sort({ start_time: 1 })
			var data = {};
			for (var i = 0; i < constNum.length; i++) {
				var stay = constNum[i].staySecond
				if (!data[stay]) {
					var arr = [];
					arr.push(constNum[i]);
					data[stay] = arr;
				} else {
					data[stay].push(constNum[i])
				}
			}

			for (var m in data) {
				var data1 = {}
				for (var k of data[m]) {
					if (!data1[k.areaName]) {
						var arr1 = [];
						arr1.push(k);
						data1[k.areaName] = arr1;
						data[m] = data1
					} else {
						data1[k.areaName].push(k)
						data[m] = data1
					}
				}
			}
			var tempData = []
			for (var n in data) {
				for (var o in data[n]) {
					var totalNum = 0
					var stayTime = null
					for (var p of data[n][o]) {
						stayTime = p.staySecond
						totalNum = totalNum + p.stayPeopleCount
					}
					tempData.push({ areaName: o, name: n + '秒以上', stayPeopleCount: totalNum, staySecond: stayTime })
				}
			}
			res.send({
				status: 1,
				data: tempData
			})
		} catch (err) {

		}
	}
	async getDataRQByhour(req, res, next) { //海康热区数据接口(按小时查询)
		const { from_time, to_time, staySecond } = req.query
		try {
			const constNum = await HKrqModel.find({ staySecond: staySecond, start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm'), $lte: dtime(to_time).format('YYYY-MM-DD HH:mm') } }).sort({ start_time: 1 })
			var data = {}, dateCount = {}
			for (var i = 0; i < constNum.length; i++) {
				dateCount[dtime(constNum[i].start_time).format('YYYY-MM-DD')] = 1
				var time = dtime(constNum[i].start_time).format('HH:mm')
				if (time >= dtime(from_time).format('HH:mm') && time <= dtime(to_time).format('HH:mm')) {
					if (!data[time]) {
						var arr = [];
						arr.push(constNum[i]);
						data[time] = arr;
					} else {
						data[time].push(constNum[i])
					}
				}
			}
			var timeCount = []
			for (var d in dateCount) {
				timeCount.push(d)
			}
			for (var m in data) {
				var data1 = {}
				for (var k of data[m]) {
					if (!data1[k.areaName]) {
						var arr1 = [];
						arr1.push(k);
						data1[k.areaName] = arr1;
						data[m] = data1
					} else {
						data1[k.areaName].push(k)
						data[m] = data1
					}
				}
			}
			var tempData = []
			for (var n in data) {
				for (var o in data[n]) {
					var totalNum = 0
					var stayTime = null
					for (var p of data[n][o]) {
						stayTime = p.staySecond
						totalNum = totalNum + p.stayPeopleCount
					}
					totalNum = (totalNum / timeCount.length).toFixed(0)
					tempData.push({ areaName: o, time: n, stayPeopleCount: totalNum, staySecond: stayTime })
				}
			}

			res.send({
				status: 1,
				data: tempData
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '请求数据错误'
			})
		}
	}
	async getDataRQEchartsByhour(req, res, next) { //海康热区数据接口(分时段echarts数据)
		const { from_time, to_time, staySecond } = req.query
		try {
			const constNum = await HKrqModel.find({ staySecond: staySecond, start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm'), $lte: dtime(to_time).format('YYYY-MM-DD HH:mm') } }).sort({ start_time: 1 })
			var weekday = [], unweekday = []
			constNum.forEach(item => {
				var date = dtime(item.start_time).format('YYYY-MM-DD')
				if (dtime(date).format('d') == 6 || dtime(date).format('d') == 0) {
					unweekday.push(item)
				} else {
					weekday.push(item)
				}
			})

			//工作日
			var data = {};
			for (var i = 0; i < weekday.length; i++) {
				if (!data[weekday[i].areaName]) {
					var arr = [];
					arr.push(weekday[i]);
					data[weekday[i].areaName] = arr;
				} else {
					data[weekday[i].areaName].push(weekday[i])
				}
			}

			for (var m in data) {
				var data1 = {}
				for (var k of data[m]) {
					var time = dtime(k.start_time).format('HH:mm')
					if (time >= dtime(from_time).format('HH:mm') && time <= dtime(to_time).format('HH:mm')) {
						if (!data1[time]) {
							var arr1 = [];
							arr1.push(k);
							data1[time] = arr1;
							data[m] = data1
						} else {
							data1[time].push(k)
							data[m] = data1
						}
					}
				}
			}
			var hourData = []
			for (var m in data) {

				var dataTemp = []
				for (var k in data[m]) {
					var finalDataTemp = {};
					var stayTotal = 0
					for (var o of data[m][k]) {
						stayTotal = stayTotal + o.stayPeopleCount
					}
					dataTemp.push((stayTotal / data[m][k].length).toFixed(0))
					finalDataTemp[m] = dataTemp
				}
				hourData.push(finalDataTemp)
			}


			//非工作日
			var undata = {};
			for (var i = 0; i < unweekday.length; i++) {
				if (!undata[unweekday[i].areaName]) {
					var arr = [];
					arr.push(unweekday[i]);
					undata[unweekday[i].areaName] = arr;
				} else {
					undata[unweekday[i].areaName].push(unweekday[i])
				}
			}

			for (var m in undata) {
				var data1 = {}
				for (var k of undata[m]) {
					var time = dtime(k.start_time).format('HH:mm')
					if (time >= dtime(from_time).format('HH:mm') && time <= dtime(to_time).format('HH:mm')) {
						if (!data1[time]) {
							var arr1 = [];
							arr1.push(k);
							data1[time] = arr1;
							undata[m] = data1
						} else {
							data1[time].push(k)
							undata[m] = data1
						}
					}

				}
			}

			var unhourData = []
			for (var m in undata) {
				var dateTemp = []
				for (var k in undata[m]) {
					var finalDataTemp = {};
					var stayTotal = 0
					for (var o of undata[m][k]) {
						stayTotal = stayTotal + o.stayPeopleCount
					}
					dateTemp.push((stayTotal / data[m][k].length).toFixed(0))
					finalDataTemp[m] = dateTemp
				}
				unhourData.push(finalDataTemp)
			}

			res.send({
				status: 1,
				data: { weekday: hourData, unweekday: unhourData }
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '请求数据错误'
			})
		}
	}
	async getDataRQByday(req, res, next) { //海康热区数据接口(按天查询)
		const { from_time, to_time, staySecond } = req.query
		try {
			const constNum = await HKrqModel.find({ staySecond: staySecond, start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm'), $lte: dtime(to_time).format('YYYY-MM-DD HH:mm') } }).sort({ start_time: 1 })
			var data = {};
			for (var i = 0; i < constNum.length; i++) {
				if (!data[constNum[i].areaName]) {
					var arr = [];
					arr.push(constNum[i]);
					data[constNum[i].areaName] = arr;
				} else {
					data[constNum[i].areaName].push(constNum[i])
				}
			}
			for (var m in data) {
				var data1 = {}
				for (var k of data[m]) {
					var limtTime = dtime(k.start_time).format('HH:mm')
					if (limtTime >= dtime(from_time).format('HH:mm') && limtTime <= dtime(to_time).format('HH:mm')) {
						var date = dtime(k.start_time).format('YYYY-MM-DD')
						if (!data1[date]) {
							var arr1 = [];
							arr1.push(k);
							data1[date] = arr1;
							data[m] = data1
						} else {
							data1[date].push(k)
							data[m] = data1
						}
					}
				}
			}
			var tempData = []
			for (var n in data) {
				for (var o in data[n]) {
					var totalNum = 0
					var stayTime = null
					for (var p of data[n][o]) {
						stayTime = p.staySecond
						totalNum = totalNum + p.stayPeopleCount
					}
					tempData.push({ areaName: n, time: o, stayPeopleCount: totalNum, staySecond: stayTime })
				}
			}
			res.send({
				status: 1,
				data: tempData
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '请求数据错误'
			})
		}
	}
	async getDataRLByhour(req, res, next) { 	//海康人流数据接口(按小时查询)
		const { id, from_time, to_time } = req.query;
		try {
			const constNum = await HkrlModel.aggregate(
				{
					$match: {
						id: Number(id),
						start_time: { $gte: from_time, $lte: to_time }
					}
				},
				{
					$project: {
						start_time: 1,
						end_time: 1,
						daytime: { $substr: ["$start_time", 0, 13] },
						enter: 1,
						exit: 1,
						pass: 1
					}
				},
				{ $group: { _id: "$daytime", enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" }, start_time: { $first: { $substr: ["$start_time", 0, 16] } }, end_time: { $last: { $substr: ["$end_time", 0, 16] } } } },
				{
					$project: {
						_id: 0,
						start_time: 1,
						end_time: 1,
						enter: 1,
						exit: 1,
						pass: 1,
					}
				},
				{ $sort: { start_time: 1 } }
			)


			//数据处理
			var timeArr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
			var cameraData = []

			var data = {};
			for (var i = 0; i < constNum.length; i++) {
				if (!data[dtime(constNum[i].start_time).format('YYYY-MM-DD')]) {
					var arr = [];
					arr.push(constNum[i]);
					data[dtime(constNum[i].start_time).format('YYYY-MM-DD')] = arr;
				} else {
					data[dtime(constNum[i].start_time).format('YYYY-MM-DD')].push(constNum[i])
				}
			}


			for (var m in data) {
				for (var i = 0; i < timeArr.length; i++) {
					var num = timeArr[i];
					var isExist = false;
					for (var j = 0; j < data[m].length; j++) {
						var n = dtime(data[m][j].start_time).format('HH');
						if (n == num) {
							cameraData.push(
								{
									start_time: m + ' ' + n + ':00',
									end_time: Number(n) >= 9 ? (m + ' ' + (Number(n) + 1) + ':00') : m + ' 0' + (Number(n) + 1) + ':00',
									enter: data[m][j].enter,
									exit: data[m][j].exit
								}
							)
							isExist = true;
							break;
						}
					}
					if (!isExist) {
						cameraData.push(
							{
								start_time: m + ' ' + num + ':00',
								end_time: Number(num) >= 9 ? (m + ' ' + (Number(num) + 1) + ':00') : m + ' 0' + (Number(num) + 1) + ':00',
								enter: 0,
								exit: 0
							}
						)
					}
				}
			}

			const countTotal = await HkrlModel.aggregate(
				{ $match: { id: Number(id), start_time: { $gte: from_time, $lte: to_time } } },
				{ $project: { enter: 1, exit: 1, pass: 1 } },
				{ $group: { _id: null, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
				{ $project: { _id: 0, enter: 1, exit: 1, pass: 1 } },
			)
			res.send({
				status: 1,
				data: cameraData,
				total: countTotal
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	async getDataRLByday(req, res, next) { //海康人流数据接口(按天查询)
		const { id, from_time, to_time } = req.query;
		try {
			const dayDate = await HkrlModel.aggregate(
				{
					$match: {
						id: Number(id),
						start_time: { $gte: from_time, $lte: to_time }
					}
				},
				{
					$project: {
						start_time: 1,
						end_time: 1,
						daytime: { $substr: ["$start_time", 0, 10] },
						enter: 1,
						exit: 1,
						pass: 1
					}
				},
				{ $group: { _id: "$daytime", start_time: { $first: { $substr: ["$start_time", 0, 10] } }, end_time: { $last: { $substr: ["$end_time", 0, 10] } }, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
				{
					$project: {
						_id: 0,
						start_time: 1,
						end_time: 1,
						enter: 1,
						exit: 1,
						pass: 1,
					}
				},
				{ $sort: { start_time: 1 } }
			)
			const dayTotal = await HkrlModel.aggregate(
				{
					$match: {
						id: Number(id),
						start_time: { $gte: from_time, $lte: to_time }
					}
				},
				{ $project: { enter: 1, exit: 1, pass: 1 } },
				{ $group: { _id: null, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
				{ $project: { _id: 0, enter: 1, exit: 1, pass: 1 } },
			)
			res.send({
				status: 1,
				data: dayDate,
				total: dayTotal
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
	//店小喵客群分析接口 
	async getDataDXMbyPeople(req,res,next){
		try{
			const {from_time,to_time,type} = req.query
			const token = await this.getDXMToken()
			var data = {
				token:token.resData.mtk,
				from_time:dtime(from_time).format('YYYY-MM-DD'),
				to_time:dtime(to_time).format('YYYY-MM-DD'),
				type:type
			}
			const rateDate = await this.getDXMRateData(data)
			res.send({
				status:1,
				data:rateDate.resData
			})
		}catch(err){
			res.send({
				status:0,
				message:'获取数据失败'
			})
		}
	}
	//店小喵获取token(mtk)
	getDXMToken(){
		var tokendata = {
			account:"13918005963",
			pwd:"87b750fdfeb4468f58c3247b303704ab"
		}
		var	url ='https://retail.miniclouds.cn:58080/login/ajaxLogin';
		return new Promise((resolve, reject) => {
		axios({
			url: url,
			method: "POST",
			json: true,
			headers: {
				"content-type":"application/json",
			},
			data: tokendata
		}).then(res =>{
			resolve(res.data)
		}).catch(err =>{
			reject(err)
		})
	})
	}
	//店小喵客流和客群占比方法
	getDXMRateData(obj){
		var data = {
			refDto:{
				brandId:"40b23593d1c342d7a874fb53c42a72e9",
				shopId:"3049396f16b743eb815934bdbdefaca4"
			},
			beginTime:obj.from_time,
			endTime:obj.to_time,
			dimension:obj.type
		}
		var	url ='https://retail.miniclouds.cn:58002/agw/statisticsCtr/getRateInfoByDimension';
		return new Promise((resolve, reject) => {
		axios({
			url: url,
			method: "POST",
			json: true,
			headers: {
				"content-type":"application/json",
				"mtk":obj.token
			},
			data: data
		}).then(res =>{
			resolve(res.data)
		}).catch(err =>{
			reject(err)
		})
	})
	}
}
export default new Data()