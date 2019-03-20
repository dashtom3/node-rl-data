'use strict';
import ArchiveModel from '../../models/data/hkrq'
import axios from 'axios'
import qs from 'qs'
import formidable from 'formidable'
import dtime from 'time-formater'
import schedule from 'node-schedule';
class Archive {
    constructor() {
        this.getDataByHour = this.getDataByHour.bind(this)
        // schedule.scheduleJob('0 0 5 * * *',()=>{
        // this.getDataEveryDay(dtime(new Date() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'), dtime(new Date() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'), '10,30,60')
        // }); 
        console.log(dtime(new Date() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'))
    }
    //热区驻足分时段数据
    async getDataByHour(req, res, next) {
        try {
            const { staySecond, from_time, to_time } = req.query;
            const token = await this.getToken()//获取token
            const store = await this.getStore(token.access_token)//获取门店信息
            const areas = await this.getAreas(token.access_token, store.data.rows[0].storeId)

            var areaIds = ""
            for (var j = 0; j < areas.data.length; j++) {
                areaIds = areaIds + areas.data[j].areaId + ","
            }
            for (var t of staySecond.split(',')) {
                for (var i = new Date(from_time).getTime(); i <= new Date(to_time).getTime();) {
                    var stayDate = await this.getStayPeople(token.access_token, areaIds, dtime(i).format('YYYY-MM-DD'), t)
                    stayDate.data.forEach((res, index) => {
                        res.distributionDatas.forEach(single => {
                            var endTime = new Date(dtime(i).format('YYYY-MM-DD') + ' ' + single.time).getTime()
                            var params = {
                                deviceId: areas.data[index].deviceId,
                                deviceSerial: areas.data[index].deviceSerial,
                                areaId: areas.data[index].areaId,
                                areaName: areas.data[index].areaName,
                                start_time: dtime(i).format('YYYY-MM-DD') + ' ' + single.time,
                                end_time: dtime(endTime + 3600 * 1000).format('YYYY-MM-DD HH:mm'),
                                staySecond: t,
                                stayPeopleCount: single.stayPeopleCount
                            }
                            ArchiveModel.create(params)
                        })
                    })
                    i = i + 24 * 3600 * 1000
                }
            }

            res.send({
                status: 1,
                data: 1
            })

        } catch (err) {
            console.log(err)
            res.send({
                status: 0,
                data: 0
            })
        }
    }
    //热区驻足分时段数据
    async getDataEveryDay(from_time, to_time, staySecond) {
        try {
            // const { staySecond, from_time, to_time } = req.query;
            const token = await this.getToken()//获取token
            const store = await this.getStore(token.access_token)//获取门店信息
            const areas = await this.getAreas(token.access_token, store.data.rows[0].storeId)

            var areaIds = ""
            for (var j = 0; j < areas.data.length; j++) {
                areaIds = areaIds + areas.data[j].areaId + ","
            }
            var allTimeData = [];
            for (var t of staySecond.split(',')) {
                for (var i = new Date(from_time).getTime(); i <= new Date(to_time).getTime();) {
                    var stayDate = await this.getStayPeople(token.access_token, areaIds, dtime(i).format('YYYY-MM-DD'), t)
                    stayDate.data.forEach((res, index) => {
                        res.distributionDatas.forEach(single => {
                            // DataTemp.push({ storeAreaName: res.storeAreaName, stayTotal: single.stayPeopleCount, time: single.time, date: dtime(i).format('YYYY-MM-DD') })
                            var endTime = new Date(dtime(i).format('YYYY-MM-DD') + ' ' + single.time).getTime()
                            // console.log(dtime(i).format('YYYY-MM-DD')+' '+single.time,dtime(endTime+3600*1000).format('YYYY-MM-DD HH:mm'),areas.data[index].deviceId,areas.data[index].deviceSerial,areas.data[index].areaId,areas.data[index].areaName,single.stayPeopleCount)
                            var params = {
                                deviceId: areas.data[index].deviceId,
                                deviceSerial: areas.data[index].deviceSerial,
                                areaId: areas.data[index].areaId,
                                areaName: areas.data[index].areaName,
                                start_time: dtime(i).format('YYYY-MM-DD') + ' ' + single.time,
                                end_time: dtime(endTime + 3600 * 1000).format('YYYY-MM-DD HH:mm'),
                                staySecond: t,
                                stayPeopleCount: single.stayPeopleCount
                            }
                              ArchiveModel.create(params)
                            // allTimeData.push(params)
                        })
                    })
                    i = i + 24 * 3600 * 1000
                }
            }
            // console.log(allTimeData.length)
        } catch (err) {
            console.log(err)
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
export default new Archive()