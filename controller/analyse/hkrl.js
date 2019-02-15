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
        var resHKRL = cameraData
        return resHKRL
    }
    // async getDataRLByDay(id, from_time, to_time){
    //     const dayDate = await HkrlModel.aggregate(
    //         {
    //             $match: {
    //                 id: Number(id),
    //                 start_time: { $gte: from_time, $lt: to_time }
    //             }
    //         },
    //         {
    //             $project: {
    //                 start_time: 1,
    //                 end_time: 1,
    //                 daytime: { $substr: ["$start_time", 0, 10] },
    //                 enter: 1,
    //                 exit: 1,
    //                 pass: 1
    //             }
    //         },
    //         { $group: { _id: "$daytime", start_time: { $first: { $substr: ["$start_time", 0, 10] } }, end_time: { $last: { $substr: ["$end_time", 0, 10] } }, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 start_time: 1,
    //                 end_time: 1,
    //                 enter: 1,
    //                 exit: 1,
    //                 pass: 1,
    //             }
    //         },
    //         { $sort: { start_time: 1 } }
    //     )
    //     const dayTotal = await HkrlModel.aggregate(
    //         {
    //             $match: {
    //                 id: Number(id),
    //                 start_time: { $gte: from_time, $lt: to_time }
    //             }
    //         },
    //         { $project: { enter: 1, exit: 1, pass: 1 } },
    //         { $group: { _id: null, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
    //         { $project: { _id: 0, enter: 1, exit: 1, pass: 1 } },
    //     )
    //     var resHKRL = {data:dayDate,total:dayTotal}
    //     return resHKRL
    // }
    async getDataRLByDay(ids, from_time, to_time){
        var minTime = dtime(from_time).format('HH')
        var maxTime = dtime(to_time).format('HH')
        var dayAllData = []
        for(var id of ids){
            var dayData = await HkrlModel.find({ id: Number(id), start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm:ss'), $lt: dtime(to_time).format('YYYY-MM-DD HH:mm:ss') } })
            dayData.forEach(res =>{
                    var limitTime = dtime(res.start_time).format('HH')
                    if (limitTime >= minTime && limitTime <= maxTime) {
                        dayAllData.push(res)
                    }
            })
        }
        var data = {}
            for (var i = 0; i < dayAllData.length; i++) {
                    var time = dtime(dayAllData[i].start_time).format('YYYY-MM-DD')
                    if (!data[time]) {
                        var arr = [];
                        arr.push(dayAllData[i]);
                        data[time] = arr;
                    } else {
                        data[time].push(dayAllData[i])
                    }
            }
            var finalArr = []
            for (var key in data) {
                var enter = 0; var exit = 0;
                for (var d of data[key]) {
                    enter = enter + d.enter
                    exit = exit + d.exit
                }
                var temp = {
                    start_time: key,
                    enter: enter,
                    exit: exit
                }
                finalArr.push(temp)
            }
            return finalArr
    }
}
export default new HKRL()
