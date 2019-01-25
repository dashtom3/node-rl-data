'use strict';

// import DataModel from '../../models/data'
import logger from 'log4js'
import dtime from 'time-formater'
import xlsx  from 'node-xlsx'
import fs from 'fs'
import { start } from 'pm2';
import path from 'path';
import analyseModel from '../../models/analyse'
import HKRLModel from '../../models/data/hkrl'
class HKDL{
    constructor() {
        this.dlByDay = this.dlByDay.bind(this)
        // this.init()
        this.init()
    }
    async init(){
        // console.log(111)
        // console.log(await this.getDLByDay('2018-12-20','2018-12-29','5',24))
        // console.log(await this.getDLByDay('2018-12-22','2018-12-22','5',24))
        // console.log(await this.getDLByHour('2018-12-21','2018-12-26','9',18))
    }
    async getDLByDay(from_time,to_time,from_hour,hours){
        var dateStart  = parseInt(dtime(from_time + ' ' + from_hour + ':00:00').format('x'))
        var dateEnd = dateStart + hours*60*60*1000
        var dateTo = parseInt(dtime(to_time + ' ' + from_hour + ':00:00').format('x'))
        var res = []
        
        while(true){
            const resDay = await this.dlByDay([1],dtime(dateStart).format('YYYY-MM-DD HH:mm:ss'),dtime(dateEnd).format('YYYY-MM-DD HH:mm:ss'))
            res.push({date:dtime(dateStart).format('YYYY-MM-DD'),time:resDay})
            if(dateStart == dateTo){
                break
            }else {
                dateStart = dateStart + 24*60*60*1000
                dateEnd = dateStart + hours*60*60*1000
            }
        }
        return res
    }
    async getDLByHour(from_time,to_time,from_hour,hours){
        var dateStart  = parseInt(dtime(from_time + ' ' + from_hour + ':00:00').format('x'))
        var dateEnd = dateStart + hours*60*60*1000
        var dateTo = parseInt(dtime(to_time + ' ' + from_hour + ':00:00').format('x'))
        var res = []
        
        while(true){
            const resDay = await this.dlByHour([1],dtime(dateStart).format('YYYY-MM-DD HH:mm:ss'),dtime(dateEnd).format('YYYY-MM-DD HH:mm:ss'))
            res.push({date:dtime(dateStart).format('YYYY-MM-DD'),data:resDay})
            if(dateStart == dateTo){
                break
            }else {
                dateStart = dateStart + 24*60*60*1000
                dateEnd = dateStart + hours*60*60*1000
            }
        }
        return res
    }
    timeSequence(data){
        var enterTime = 0
        var outTime = 0
        var outTime2 = 0
       
        var array = [[],[]]
        data.forEach((item,index)=>{
            if(item.enter != 0 || item.exit != 0){
                var tempTime = parseInt(dtime(item.start_time).format('x'))
                for(var i=0;i<item.enter;i++){
                    array[0].push(tempTime)
                }
                for(var i=0;i<item.exit;i++){
                    array[1].push(tempTime)
                }
            }
        })
        // console.log('进出次数',array[0].length,array[1].length)
        array[0].forEach((item,index)=>{
            enterTime = enterTime + item/array[0].length
            var temp = ((index+1)*parseFloat(array[1].length/array[0].length)).toFixed(0)-1
            // console.log(enterTime,temp)
            outTime2 = outTime2 + (array[1][temp]?array[1][temp]:array[1][array[1].length-1])/array[0].length
            // console.log(outTime2)
        })
        array[1].forEach(item=>{
            outTime = outTime + item/array[1].length
        })
        var peak = dtime(parseInt(enterTime)).format('YYYY-MM-DD HH:mm:ss')
        var peak2 = dtime(parseInt(outTime)).format('YYYY-MM-DD HH:mm:ss')
        var peak3 = dtime(parseInt(outTime2)).format('YYYY-MM-DD HH:mm:ss')
        // console.log(peak,peak2,peak3)
        return ((parseInt(dtime(peak3).format('x'))-parseInt(dtime(peak).format('x')))/1000/60).toFixed(2)
        
    }
    getTime(array,fromTime,toTime){
        var enterTime = 0
        // var outTime = 0
        var outTime2 = 0
        var num = 0
        array[0].forEach((item,index)=>{
            if(item>fromTime && item < toTime){
                enterTime = enterTime + item
                num++
                var temp = ((index+1)*parseFloat(array[1].length/array[0].length)).toFixed(0)-1
                while((array[1][temp]?array[1][temp]:array[1][array[1].length-1])<item){
                    temp++
                    if(temp>= array[1].length-1){
                        temp = array[1].length-1
                        break
                    }
                }
                var res = array[1][temp]?array[1][temp]:array[1][array[1].length-1]
                outTime2 = outTime2 + res
                // console.log(temp,dtime(item).format('YYYY-MM-DD HH:mm:ss'),dtime(array[1][temp]).format('YYYY-MM-DD HH:mm:ss'))
            }
        })
        var peak = dtime(parseInt(enterTime/num)).format('YYYY-MM-DD HH:mm:ss')
        // var peak2 = dtime(parseInt(outTime)).format('YYYY-MM-DD HH:mm:ss')
        var peak3 = dtime(parseInt(outTime2/num)).format('YYYY-MM-DD HH:mm:ss')
        
        return ((parseInt(dtime(peak3).format('x'))-parseInt(dtime(peak).format('x')))/1000/60).toFixed(2)
    }
    //timeStr{from:,to:} // 09:00～13:00 13:00～17:00 17:00～21:00 21:00～05:00  
    timeSequence2(data,from_time){
        var array = [[],[]]
        data.forEach((item,index)=>{
            if(item.enter != 0 || item.exit != 0){
                // console.log(item.start_time,item.enter,item.exit)
                var tempTime = parseInt(dtime(item.start_time).format('x'))
                for(var i=0;i<item.enter;i++){
                    array[0].push(tempTime)
                }
                for(var i=0;i<item.exit;i++){
                    array[1].push(tempTime)
                }
            }
        })
        // console.log('进出次数',array[0].length,array[1].length)
        var timeFrom = parseInt(dtime(from_time).format('x'))
        var timeSeq = [timeFrom,timeFrom+4*60*60*1000,timeFrom+8*60*60*1000,timeFrom+12*60*60*1000,timeFrom+20*60*60*1000]
        var timeName = ['午餐','下午茶','晚餐','午夜']
        var res = []
        for(var i=0;i<timeSeq.length-1;i++){
            var temp = {
                time:this.getTime(array,timeSeq[i],timeSeq[i+1]),
                name:timeName[i],
                from:dtime(timeSeq[i]).format('YYYY-MM-DD HH:mm:ss'),
                to:dtime(timeSeq[i+1]).format('YYYY-MM-DD HH:mm:ss')
            }
            res.push(temp)
        }
        // console.log(res)
        return res
    }
    async dlByHour(ids,from_time,to_time){
        const dayDate = await HKRLModel.aggregate(
            {
                $match: {
                    id: {$in:ids},
                    start_time: { $gte: from_time, $lt: to_time }
                }
            },
            {$sort:{'start_time':1}}
        )
        return this.timeSequence2(dayDate,from_time)
    }
    async dlByDay(ids,from_time,to_time){
        const dayDate = await HKRLModel.aggregate(
            {
                $match: {
                    id: {$in:ids},
                    start_time: { $gte: from_time, $lt: to_time }
                }
            },
            {$sort:{'start_time':1}}
        )
        return this.timeSequence(dayDate)
    }
    
}
export default new HKDL()
  