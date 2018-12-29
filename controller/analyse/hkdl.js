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
        console.log(111)
        console.log(await this.getDLByDay('2018-12-20','2018-12-29','5',24))
        // console.log(await this.getDLByDay('2018-12-22','2018-12-22','5',24))
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
        console.log('进出次数',array[0].length,array[1].length)
        array[0].forEach((item,index)=>{
            enterTime = enterTime + item/array[0].length
            var temp = ((index+1)*parseFloat(array[1].length/array[0].length).toFixed(0)-1)
            // console.log(enterTime,temp)
            outTime2 = outTime2 + (array[1][temp]?array[1][temp]:array[1][array[1].length-1])/array[0].length
            // console.log(outTime2)
        })
        array[1].forEach(item=>{
            outTime = outTime + item/array[1].length
        })
        // enters = 0
        // outs = 0
        // data.forEach(item=>{
        //     if(item.enter != 0 || item.exit != 0){
        //         var tempTime = parseInt(dtime(item.start_time).format('x'))
        //         enterTime = enterTime + tempTime*item.enter
        //         for(var i=0;i<item.exit;i++){
        //             outs++
        //             outTime = outTime + tempTime
        //             while(true){
        //                 if(outs > parseInt(rate*number)){
        //                     number++
        //                 }else if(outs < parseInt(rate*number)){
        //                     break;
        //                 }else if(parseInt(rate*number) == outs){
        //                     outTime2 = outTime2 + tempTime
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // })
        var peak = dtime(parseInt(enterTime)).format('YYYY-MM-DD HH:mm:ss')
        var peak2 = dtime(parseInt(outTime)).format('YYYY-MM-DD HH:mm:ss')
        var peak3 = dtime(parseInt(outTime2)).format('YYYY-MM-DD HH:mm:ss')
        console.log(peak,peak2,peak3)
        return ((parseInt(dtime(peak2).format('x'))-parseInt(dtime(peak).format('x')))/1000/60).toFixed(2)
        // var dateStart = parseInt(dtime(data[0].start_time).format('x'));

        // var allTime = 0
        // var allTime2 = 0
        // var enters = 0
        // var outs = 0
        // var outs2 = 0
        // var outs3 = 0
        // var time = 0
        // var time2 = 0
        // var time3 = 0
        // var tempR = false
        // var tempOut = []
        // var tempPP = []
        // var tempFinal = []
        // var enter2 = 0
        // var out2 = 0
        // data.forEach((item,index)=>{
        //     var tempTime = parseInt(dtime(item.start_time).format('x'))
        //     // if(item.enter != item.exit){
        //     //     // allTime = allTime + (item.enter-item.exit)*parseInt(dtime(item.start_time).format('x'))
        //     //     allTime = allTime + (item.enter-item.exit)*parseInt(dtime(item.start_time).format('x'))
        //     // }
        //     enter2 = enter2+ item.enter
        //     out2 = out2 + item.exit
        //     // console.log(enter2)
            
        //     if(parseInt(index/60) != parseInt((index+1)/60) ){
        //         tempPP.push([enter2,out2])
        //         enter2 = 0
        //         out2 = 0
        //     }
        //     for(var i=0;i<item.enter;i++){
        //         enters++
        //         allTime = allTime + tempTime
        //         allTime2 = allTime2 + tempTime
        //         tempOut.push(parseInt((parseFloat(enters)*216/205).toFixed(0)))
        //     }
        //     // if(enters + item.enter < outs3 + item.exit && enters + item.enter<=330){
        //     //     outs3 = enters + item.enter
        //     //     console.log(item.start_time,enters,item.enter,outs3,item.exit)
        //     // }else {
        //     //     outs3 = outs3 + item.exit
        //     // }
        //     time = time + item.enter*parseInt(dtime(item.start_time).format('x'))
        //     time2 = time2 + item.exit*parseInt(dtime(item.start_time).format('x'))
            
            
        //     outs = outs + item.exit
        // })
        // console.log(tempPP)
        // var tempKK = 0
        // outs = 0
        // // console.log(enters)
        // data.forEach(item=>{
        //     var tempTime = parseInt(dtime(item.start_time).format('x'))

        //     for(var i=0;i<item.exit;i++){
        //         outs++
        //         allTime = allTime - tempTime
        //         // console.log(outs,tempOut[tempKK])
        //         while(true){
        //             if(outs > tempOut[tempKK]){
        //                 tempKK++
        //             }else if(outs < tempOut[tempKK]){
        //                 break;
        //             }else if(outs == tempOut[tempKK]){
        //                 allTime2 = allTime2 - tempTime
        //                 time3 = time3 + tempTime
        //                 break;
        //             }
        //         }
        //     }
        // })
        // // console.log(dtime(parseInt(time3/outs2)).format('YYYY-MM-DD HH:mm:ss'))
        // var peak = dtime(parseInt(time/enters)).format('YYYY-MM-DD HH:mm:ss')
        // var peak2 = dtime(parseInt(time2/outs)).format('YYYY-MM-DD HH:mm:ss')
        // var peak3 = dtime(parseInt(time3/enters)).format('YYYY-MM-DD HH:mm:ss')
        // console.log(data[0].start_time,'平均入场',peak,'平均出场',peak2,peak3,(parseInt(time2/outs)-parseInt(time/enters))/1000/60)
        
        
        // console.log('进出次数',enters,outs)
        // if(enters < outs){
        //     // console.log(allTime)
        //     console.log((allTime+(outs-enters)*parseInt(dtime(data[0].start_time).format('x')))/1000/60/enters)
        //     // console.log((allTime+(outs-enters)*(parseInt(dtime(data[0].start_time).format('x'))+8*60*60*1000))/1000/60/enters)
        //     console.log((allTime + (outs-enters)*parseInt(dtime(peak).format('x')))/1000/60/enters)
        //     allTime = allTime + (outs-enters)*(parseInt(dtime(peak).format('x')))
        // }else {
        //     // console.log((allTime-(enters-outs)*parseInt(dtime(data[0].start_time).format('x')))/1000/60/enters)
        //     console.log((allTime-(enters-outs)*parseInt(dtime(peak).format('x')))/1000/60/enters)
        // }
        
        // var result = enters<outs ?enters:outs
        // params.rate.forEach(item=>{
        //     var people = result*(100-item)/100
        //     // console.log(people)
        //     // console.log(allTime/1000/60/people,enters,outs)
        // })
        
    }
    async dlByHour(){
        const data = await HKRLModel.find({start_time})
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
  