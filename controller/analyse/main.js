'use strict';

import analyse from './analyse';

import schedule from 'node-schedule';
class Main{
    constructor(analyse,test) {
        this.analyse = analyse
    }
    startAnalyse(){
        this.analyse = new analyse()
    //  schedule.scheduleJob('00 0 5 * * *',function(){
    //     this.analyse = new analyse()
    //    });
    }
}
export default new Main()