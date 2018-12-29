'use strict';

// import DataModel from '../models/wifidemo'
import axios from 'axios'
import qs from 'qs'
import formidable from 'formidable'
import dtime from 'time-formater'
import { rejects } from 'assert';
import { sendDataToProcessId } from 'pm2';

class Data {
    constructor() {
        this.getOndayDemo = this.getOndayDemo.bind(this)
        this.getStayAllData = this.getStayAllData.bind(this)
        this.getStayByday = this.getStayByday.bind(this)
        this.getDataByHour = this.getDataByHour.bind(this)
        this.getEchartsByHour = this.getEchartsByHour.bind(this)
    }
    async getOndayDemo(req, res, next) { //展示demoApi
        const { time, staySecond } = req.query
        try {
            var stayOneData = []
            const token = await this.getToken()//获取token
            const store = await this.getStore(token.access_token)//获取门店信息
            const areas = await this.getAreas(token.access_token, store.data.rows[0].storeId)
            var areaIds = ""
            for (var i = 0; i < areas.data.length; i++) {
                areaIds = areaIds + areas.data[i].areaId + ","
            }

            var stayDate = await this.getStayPeople(token.access_token, areaIds, dtime(time).format('YYYY-MM-DD'), staySecond)
            res.send({
                status: 1,
                data: stayDate.data,
            })
        } catch (err) {
            res.send({
                status: 0,
                message: '获取数据失败'
            })
        }
    }
    //热区总览接口
    async getStayAllData(req, res, next) {
        try {
            const token = await this.getToken()//获取token
            const store = await this.getStore(token.access_token)//获取门店信息
            const areas = await this.getAreas(token.access_token, store.data.rows[0].storeId)
            var areaIds = ""
            for (var i = 0; i < areas.data.length; i++) {
                areaIds = areaIds + areas.data[i].areaId + ","
            }

            var allData = []
            const { staySecond, from_time, to_time } = req.query;
            for (var t of staySecond.split(',')) {
                var DataTemp = []
                for (var i = new Date(from_time).getTime(); i <= new Date(to_time).getTime();) {
                    var stayDate = await this.getStayPeople(token.access_token, areaIds, dtime(i).format('YYYY-MM-DD'), t)
                    stayDate.data.forEach(res => {
                        var stayTotal = 0
                        res.distributionDatas.forEach(single => {
                            stayTotal = stayTotal + single.stayPeopleCount
                        })
                        DataTemp.push({ time: dtime(i).format('YYYY-MM-DD'), staySecond: t, storeAreaName: res.storeAreaName, stayTotal: stayTotal })
                    })
                    i = i + 24 * 3600 * 1000
                }

                var data = {};
                for (var i = 0; i < DataTemp.length; i++) {
                    if (!data[DataTemp[i].storeAreaName]) {
                        var arr = [];
                        arr.push(DataTemp[i]);
                        data[DataTemp[i].storeAreaName] = arr;
                    } else {
                        data[DataTemp[i].storeAreaName].push(DataTemp[i])
                    }
                }

                var finalDataTemp = { '逗留时长': t + '秒以上' };
                for (var m in data) {
                    var numTotal = 0
                    for (var k of data[m]) {
                        numTotal = numTotal + k.stayTotal
                    }
                    finalDataTemp[m] = numTotal
                }
                allData.push(finalDataTemp)
            }
            res.send({
                status: 1,
                data: allData
            })
        } catch (err) {
            res.send({
                status: 0,
                message: '获取数据失败'
            })
        }

    }
    //热区驻足每日数据
    async getStayByday(req, res, next) {
        try {
            const { staySecond, from_time, to_time } = req.query;

            const token = await this.getToken()//获取token
            const store = await this.getStore(token.access_token)//获取门店信息
            const areas = await this.getAreas(token.access_token, store.data.rows[0].storeId)
            var areaIds = ""
            for (var i = 0; i < areas.data.length; i++) {
                areaIds = areaIds + areas.data[i].areaId + ","
            }

            var DataTemp = [], allTimeData = [];
            for (var i = new Date(from_time).getTime(); i <= new Date(to_time).getTime();) {
                var stayDate = await this.getStayPeople(token.access_token, areaIds, dtime(i).format('YYYY-MM-DD'), staySecond)
                stayDate.data.forEach(res => {
                    var stayTotal = 0
                    res.distributionDatas.forEach(single => {
                        stayTotal = stayTotal + single.stayPeopleCount
                    })
                    DataTemp.push({ time: dtime(i).format('YYYY-MM-DD'), staySecond: staySecond, storeAreaName: res.storeAreaName, stayTotal: stayTotal })
                })
                allTimeData.push(dtime(i).format('YYYY-MM-DD'))
                i = i + 24 * 3600 * 1000
            }

            var data = {};
            for (var i = 0; i < DataTemp.length; i++) {
                if (!data[DataTemp[i].storeAreaName]) {
                    var arr = [];
                    arr.push(DataTemp[i]);
                    data[DataTemp[i].storeAreaName] = arr;
                } else {
                    data[DataTemp[i].storeAreaName].push(DataTemp[i])
                }
            }
            var data1 = {};
            for (var i = 0; i < DataTemp.length; i++) {
                if (!data1[DataTemp[i].time]) {
                    var arr = [];
                    arr.push(DataTemp[i]);
                    data1[DataTemp[i].time] = arr;
                } else {
                    data1[DataTemp[i].time].push(DataTemp[i])
                }
            }

            var dayData = []
            for (var m in data) {
                var finalDataTemp = { '日期': m };
                for (var k of data[m]) {
                    var day = k.time + '(' + dtime(k.time).format('dddd') + ')'
                    finalDataTemp[day] = k.stayTotal
                }
                dayData.push(finalDataTemp)
            }

            var data1Temp = { '日期': '平均关注度' }
            for (let o in data1) {
                var stayTotal = 0
                for (let m of data1[o]) {
                    stayTotal = (stayTotal + m.stayTotal)
                }
                var time = o + '(' + dtime(o).format('dddd') + ')'
                data1Temp[time] = (stayTotal / allTimeData.length).toFixed(0)
            }
            dayData.unshift(data1Temp)
            res.send({
                status: 1,
                data: dayData
            })
            // 	allData.push(finalDataTemp)
            // console.log(data)
        } catch (err) {
            // console.log(err)
            res.send({
                status: 0,
                message: '获取数据失败'
            })
        }
    }
    //热区驻足分时段echarts数据
    async getEchartsByHour(req, res, next) {
        try {
            const { staySecond, from_time, to_time } = req.query;

            const token = await this.getToken()//获取token
            const store = await this.getStore(token.access_token)//获取门店信息
            const areas = await this.getAreas(token.access_token, store.data.rows[0].storeId)
            var areaIds = ""
            for (var i = 0; i < areas.data.length; i++) {
                areaIds = areaIds + areas.data[i].areaId + ","
            }

            var DataTemp = [], allTimeData = [];
            for (var i = new Date(from_time).getTime(); i <= new Date(to_time).getTime();) {
                var stayDate = await this.getStayPeople(token.access_token, areaIds, dtime(i).format('YYYY-MM-DD'), staySecond)
                stayDate.data.forEach(res => {
                    res.distributionDatas.forEach(single => {
                        DataTemp.push({ storeAreaName: res.storeAreaName, stayTotal: single.stayPeopleCount, time: single.time, date: dtime(i).format('YYYY-MM-DD') })
                    })
                })
                allTimeData.push(dtime(i).format('YYYY-MM-DD'))
                i = i + 24 * 3600 * 1000
            }
            var weekday = [], unweekday = [];
            DataTemp.forEach(item => {
                if (dtime(item.date).format('d') == 6 || dtime(item.date).format('d') == 0) {
                    unweekday.push(item)
                } else {
                    weekday.push(item)
                }
            })
            //工作日
            var data = {};
            for (var i = 0; i < weekday.length; i++) {
                if (!data[weekday[i].storeAreaName]) {
                    var arr = [];
                    arr.push(weekday[i]);
                    data[weekday[i].storeAreaName] = arr;
                } else {
                    data[weekday[i].storeAreaName].push(weekday[i])
                }
            }

            for (var m in data) {
                var data1 = {}
                for (var k of data[m]) {
                    if (k.time >= dtime(from_time).format('HH:mm') && k.time <= dtime(to_time).format('HH:mm')) {
                        if (!data1[k.time]) {
                            var arr1 = [];
                            arr1.push(k);
                            data1[k.time] = arr1;
                            data[m] = data1
                        } else {
                            data1[k.time].push(k)
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
                        stayTotal = stayTotal + o.stayTotal
                    }
                    dataTemp.push((stayTotal / allTimeData.length).toFixed(0))
                    finalDataTemp[m] = dataTemp
                }
                hourData.push(finalDataTemp)
            }


            //非工作日
            var undata = {};
            for (var i = 0; i < unweekday.length; i++) {
                if (!undata[unweekday[i].storeAreaName]) {
                    var arr = [];
                    arr.push(unweekday[i]);
                    undata[unweekday[i].storeAreaName] = arr;
                } else {
                    undata[unweekday[i].storeAreaName].push(unweekday[i])
                }
            }

            for (var m in undata) {
                var data1 = {}
                for (var k of undata[m]) {
                    if (k.time >= dtime(from_time).format('HH:mm') && k.time <= dtime(to_time).format('HH:mm')) {
                        if (!data1[k.time]) {
                            var arr1 = [];
                            arr1.push(k);
                            data1[k.time] = arr1;
                            undata[m] = data1
                        } else {
                            data1[k.time].push(k)
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
                        // console.log(o)
                        stayTotal = stayTotal + o.stayTotal
                    }
                    dateTemp.push((stayTotal / allTimeData.length).toFixed(0))
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
                message: '获取数据失败'
            })
        }
    }
    //热区驻足分时段数据
    async getDataByHour(req, res, next) {
        try {
            const { staySecond, from_time, to_time } = req.query;
            const token = await this.getToken()//获取token
            const store = await this.getStore(token.access_token)//获取门店信息
            const areas = await this.getAreas(token.access_token, store.data.rows[0].storeId)
            var areaIds = ""
            for (var i = 0; i < areas.data.length; i++) {
                areaIds = areaIds + areas.data[i].areaId + ","
            }

            var DataTemp = [], allTimeData = [];
            for (var i = new Date(from_time).getTime(); i <= new Date(to_time).getTime();) {
                var stayDate = await this.getStayPeople(token.access_token, areaIds, dtime(i).format('YYYY-MM-DD'), staySecond)
                stayDate.data.forEach(res => {
                    res.distributionDatas.forEach(single => {
                        DataTemp.push({ storeAreaName: res.storeAreaName, stayTotal: single.stayPeopleCount, time: single.time, date: dtime(i).format('YYYY-MM-DD') })
                    })
                })
                allTimeData.push(dtime(i).format('YYYY-MM-DD'))
                i = i + 24 * 3600 * 1000
            }
                

            var data = {};
            for (var i = 0; i < DataTemp.length; i++) {
                if (!data[DataTemp[i].time]) {
                    var arr = [];
                    arr.push(DataTemp[i]);
                    data[DataTemp[i].time] = arr;
                } else {
                    data[DataTemp[i].time].push(DataTemp[i])
                }
            }


            for (var m in data) {
                var data1 = {}
                for (var k of data[m]) {
                    if (!data1[k.storeAreaName]) {
                        var arr1 = [];
                        arr1.push(k);
                        data1[k.storeAreaName] = arr1;
                        data[m] = data1
                    } else {
                        data1[k.storeAreaName].push(k)
                        data[m] = data1
                    }
                }
            }

            var hourData = []
            for (var m in data) {
                var finalDataTemp = { '时间': m };
                for (var k in data[m]) {
                    var stayTotal = 0
                    for (var o of data[m][k]) {
                        stayTotal = stayTotal + o.stayTotal
                    }
                    finalDataTemp[o.storeAreaName] = (stayTotal / allTimeData.length).toFixed(0)
                }
                hourData.push(finalDataTemp)
            }
            res.send({
                status: 1,
                data: hourData
            })

        } catch (err) {
            res.send({
                status: 0,
                message: '获取数据失败'
            })
        }
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
export default new Data()