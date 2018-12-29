'use strict';

import formidable from 'formidable'
import dtime from 'time-formater'

class Search {
	constructor() {
		this.searchData = this.searchData.bind(this)
		this.searchByHour = this.searchByHour.bind(this)
		this.searchByday = this.searchByday.bind(this)
	}
	async searchData(req, res, next) {
		const { id, from_time, to_time } = req.query;
		// console.log(from_time,dtime(from_time).format('YYYY-MM-DD HH:mm:ss'))
		try {
			const count = await SearchModel.find({ id: id, from_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm:ss') }, to_time: { $lte: dtime(to_time).format('YYYY-MM-DD HH:mm:ss') } }).count()
			res.send({
				status: 1,
				data: count,
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	async searchByHour(req, res, next) {
		const { id, from_time, to_time } = req.query;
		// console.log(id, from_time)
		try {
			const constNum = await SearchModel.aggregate(
				{
					$match: {
						from_time: { $gte: dtime(from_time).format('YYYY-MM-DD'), $lte: dtime(to_time).format('YYYY-MM-DD') }
					}},
					{   $project : {daytime : {$substr: ["$from_time", 11,2]},
						
				}},
					{   $group   : { _id : {date:"$daytime"}, count : { $sum : 1 }}},
					{   $project : {_id:0,date:"$_id.date",count: 1 }},  
					{ $sort: { date: 1 } }
			)
			// console.log(constNum)
			res.send({
				status: 1,
				data: constNum,
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	async searchByday(req, res, next) {
		const { id, from_time, to_time,type} = req.query;
		// console.log(id,type, from_time,to_time)
		let startIndex,endIndex;
		switch(type){
            case '1':
            startIndex = 11;
            endIndex = 2
            break;
            case '2':
            startIndex = 0;
            endIndex = 10
            break;
            case '3':
            startIndex = 8;
            endIndex = 2
            break;
            case '4':
            startIndex = 0;
            endIndex = 4
            break;
        }
		// console.log(dtime(from_time).format('YYYY-MM-DD'),dtime(to_time).format('YYYY-MM-DD') )
		try {
			const constNum = await SearchModel.aggregate(
				{
					$match: {
						from_time: { $gte: dtime(from_time).format('YYYY-MM-DD'), $lte: dtime(to_time).format('YYYY-MM-DD') }
					}},
					{   $project : {daytime : {$substr: ["$from_time", startIndex,endIndex]}
					
				}},
					{   $group   : { _id : "$daytime",  count : { $sum : 1 }}},
					{   $project : {_id:0,date:"$_id",count: 1 }},    
					{ $sort: { date: 1 } }
			)
			// console.log(constNum)
			res.send({
				status: 1,
				data: constNum,
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
}
export default new Search()