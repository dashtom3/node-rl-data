'use strict';

import logger from 'log4js'
import dtime from 'time-formater'
import xlsx from 'node-xlsx'
import fs from 'fs'
import { start } from 'pm2';
import path from 'path';
import axios from 'axios'
import qs from 'qs'
import { REFUSED } from 'dns';
class DXMRL {
    constructor() {

    }
    async getDataDXMbyPeople(from_time,to_time,type) {
			const token = await this.getDXMToken()
			var data = {
				token:token.resData.mtk,
				from_time:dtime(from_time).format('YYYY-MM-DD HH:mm:ss'),
				to_time:dtime(to_time).format('YYYY-MM-DD HH:mm:ss'),
				type:type
			}
            const rateDate = await this.getDXMRateData(data)
            return rateDate 
    }
    //判断设备是否在线
    async getDeviceIsOnline(){
        const token = await this.getDXMToken()
        var data = {
            token:token.resData.mtk
        }
        const resData = await this.deviceIsOnline(data)
        return resData
    }
    //获取详细客流
    async getDataDXMbyDetail(from_time,to_time,type) {
        const token = await this.getDXMToken()
        var data = {
            token:token.resData.mtk,
            from_time:dtime(from_time).format('YYYY-MM-DD HH:mm:ss'),
            to_time:dtime(to_time).format('YYYY-MM-DD HH:mm:ss'),
            type:type
        }
        const rateDate = await this.getDXMTableData(data)
        return rateDate 
}
    //获取客流趋势
    async getDataDXMByFlowTrend(){
        const token = await this.getDXMToken()
        const flowData = await this.getFlowTrendData(token.resData.mtk)
        return flowData
    }
    //店小喵获取token(mtk)
    getDXMToken() {
        var tokendata = {
            account: "13918005963",
            pwd: "87b750fdfeb4468f58c3247b303704ab"
        }
        var url = 'https://retail.miniclouds.cn:58080/login/ajaxLogin';
        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                data: tokendata
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
    //判断设备是否在线
    deviceIsOnline(obj){
        var data = {
            shopId:'3049396f16b743eb815934bdbdefaca4'
        }
        var url = 'https://retail.miniclouds.cn:58002/agw/shopInfoCtr/getDeviceByShopID';
        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "mtk": obj.token
                },
                data: data
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
    //获取店小喵数据报表格式
    getDXMTableData(obj){
        var data = {
            beginTime:obj.from_time,
            endTime:obj.to_time,
            rateCycle:obj.type,
            shopId:"3049396f16b743eb815934bdbdefaca4"  
        }
        var url = 'https://retail.miniclouds.cn:58002/agw/passenger/flow/list';
        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "mtk": obj.token
                },
                data: data
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
    //店小喵客流和客群占比方法
    getDXMRateData(obj) {
        var data = {
            refDto: {
                brandId: "40b23593d1c342d7a874fb53c42a72e9",
                shopId: "3049396f16b743eb815934bdbdefaca4"
            },
            beginTime: obj.from_time,
            endTime: obj.to_time,
            dimension: obj.type
        }
        var url = 'https://retail.miniclouds.cn:58002/agw/statisticsCtr/getRateInfoByDimension';
        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "mtk": obj.token
                },
                data: data
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
    //获取客流趋势 /agw/statisticsCtr/getPassengerFlowTrend
	getFlowTrendData(token){
		var data = {
			brandId:"40b23593d1c342d7a874fb53c42a72e9",
			shopId:"3049396f16b743eb815934bdbdefaca4"
				}
		var	url ='https://retail.miniclouds.cn:58002/agw/statisticsCtr/getPassengerFlowTrend';
		return new Promise((resolve, reject) => {
		axios({
			url: url,
			method: "POST",
			json: true,
			headers: {
				"content-type":"application/json",
				"mtk":token
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
export default new DXMRL()
