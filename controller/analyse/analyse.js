'use strict';

import DataModel from '../../models/data'
import logger from 'log4js'
import dtime from 'time-formater'
import xlsx  from 'node-xlsx'
import fs from 'fs'
import { start } from 'pm2';
import path from 'path';
class Analyse{
    constructor() {
        
        // this.getData(1,300,1000)
        this.errorNum = 0
        this.tempAll = {}
        this.resultData = {}
        //console.log(this.finalAnalyse(new Date(parseInt(dtime(new Date().getTime()-27*60*60*1000).format('x'))),new Date(parseInt(dtime(new Date()).format('x'))),24*60*60*1000))
        //console.log(this.finalAnalyse(new Date(parseInt(dtime(new Date().getTime()-60*60*1000).format('x'))),new Date(parseInt(dtime(new Date()).format('x'))),24*60*60*1000))
        //console.log(this.finalAnalyse(new Date(parseInt(dtime(new Date().getTime()-2*60*60*1000).format('x'))),new Date(parseInt(dtime(new Date()).format('x'))),24*60*60*1000))
        //console.log(this.finalAnalyse(new Date(parseInt(dtime(new Date().getTime()-21*60*60*1000).format('x'))),new Date(parseInt(dtime(new Date().getTime()-20*60*60*1000).format('x'))),24*60*60*1000))
        this.getFile()
      }
    async getData(pageNum,allPage,pageSize){
      logger.getLogger('analyse').info('--开始分析数据--',pageNum,pageSize);
      const data = await DataModel.find({}).skip((pageNum-1)*pageSize).limit(pageSize)
      logger.getLogger('analyse').info('--数据读取成功--',pageNum,pageSize);
      data.forEach((item)=>{
        try {
          var startindex = 0
          var lastdata = item.data
          while(lastdata.indexOf('essid',startindex) > 0){
            var startnum = lastdata.indexOf('essid',startindex)
            var lastnum = lastdata.indexOf("\",",startnum)
            if(lastnum == -1){
              break;
            }
            lastdata = lastdata.substring(0,startnum-1)+lastdata.substring(lastnum+2)
            startindex = startnum
          }
          var tempData = JSON.parse(lastdata.replace(/[\u000b\u000e\u000f\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u001b\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f\n\t\r\b\f]/g,''))
          var tempTime = new Date(tempData.time)
          tempData.data.forEach((single)=>{
            if(parseInt(single.rssi)>-80){
              if(this.tempAll[single.mac]){
                if(tempTime.getTime()-this.tempAll[single.mac][this.tempAll[single.mac].length-1][1].getTime()<=10*60*1000){ //10分钟间隔
                  this.tempAll[single.mac][this.tempAll[single.mac].length-1][1] = tempTime 
                  this.tempAll[single.mac][this.tempAll[single.mac].length-1][2] = (tempTime.getTime()-this.tempAll[single.mac][this.tempAll[single.mac].length-1][0].getTime())/1000
                }else {
                  if(this.tempAll[single.mac][this.tempAll[single.mac].length-1][2]<2*60){//用户待在这里小于2分钟就删除
                    this.tempAll[single.mac][this.tempAll[single.mac].length-1] = [tempTime,tempTime,0]
                  }else{
                    this.tempAll[single.mac].push([tempTime,tempTime,0])
                  }
                }
              }else {
                this.tempAll[single.mac] = [[tempTime,tempTime,0]]
              }
            }
          })
        } catch (error) {
          logger.getLogger('error').error('--错误数据--',this.errorNum++);
          // console.log(item._id,'错误id') 
          // console.log(error)
        }
      })
      if(pageNum <= allPage){
        this.getData(pageNum+1,allPage,pageSize)
      }else {
        var objKeys = Object.keys(this.tempAll);
        objKeys = objKeys.sort();//这里写所需要的规则
        var temp = []
        for(var i=0;i<objKeys.length;i++){
          // console.log(objKeys[i]+" : "+tempAll[objKeys[i]]);
          if(this.tempAll[objKeys[i]][0][2]>5*60){
            temp.push([objKeys[i]].concat(this.tempAll[objKeys[i]]))
          }
        }
        var excelTitle = ['用户','早餐时段（6:00-10:00）','早餐后（10:00-11:00）','午餐（11:00-14:00）','下午茶（14:00-17:00）','晚餐（17:00-20:00）','晚餐后（20:00-23:00)','深夜(23:00-3:00)','凌晨']
        var analyseGap = []
        var dateResult = {}
        temp.forEach((item,index2)=>{
          if(index2 == 0){
            item.forEach((single,index)=>{
              console.log(single(0),single(1))
              console.log(this.finalAnalyse(single[0],single[1],single[2]))
            })
          }
        })
        logger.getLogger('analyse').info('--数据分析结束--',temp.length);
        var buffer = xlsx.build([{name: "mySheetName", data: temp}]);
        
        var time = dtime().format('YYYY-MM-DD');
        fs.writeFileSync('数据'+time+'.xlsx',buffer);
      }
    }
    getFile(){
      // console.log()
      const workSheetsFromFile = xlsx.parse(path.join(__dirname,'data.xlsx'));
      var tempRes = {}
      workSheetsFromFile.forEach(item=>{
        item.data.forEach((single)=>{
          single.forEach((sim,index)=>{
            
            if(index == 0) {
              tempRes[sim] = {}
            }else {
              var tempQ = sim.split(',')
              var tempK = this.finalAnalyse(new Date(tempQ[0]),new Date(tempQ[1]),tempQ[2])
              for(var k in tempK){
                if(tempRes[single[0]][k]){
                  tempK[k].forEach((p,index)=>{
                    if(p != ''){
                      tempRes[single[0]][k][index] = tempRes[single[0]][k][index]==''?tempK[k][index]:[parseInt(tempRes[single[0]][k][index][0])+parseInt(tempK[k][index][0]),tempRes[single[0]][k][index][1]+','+tempK[k][index][1]]
                    }
                  })
                }else {
                  tempRes[single[0]][k] = tempK[k]
                }
              }
              
            }
          })

        })
      })
      var temp1 = ['2018-10-01','2018-10-02','2018-10-03','2018-10-04','2018-10-05','2018-10-06','2018-10-07']
      var resultFinal = []
      
      temp1.forEach(item=>{
        var temp2 = [['用户','凌晨(00:00~03:00)','凌晨(03:00~06:00)','早餐时段（6:00-10:00）','早餐后（10:00-11:00）','午餐（11:00-14:00）','下午茶（14:00-17:00）','晚餐（17:00-20:00）','晚餐后（20:00-23:00)','深夜(23:00-00:00)']]
        for(var k in tempRes){
          if(tempRes[k][item]){
            if(parseInt(tempRes[k][item][1][0])<2000 || tempRes[k][item][1] == ''){    // 3~6点 小于 2000秒
              temp2.push([k].concat(tempRes[k][item]))
            }
          }
        }
        
        resultFinal.push({name:item,data:temp2})
      })
      var buffer = xlsx.build(resultFinal);
      
      //var time = dtime().format('YYYY-MM-DD');
      fs.writeFileSync('result1.xlsx',buffer);
    }
    finalAnalyse(dateStart,dateEnd,time){
      
      // '早餐时段（6:00-10:00）','早餐后（10:00-11:00）','午餐（11:00-14:00）','下午茶（14:00-17:00）','晚餐（17:00-20:00）','晚餐后（20:00-23:00)','深夜(23:00-3:00)','凌晨']
      var temp = [0,3,6,10,11,14,17,20,23]
      var numStart,numEnd = 0 
      var startStr = dtime(dateStart).format('YYYY-MM-DD')
      var endStr = dtime(dateEnd).format('YYYY-MM-DD')
      var res = {}
      //
      for(var i=0;i<temp.length;i++){
        //   3:50 => i=1,2:50 i=0 
        if(dateStart.getHours()>=temp[i]){
          numStart = i
        }
        //   3:50 => i=1
        if(dateEnd.getHours()>=temp[i]){
          numEnd = i
        }
      }
      var numDay = (dtime(endStr).format('x')-dtime(startStr).format('x'))/(24*60*60*1000)
      if(numDay == 0 && numStart == numEnd){   //当就在一个时间段时
        res[startStr]=['','','','','','','','','']
        res[startStr][numStart] = [time,dtime(dateStart).format('HH:mm')+'~'+dtime(dateEnd).format('HH:mm')]
        return res
      }
      var tempDay
      res[startStr] = ['','','','','','','','','']
      res[startStr][numStart] = [this.getTime(this.getDateFromH(startStr,temp[(numStart+1)%temp.length]),dateStart),dtime(dateStart).format('HH:mm')+'~'+temp[(numStart+1)%temp.length]]
      for(var j=numStart+1;;j++){
        //当前这个时间段是哪一天
        tempDay = dtime(parseInt(dtime(startStr).format('x'))+parseInt(j/temp.length)*60*24*60*1000).format('YYYY-MM-DD')
        //这天没有数据就新加这个数据
        if(!res[tempDay]){
          res[tempDay] =  ['','','','','','','','','']
        }
        //console.log(numDay,parseInt(j/temp.length),numStart,j%temp.length,numEnd)
        if(numDay == parseInt(j/temp.length) && j%temp.length == numEnd){
          if(res[tempDay][numEnd] == ''){
            res[tempDay][numEnd] = [this.getTime(dateEnd,this.getDateFromH(tempDay,temp[j%temp.length])),temp[j%temp.length]+'~'+dtime(dateEnd).format('HH:mm')]
          }else {
            res[tempDay][numEnd] = [res[tempDay][numEnd][0]+this.getTime(dateEnd,this.getDateFromH(tempDay,temp[j%temp.length])),res[tempDay][numEnd][1]+','+temp[j%temp.length]+'~'+dtime(dateEnd).format('HH:mm')]
          }
          break;
        }else {
          var tempQ = j%temp.length == (temp.length-1)?1*60*60:(temp[(j+1)%temp.length]-temp[j%temp.length])*60*60
          if(res[tempDay][j%temp.length] == ''){
            res[tempDay][j%temp.length] = [tempQ,temp[j%temp.length]+'~'+temp[j%temp.length+1 == temp.length?0:j%temp.length+1]]
          }else {
            res[tempDay][j%temp.length] = [res[tempDay][j%temp.length][0]+tempQ,res[tempDay][j%temp.length][1]+','+temp[j%temp.length]+'~'+temp[j%temp.length+1 == temp.length?0:j%temp.length+1]]
          }
        } 
      }
      return res
    }
    getDateFromH(currentDay,h){
      return new Date(parseInt(dtime(dtime(currentDay).format('YYYY-MM-DD')+' '+h+':00:00').format('x')))
    }
    getTime(date1,date2){
      return (date1.getTime()-date2.getTime())/1000
    } 

    
}
export default Analyse
  