'use strict';

import logger from 'log4js'
import dtime from 'time-formater'
import xlsx from 'node-xlsx'
import qs from 'qs'
import { start } from 'pm2';
import path from 'path';
import axios from 'axios'
import HKrqModel from '../../models/data/hkrq'
class HKRQ {
    constructor() {

    }
    async getRQbyAll(from_time, to_time) {

        const sinConstNum = await HKrqModel.find({start_time: { $gte: dtime(from_time).format('YYYY-MM-DD HH:mm'), $lte: dtime(to_time).format('YYYY-MM-DD HH:mm') } }).sort({ start_time: 1 })
            // console.log(sinConstNum)
            var constNum = []
            sinConstNum.forEach(res =>{
                var time = dtime(res.start_time).format('HH:mm')
                if (time >= dtime(from_time).format('HH:mm') && time <= dtime(to_time).format('HH:mm')) {
                    constNum.push(res)
                }
            })
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
        return tempData
    }
    async getRQbyHour(from_time, to_time, staySecond) {
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
        // return tempData
        return constNum
    }

    async getRQechatrsByHour(from_time, to_time, staySecond) {
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
                dataTemp.push(stayTotal)
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
                dateTemp.push(stayTotal)
                finalDataTemp[m] = dateTemp
            }
            unhourData.push(finalDataTemp)
        }
        var resHKRQ = { weekday: hourData, unweekday: unhourData }
        return resHKRQ
    }

    async getDataRQByDay(from_time, to_time, staySecond) {
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
        return tempData
    }

    async getDataRQByOneDay(time, staySecond) {
        const token = await this.getToken()//获取token
        const store = await this.getStore(token.access_token)//获取门店信息
        const areas = await this.getAreas(token.access_token, store.data.rows[0].storeId)
        var areaIds = ""
        for (var i = 0; i < areas.data.length; i++) {
            areaIds = areaIds + areas.data[i].areaId + ","
        }

        var stayDate = await this.getStayPeople(token.access_token, areaIds, dtime(time).format('YYYY-MM-DD'), staySecond)

        return stayDate
    }

    //判断海康热区设备是否在线
    async getDeviceRQIsOnline(){
        const token = await this.getToken()//获取token
        const store = await this.getStore(token.access_token)//获取门店信息
        const resDate = await this.getDevice(store.data.rows[0].storeId,token.access_token) 
        return resDate
    }
    //获取设备状态
    getDevice(storeId,token){
        return new Promise((resolve, reject) => {
            axios({
                url: 'https://api.hik-cloud.com/v1/customization/cameraList',
                method: 'GET',
                params: {
                    storeId: storeId,
                    access_token: token,
                    pageNo:1,
                    pageSize:10
                }
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        });
    }
    //获取token(access_token)
    getToken() {
        var tokendata = {
            client_id: '6ec05bc6ea6a460a8f5b24ad1afb98bb',
            client_secret: '1fdee02cafba4c258e88de22f3af1792',
            grant_type: 'client_credentials',
            scope: 'app'
        }
        return new Promise((resolve, reject) => {
            axios({
                url: 'https://api.hik-cloud.com/oauth/token',
                method: 'POST',
                data: qs.stringify(tokendata)
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        });
    }
    //查询门店信息(storeId)
    getStore(token) {
        return new Promise((resolve, reject) => {
            axios({
                url: 'https://api.hik-cloud.com/v1/customization/storeInfo',
                method: 'GET',
                params: {
                    pageNo: 1,
                    pageSize: 10,
                    access_token: token
                }
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        });
    }
    //获取门店下热度配置查询(areaId)
    getAreas(token, storeId) {
        return new Promise((resolve, reject) => {
            axios({
                url: 'https://api.hik-cloud.com/v1/customization/heats/areas',
                method: 'GET',
                params: {
                    storeId: storeId,
                    access_token: token
                }
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        });
    }
    //获取驻足人次分布()
    getStayPeople(token, areaIds, date, staySecond) {
        return new Promise((resolve, reject) => {
            axios({
                url: 'https://api.hik-cloud.com/v1/customization/heats/actions/stayPeopledistributions',
                method: 'GET',
                params: {
                    storeId: "2ca13286c47947a6b18e1b30556ddb82",
                    date: date,
                    access_token: token,
                    storeAreaIds: areaIds,
                    staySeconds: staySecond
                }
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        });
    }

}
export default new HKRQ()
