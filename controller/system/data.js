'use strict';
import HkrlModel from '../../models/data/hkrl'
import hkrl from '../../controller/analysesystem/hkrl'
import formidable from 'formidable'
import dtime from 'time-formater'

class Data {
	constructor(){
		
    }
    //海康人流查询接口 storeId 店铺id,fromDate 开始日期,toDate 结束日期,startTime 开始时间,endTime 结束时间,dimension 0:小时 1:天 2:周 3:月
   async getHKRLDataBydimension(req,res,next){
       try{
        const {token,deviceIds,from_time,to_time,dimension} = req.query
        const resData = await hkrl.getDataRLByHour(deviceIds,from_time,to_time,dimension)
        res.send({
            status:1,
            data:resData,
            message: '访问成功',
        })
    }catch(err){
        res.send({
            status:0,
            type: 'ERROR',
            message: '访问失败',
        })
    }
   }
   async getHKRLDataByday(req,res,next){
    try{
     const {deviceIds,from_time,to_time} = req.query
     const resData = await hkrl.getDataRLByDay(deviceIds,from_time,to_time)
     res.send({
         status:1,
         data:resData,
         message: '访问成功',
     })
 }catch(err){
     res.send({
         status:0,
         type: 'ERROR',
         message: '访问失败',
     })
 }
}
}

export default new Data()