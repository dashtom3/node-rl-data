'use strict';
import dtime from 'time-formater'
import HkrlModel from '../../models/data/hkrl'
import { start } from 'pm2';
class HKRL {
    constructor() {

    }
    async getDataRLByHour(deviceIds, from_time, to_time, dimension) {
        console.log(deviceIds, from_time, to_time, dimension)
        var ids = deviceIds.split(',')
        var minTime = Number(from_time.substring(11,13))
        var maxTime = Number(to_time.substring(11,13))
        if (dimension == '0') { //维度为小时 
            var consAlltNum = []
            for (var id of ids) {
                var constNum = await HkrlModel.find({ id: Number(id), start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm:ss'), $lt: dtime(to_time).format('YYYY-MM-DD HH:mm:ss') } })
                constNum.forEach(res => {
                    var limitTime = dtime(res.start_time).format('HH')
                    if (limitTime >= minTime && limitTime < maxTime) {
                        consAlltNum.push(res)
                    }
                })
            }
            var temp = {}
            for (var i = 0; i < consAlltNum.length; i++) {
                var time = dtime(consAlltNum[i].start_time).format('HH')
                if (!temp[time]) {
                    var arr = [];
                    arr.push(consAlltNum[i]);
                    temp[time] = arr;
                } else {
                    temp[time].push(consAlltNum[i])
                }
            }
            const cameraData = []
            for (var key in temp) {
                var enter = 0; var exit = 0;
                for (var d of temp[key]) {
                    enter = enter + d.enter
                    exit = exit + d.exit
                }
                var tempobject = {
                    date: Number(key) < 10 ? ('0' + Number(key) + ':' + '00') : (Number(key) + ':' + '00'),
                    enter: enter,
                    exit: exit
                }
                cameraData.push(tempobject)
            }
            cameraData.sort(function (a, b) {
                return a.date > b.date ? 1 : -1
            })
            return cameraData
        } else if (dimension == '1') {
            var dayAllData = []
            for (var id of ids) {
            var dayData = await HkrlModel.find({ id: Number(id), start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm:ss'), $lt: dtime(to_time).format('YYYY-MM-DD HH:mm:ss') } })
                dayData.forEach(res =>{
                    var limitTime = dtime(res.start_time).format('HH')
                    if (limitTime >= minTime && limitTime < maxTime) {
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
                    date: key,
                    enter: enter,
                    exit: exit
                }
                finalArr.push(temp)
            }
            return finalArr
        }else if(dimension == '2'){
            var dayAllDate = []
            for (var id of ids) {
            var dayDate = await HkrlModel.aggregate(
                {
                    $match: {
                        id: Number(id),
                        start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm:ss'), $lt: dtime(to_time).format('YYYY-MM-DD HH:mm:ss') }
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
            dayDate.forEach(res =>{
             dayAllDate.push(res) 
            })
        }
            var data = {}
            for (var i = 0; i < dayAllDate.length; i++) {
                    var time = this.getWeekOfYear(dtime(dayAllDate[i].start_time).format('YYYY-MM-DD'))
                    if (!data[time]) {
                        var arr = [];
                        arr.push(dayAllDate[i]);
                        data[time] = arr;
                    } else {
                        data[time].push(dayAllDate[i])
                    }
            }
            var finalArr = []
            for(var key in data){
                var enter =0;var exit = 0;
                for(var d of data[key]){
                    enter = enter + d.enter
                    exit = exit + d.exit
                }
                finalArr.push({
                    date:key,
                    enter:enter,
                    exit:exit
                })
            }
            return finalArr
        }else{
            var dayAllDate = []
            for (var id of ids) {
            var dayDate = await HkrlModel.aggregate(
                {
                    $match: {
                        id: Number(id),
                        start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm:ss'), $lt: dtime(to_time).format('YYYY-MM-DD HH:mm:ss') }
                    }
                },
                {
                    $project: {
                        start_time: 1,
                        end_time: 1,
                        daytime: { $substr: ["$start_time", 0, 7] },
                        enter: 1,
                        exit: 1,
                        pass: 1
                    }
                },
                { $group: { _id: "$daytime", start_time: { $first: { $substr: ["$start_time", 0, 7] } }, end_time: { $last: { $substr: ["$end_time", 0, 7] } }, enter: { $sum: "$enter" }, exit: { $sum: "$exit" }, pass: { $sum: "$pass" } } },
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
            dayDate.forEach(res =>{
                dayAllDate.push(res)
            })
        }
            var data = {}
            for (var i = 0; i < dayAllDate.length; i++) {
                    var time = dayAllDate[i].start_time
                    if (!data[time]) {
                        var arr = [];
                        arr.push(dayAllDate[i]);
                        data[time] = arr;
                    } else {
                        data[time].push(dayAllDate[i])
                    }
            }
            var finalArr = []
            for(var key in data){
                var enter =0;var exit = 0;
                for(var d of data[key]){
                    enter = enter + d.enter
                    exit = exit + d.exit
                }
                finalArr.push({
                    date:key,
                    enter:enter,
                    exit:exit
                })
            }
            return finalArr
        }

    }
    getWeekOfYear(dt){ //判断某一天为当年第几周
          var today = new Date(dt)
          var year = dtime(dt).format('YYYY')
          var firstDay = new Date(today.getFullYear(),0, 1);
          var dayOfWeek = firstDay.getDay(); 
          var spendDay= 1;
          if (dayOfWeek !=0) {
            spendDay=7-dayOfWeek+1;
          }
          firstDay = new Date(today.getFullYear(),0, 1+spendDay);
          var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);
          var result = Math.ceil(d/7) + 1;
          return year+'第'+result +'周';
        };
    async getDataRLByDay(ids, from_time, to_time) {
        var minTime = dtime(from_time).format('HH')
        var maxTime = dtime(to_time).format('HH')
        var dayAllData = []
        for(var id of ids){
            var dayData = await HkrlModel.find({ id: Number(id), start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm:ss'), $lt: dtime(to_time).format('YYYY-MM-DD HH:mm:ss') } })
            dayData.forEach(res =>{
                    var limitTime = dtime(res.start_time).format('HH')
                    if (limitTime >= minTime && limitTime < maxTime) {
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
