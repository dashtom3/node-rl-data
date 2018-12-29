'use strict';

// import DataModel from '../../models/data'
import HkrlModel from '../../models/data/hkrl'
import formidable from 'formidable'
import dtime from 'time-formater'
import hkdl from '../analyse/hkdl'
class Data  {
	constructor(){
		this.getDataRLByhour = this.getDataRLByhour.bind(this)
		this.getDataRLByday = this.getDataRLByday.bind(this)
        // this.collectData = this.collectData.bind(this)
    }
    async getDataRLByhour(req, res, next){ 	//人流数据接口(按小时查询)
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
				{ $group: { _id: "$daytime", enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" }, start_time: { $first:  {$substr: ["$start_time", 0, 16]} }, end_time: { $last:  {$substr: ["$end_time", 0, 16]} } } },
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
			var timeArr = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
			var cameraData = []

			var data = {}; 
			for(var i = 0; i < constNum.length; i++) {
				if(!data[dtime(constNum[i].start_time).format('YYYY-MM-DD')]) {
					var arr = [];
					arr.push(constNum[i]);
					data[dtime(constNum[i].start_time).format('YYYY-MM-DD')] = arr;
				}else {
					data[dtime(constNum[i].start_time).format('YYYY-MM-DD')].push(constNum[i])
				}
			}
 

			for(var m in data){
				for(var i = 0; i < timeArr.length; i++){
					var num = timeArr[i];
					var isExist = false;
					for(var j = 0; j < data[m].length; j++){
						var n = dtime(data[m][j].start_time).format('HH');
						if(n == num){
							cameraData.push(
								{
								start_time: m +' '+n + ':00',
								end_time:Number(n)>=9 ?( m +' '+(Number(n)+1) + ':00') : m +' 0'+(Number(n)+1) + ':00',
								enter: data[m][j].enter,
								exit: data[m][j].exit
								}
							)
							isExist = true;
							break;
						}
					}
					if(!isExist){
						cameraData.push(
							{
							start_time: m +' '+ num + ':00',
							end_time:Number(num)>=9 ? (m+' '+ (Number(num)+1) + ':00') : m+' 0'+(Number(num)+1) + ':00',
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
	async getDataRLByday(req, res, next){ //人流数据接口(按天查询)
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