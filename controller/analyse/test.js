'use strict';

import testModel from '../../models/testdata'
import logger from 'log4js'
// import dtime from 'time-formater'
const dtime = require('time-formater')
class Test{
    constructor() {
        this.doTest()
        // this.insertNum = 0
    }
    async doTest(){
        var insertNum = 0
       var time = dtime(new Date()).format('YYYY-MM-DD HH:mm:ss')
       console.log(time)
        var data = '{"id":"1","data":[{"mac":"00:25:92:2c:44:a8","rssi":"-67","rssi1":"-68","rssi2":"-67","rssi3":"-67","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"11.8"},{"mac":"2c:57:31:1c:74:ca","rssi":"-80","ts":"BEERPLUS","tmc":"ec:6c:9f:98:ec:80","tc":"Y","range":"35.9"},{"mac":"c4:36:55:a6:8b:ca","rssi":"-71","router":"VIP66666-Plus","range":"16.6"},{"mac":"c6:36:55:06:8b:ca","rssi":"-71","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"16.6"},{"mac":"c0:3f:0e:0b:48:4a","rssi":"-72","tmc":"90:3c:92:4b:87:d3","router":"WXYLYS2","range":"18.1"},{"mac":"10:44:00:e1:bd:74","rssi":"-57","router":"VIP66666","range":"5.0"},{"mac":"3c:bd:3e:26:67:f0","rssi":"-59","rssi1":"-61","rssi2":"-60","rssi3":"-60","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","range":"5.9"},{"mac":"50:64:2b:d9:fc:6a","rssi":"-86","router":"Kenneth","range":"59.9"},{"mac":"34:5b:bb:eb:2e:8d","rssi":"-92","router":"midea_ca_0303","range":"100.0"},{"mac":"ec:6c:9f:98:ec:7a","rssi":"-66","router":"BEERPLUS","range":"10.8"},{"mac":"78:a3:51:08:70:2c","rssi":"-78","range":"30.3"},{"mac":"70:62:b8:2f:06:8e","rssi":"-65","router":"BA LI","range":"10.0"},{"mac":"78:31:2b:21:9b:d9","rssi":"-86","router":"ChinaNet-VVSV","range":"59.9"},{"mac":"78:11:dc:28:38:6a","rssi":"-84","tmc":"e2:7e:a2:6d:15:8d","router":"Xiaomi_403","range":"50.5"},{"mac":"d4:ee:07:2d:fa:a0","rssi":"-85","router":"HiWiFi_ICL","range":"55.0"},{"mac":"08:23:b2:b5:21:d1","rssi":"-81","ts":"WXYLYS2","tmc":"c0:3f:0e:0b:48:4a","tc":"Y","range":"39.1"},{"mac":"94:77:2b:98:b4:00","rssi":"-75","router":"ChinaNet-wQSK","range":"23.4"},{"mac":"60:83:34:ad:d1:70","rssi":"-87","range":"65.2"},{"mac":"90:3c:92:4b:87:d3","rssi":"-79","ts":"WXYLYS2","tmc":"c0:3f:0e:0b:48:4a","tc":"Y","ds":"Y","range":"33.0"},{"mac":"94:d9:b3:23:fb:a9","rssi":"-80","router":"WXYLYS","range":"35.9"},{"mac":"c4:12:f5:7e:62:fc","rssi":"-79","router":"0701","range":"33.0"},{"mac":"34:96:72:12:e5:8b","rssi":"-84","router":"lei","range":"50.5"},{"mac":"d4:67:e7:09:07:f5","rssi":"-88","router":"ChinaNet-vzJy","range":"71.0"},{"mac":"00:01:36:3e:4e:5e","rssi":"-91","router":"myLGNet","range":"91.8"},{"mac":"00:01:36:3e:4e:5d","rssi":"-91","range":"91.8"},{"mac":"72:94:25:9b:8a:d6","rssi":"-60","rssi1":"-60","rssi2":"-59","range":"6.5"},{"mac":"0c:6a:bc:59:92:ad","rssi":"-91","router":"ChinaNet-vgwS","range":"91.8"},{"mac":"5a:89:26:96:c5:aa","rssi":"-94","range":"118.5"},{"mac":"8e:dd:2b:7e:66:62","rssi":"-75","range":"23.4"},{"mac":"e4:f3:f5:a2:1a:be","rssi":"-93","router":"8012","range":"108.9"},{"mac":"10:44:00:e1:bc:b8","rssi":"-53","rssi1":"-53","rssi2":"-55","rssi3":"-57","tmc":"44:04:44:76:bc:d1","router":"VIP88888","range":"3.5"},{"mac":"44:04:44:76:bc:d1","rssi":"-86","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"59.9"},{"mac":"ec:6c:9f:98:ec:7d","rssi":"-65","router":"BEERPLUS","range":"10.0"},{"mac":"10:44:00:e1:bc:b9","rssi":"-55","range":"4.2"},{"mac":"54:27:1e:4e:4e:57","rssi":"-69","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"14.0"},{"mac":"dc:da:80:81:e2:23","rssi":"-67","rssi1":"-69","rssi2":"-68","rssi3":"-67","tmc":"8e:dd:2b:7e:66:62","router":"H3","range":"11.8"},{"mac":"cc:b8:a8:bf:a1:78","rssi":"-71","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","ds":"Y","range":"16.6"},{"mac":"cc:b8:a8:4f:f4:0a","rssi":"-77","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","ds":"Y","range":"27.8"},{"mac":"f0:03:8c:d6:bb:b9","rssi":"-90","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","ds":"Y","range":"84.3"},{"mac":"cc:b8:a8:50:31:36","rssi":"-66","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","ds":"Y","range":"10.8"},{"mac":"94:d9:b3:24:09:32","rssi":"-73","tmc":"8e:dd:2b:7e:66:62","router":"WXYLYS","range":"19.7"},{"mac":"2c:d9:74:0d:65:3e","rssi":"-85","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","range":"55.0"},{"mac":"cc:b8:a8:50:22:b4","rssi":"-66","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"Y","ds":"Y","range":"10.8"},{"mac":"88:cf:98:ee:bf:ac","rssi":"-88","router":"ChinaNet-q9E5","range":"71.0"},{"mac":"40:31:3c:09:7c:df","rssi":"-60","rssi1":"-62","rssi2":"-61","router":"X","range":"6.5"},{"mac":"14:6b:9c:de:65:57","rssi":"-76","router":"CMCC-188","range":"25.5"},{"mac":"0c:25:76:07:b2:9c","rssi":"-88","ts":"VIP66666","tmc":"10:44:00:e1:bd:74","tc":"Y","ds":"Y","range":"71.0"},{"mac":"08:10:7a:56:d5:3f","rssi":"-91","router":"802","range":"91.8"},{"mac":"08:10:7a:60:70:3b","rssi":"-84","router":"ChinaNet-303","range":"50.5"},{"mac":"74:ec:42:a6:db:8d","rssi":"-86","router":"ChinaNet-D9v7","range":"59.9"},{"mac":"ec:8a:c7:01:5c:9d","rssi":"-84","router":"ChinaNet-vWJq","range":"50.5"},{"mac":"88:e6:28:39:9e:cd","rssi":"-68","rssi1":"-69","rssi2":"-69","ts":"VIP88888","tmc":"10:44:00:e1:bc:b8","tc":"N","range":"12.9"},{"mac":"88:5d:fb:6c:9e:27","rssi":"-78","router":"ChinaNet-5arf","range":"30.3"},{"mac":"10:44:00:e1:bd:75","rssi":"-54","range":"3.9"},{"mac":"54:be:53:5b:ff:87","rssi":"-83","rssi1":"-82","tmc":"2c:57:31:a6:6f:32","range":"46.4"},{"mac":"34:d7:12:9a:30:8b","rssi":"-84","ts":"BEERPLUS","tmc":"ec:6c:9f:98:ec:80","tc":"Y","range":"50.5"}],"mmac":"14:6b:9c:de:65:57","rate":"2","time":"Fri Sep 28 17:27:03 2018"}'
        var mac = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100]
        //  console.log(insertNum)
        for(let i of mac){
           i = setInterval(function(){
            try{
                const testdata = testModel.create({time:time,data:data})
               
                logger.getLogger('test').info('--数据存入成功--',insertNum++);
                // console.log(testdata)
            }catch(err){
                console.log(err)
            }
        },2000)
       }
        
           
    }
    
}
export default Test
  