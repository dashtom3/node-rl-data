'use strict';

import DataModel from '../../models/data'
import logger from 'log4js'
import dtime from 'time-formater'
import xlsx  from 'node-xlsx'
import fs from 'fs'
class Analyse{
    constructor() {
       
        this.getData(1,300,1000)
        this.errorNum = 0
        this.tempAll = {}
      }
    async getData(pageNum,allPage,pageSize){
      // var temp = '{"id":"00de6557","data":[{"mac":"78:11:dc:28:38:6a","rssi":"-81","router":"Xiaomi_403","range":"39.1"},{"mac":"88:5d:fb:6c:9e:27","rssi":"-67","router":"ChinaNet-5arf","range":"11.8"},{"mac":"ec:6c:9f:98:ec:7a","rssi":"-63","router":"BEERPLUS","range":"8.4"},{"mac":"c0:3f:0e:0b:48:4a","rssi":"-69","router":"WXYLYS2","range":"14.0"},{"mac":"70:62:b8:2f:06:8e","rssi":"-65","router":"BALI","range":"10.0"},{"mac":"78:31:2b:21:9b:d9","rssi":"-82","router":"ChinaNet-VVSV","range":"42.6"},{"mac":"14:6b:9c:5d:10:b1","rssi":"-80","range":"35.9"},{"mac":"94:d9:b3:23:fb:a9","rssi":"-83","router":"WXYLYS","range":"46.4"},{"mac":"80:89:17:46:51:73","rssi":"-94","range":"118.5"},{"mac":"08:10:7a:56:d5:3f","rssi":"-92","router":"802","range":"100.0"},{"mac":"0c:6a:bc:59:92:ad","rssi":"-90","router":"ChinaNet-vgwS","range":"84.3"},{"mac":"18:e2:9f:46:55:68","rssi":"-81","ts":"WXYLYS","tmc":"94:d9:b3:23:fb:a9","tc":"N","range":"39.1"},{"mac":"c4:12:f5:7e:62:fc","rssi":"-79","router":"0701","range":"33.0"},{"mac":"94:77:2b:98:b4:00","rssi":"-71","router":"ChinaNet-wQSK","range":"16.6"},{"mac":"e4:f3:f5:a2:1a:be","rssi":"-81","rssi1":"-84","rssi2":"-84","router":"8012","range":"39.1"},{"mac":"40:c6:2a:7f:32:21","rssi":"-81","range":"39.1"},{"mac":"da:a1:19:0a:19:fd","rssi":"-77","range":"27.8"},{"mac":"ec:8a:c7:01:5c:9d","rssi":"-82","router":"ChinaNet-vWJq","range":"42.6"},{"mac":"dc:da:80:81:e2:23","rssi":"-59","tmc":"9c:4f:da:5d:2b:11","router":"H3","range":"5.9"},{"mac":"88:e6:28:39:9e:cd","rssi":"-66","rssi1":"-67","rssi2":"-66","rssi3":"-66","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"N","range":"10.8"},{"mac":"44:04:44:76:bc:d1","rssi":"-68","rssi1":"-69","rssi2":"-69","rssi3":"-69","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"12.9"},{"mac":"10:44:00:e1:bc:b8","rssi":"-46","rssi1":"-52","rssi2":"-50","rssi3":"-51","tmc":"44:04:44:76:bc:d1","router":"VIP88888","range":"1.9"},{"mac":"88:e6:28:39:a1:57","rssi":"-55","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"N","range":"4.2"},{"mac":"94:d9:b3:24:09:32","rssi":"-67","router":"WXYLYS","range":"11.8"},{"mac":"ec:6c:9f:98:ec:7d","rssi":"-54","router":"BEERPLUS","range":"3.9"},{"mac":"10:44:00:e1:bc:b9","rssi":"-48","range":"2.3"},{"mac":"0c:25:76:07:b2:9c","rssi":"-81","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","ds":"Y","range":"39.1"},{"mac":"78:d3:8d:e3:ec:08","rssi":"-68","rssi1":"-68","rssi2":"-68","rssi3":"-68","router":"jian","range":"12.9"},{"mac":"88:d5:0c:ef:b0:e9","rssi":"-84","essid0":"e0g1366666","range":"50.5"},{"mac":"cc:b8:a8:50:31:36","rssi":"-80","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"35.9"},{"mac":"cc:b8:a8:50:22:b4","rssi":"-55","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"4.2"},{"mac":"cc:b8:a8:bf:a1:78","rssi":"-63","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"8.4"},{"mac":"54:27:1e:4e:4e:57","rssi":"-61","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"7.1"},{"mac":"40:31:3c:09:7c:df","rssi":"-51","router":"X","range":"3.0"},{"mac":"3c:bd:3e:26:67:f0","rssi":"-62","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"7.7"},{"mac":"10:44:00:e1:bd:75","rssi":"-49","range":"2.5"},{"mac":"28:a1:eb:f7:66:58","rssi":"-63","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"8.4"},{"mac":"10:44:00:e1:bd:74","rssi":"-49","tmc":"28:a1:eb:f2:9f:89","router":"VIP66666","range":"2.5"},{"mac":"3c:2e:f9:13:bb:af","rssi":"-54","rssi1":"-54","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"3.9"},{"mac":"70:d9:23:08:15:c4","rssi":"-60","rssi1":"-61","rssi2":"-60","rssi3":"-59","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"6.5"},{"mac":"ec:6c:9f:98:ec:80","rssi":"-71","router":"BEERPLUS","range":"16.6"},{"mac":"48:7d:2e:b2:4d:fa","rssi":"-73","router":"TOPPLUS2","range":"19.7"},{"mac":"00:01:36:59:04:f7","rssi":"-88","range":"71.0"},{"mac":"cc:b8:a8:4f:f4:0a","rssi":"-66","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"10.8"},{"mac":"f0:03:8c:d6:bb:b9","rssi":"-86","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"59.9"},{"mac":"c4:36:55:a6:8b:ca","rssi":"-64","router":"VIP66666-Plus","range":"9.1"},{"mac":"34:d7:12:9a:30:8b","rssi":"-77","ts":"BEERPLUS","tmc":"ec:6c:9f:98:ec:80","tc":"Y","ds":"Y","range":"27.8"},{"mac":"0c:25:76:05:54:03","rssi":"-72","ts":"VIP66666-Plus","tmc":"c4:36:55:a6:8b:ca","tc":"Y","ds":"Y","range":"18.1"},{"mac":"94:bf:2d:05:f8:aa","rssi":"-69","rssi1":"-68","ts":"VIP66666-Plus","tmc":"c4:36:55:a6:8b:ca","tc":"N","range":"14.0"},{"mac":"cc:b8:a8:50:61:0a","rssi":"-60","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"N","range":"6.5"},{"mac":"34:96:72:30:4c:42","rssi":"-83","tmc":"c0:cc:f8:cb:a4:7a","range":"46.4"},{"mac":"28:a1:eb:f8:f4:c1","rssi":"-48","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"2.3"},{"mac":"c6:36:55:06:8b:ca","rssi":"-56","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"4.6"},{"mac":"00:25:92:2c:44:a8","rssi":"-62","rssi1":"-61","rssi2":"-59","rssi3":"-61","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"7.7"},{"mac":"78:11:dc:d5:e2:cf","rssi":"-79","tmc":"40:31:3c:07:8d:fd","range":"33.0"},{"mac":"7c:50:49:48:b9:2a","rssi":"-76","rssi1":"-78","rssi2":"-77","rssi3":"-78","ts":"BEERPLUS","tmc":"ec:6c:9f:98:ec:80","tc":"Y","essid0":"BEERPLUS","range":"25.5"}],"mmac":"14:6b:9c:de:65:57","rate":"2","time":"FriSep2817:14:282018","lat":"","lon":""}'
      // console.log(temp.substr(2500,100))
      logger.getLogger('analyse').info('--开始分析数据--',pageNum,pageSize);
      
        const data = await DataModel.find({}).skip((pageNum-1)*pageSize).limit(pageSize)
        logger.getLogger('analyse').info('--数据读取成功--',pageNum,pageSize);
        data.forEach((item)=>{
          // if(item.data.replace(/\s+/g,"")[2506] == ' '){
          //   console.log('22222')
          // }
          // console.log(item.data.replace(/\s+/g,"").substr(2500,10),item.data.replace(/\s+/g,"")[2506],1,item.data.replace(/\s+/g,"")[2507])
          try {
            var tempData = JSON.parse(item.data)
            // var tempData = JSON.parse(item.data.replace(/[\'\"\\\/\b\f\n\r\t]/g, ''))
            var tempTime = new Date(tempData.time)
            tempData.data.forEach((single)=>{
              if(this.tempAll[single.mac]){
                if(tempTime.getTime()-this.tempAll[single.mac][this.tempAll[single.mac].length-1][1].getTime()<=10*60*1000){
                  this.tempAll[single.mac][this.tempAll[single.mac].length-1][1] = tempTime 
                  this.tempAll[single.mac][this.tempAll[single.mac].length-1][2] = (tempTime.getTime()-this.tempAll[single.mac][this.tempAll[single.mac].length-1][0].getTime())/1000
                }else {
                  this.tempAll[single.mac].push([tempTime,tempTime,0])
                }
              }else {
                this.tempAll[single.mac] = [[tempTime,tempTime,0]]
              }
            })
          } catch (error) {
            logger.getLogger('error').error('--错误数据--',this.errorNum++);
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
            if(this.tempAll[objKeys[i]][0][2]>4){
              temp.push([objKeys[i]].concat(this.tempAll[objKeys[i]]))
            }else if(this.tempAll[objKeys[i]][1]){
              temp.push([objKeys[i]].concat(this.tempAll[objKeys[i]]))
            }
          }
          console.log(Object.getOwnPropertyNames(this.tempAll).length)
          var buffer = xlsx.build([{name: "mySheetName", data: temp}]);
          // console.log()
          
          var time = dtime().format('YYYY-MM-DD');
          fs.writeFileSync('数据'+time+'.xlsx',buffer);
        }
    }
    
}
export default Analyse
  