'use strict';

import logger from 'log4js'
import dtime from 'time-formater'
import xlsx from 'node-xlsx'
import fs from 'fs'
import { start } from 'pm2';
import path from 'path';
import HkrlModel from '../../models/data/hkrl'
class HKRL {
    constructor() {

    }
    async getDataRLByHour(id, from_time, to_time){
        const constNum = await HkrlModel.aggregate(
            {
                $match: {
                    id: Number(id),
                    start_time: { $gte: from_time, $lt: to_time }
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
            { $match: { id: Number(id), start_time: { $gte: from_time, $lt: to_time } } },
            { $project: { enter: 1, exit: 1, pass: 1 } },
            { $group: { _id: null, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
            { $project: { _id: 0, enter: 1, exit: 1, pass: 1 } },
        )
        var resHKRL = {data: cameraData,total: countTotal}
        return resHKRL
    }

    async getDataRLByDay(id, from_time, to_time){
        const dayDate = await HkrlModel.aggregate(
            {
                $match: {
                    id: Number(id),
                    start_time: { $gte: from_time, $lt: to_time }
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
                    start_time: { $gte: from_time, $lt: to_time }
                }
            },
            { $project: { enter: 1, exit: 1, pass: 1 } },
            { $group: { _id: null, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
            { $project: { _id: 0, enter: 1, exit: 1, pass: 1 } },
        )
        var resHKRL = {data:dayDate,total:dayTotal}
        return resHKRL
    }
}
export default new HKRL()
