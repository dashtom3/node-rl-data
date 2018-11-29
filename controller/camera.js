'use strict';

import CameraModel from '../models/camera'
import formidable from 'formidable'
import dtime from 'time-formater'

class Search {
	constructor() {
		this.searchByHour = this.searchByHour.bind(this)
		this.searchByday = this.searchByday.bind(this)
		// console.log(dtime('2018-01-01'))
	}

	async searchByHour(req, res, next) {
		const { id, from_time, to_time } = req.query;
		try {
			const constNum = await CameraModel.aggregate(
				{
					$match: {
						id: Number(id),
						start_time: { $gte: from_time, $lt: to_time }
					}
				},
				{
					$project: {
						start_time: 1,
						end_tim: 1,
						daytime: { $substr: ["$start_time", 0, 13] },
						enter: 1,
						exit: 1,
						pass: 1
					}
				},
				{ $group: { _id: "$daytime", enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" }, start_time: { $first:  {$substr: ["$start_time", 0, 16]} }, end_time: { $last:  {$substr: ["$end_tim", 0, 16]} } } },
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
			const countTotal = await CameraModel.aggregate(
				{ $match: { id: Number(id), start_time: { $gte: from_time, $lt: to_time } } },
				{ $project: { enter: 1, exit: 1, pass: 1 } },
				{ $group: { _id: null, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
				{ $project: { _id: 0, enter: 1, exit: 1, pass: 1 } },
			)
			res.send({
				status: 1,
				data: constNum,
				total: countTotal
			})
		} catch (err) {
			res.send({
				status: 0,
				message: '获取数据失败'
			})
		}
	}
	async searchByday(req, res, next) {
		const { id, from_time, to_time } = req.query;
		try {
			const dayDate = await CameraModel.aggregate(
				{
					$match: {
						id: Number(id),
						start_time: { $gte: from_time, $lt: to_time }
					}
				},
				{
					$project: {
						start_time: 1,
						end_tim: 1,
						daytime: { $substr: ["$start_time", 0, 10] },
						enter: 1,
						exit: 1,
						pass: 1
					}
				},
				{ $group: { _id: "$daytime", start_time: { $first: { $substr: ["$start_time", 0, 10] } }, end_time: { $last: { $substr: ["$end_tim", 0, 10] } }, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
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
			const dayTotal = await CameraModel.aggregate(
				{
					$match: {
						id: Number(id),
						start_time: { $gte: from_time, $lt: to_time }
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
}
export default new Search()