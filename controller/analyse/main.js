'use strict';

import analyse from './analyse';
import test from './test';
import schedule from 'node-schedule';
class Main{
    constructor(analyse,test) {
        this.analyse = analyse
        this.test = test
    }
    startAnalyse(){
        this.analyse = new analyse()
        // this.test = new test()
    //  schedule.scheduleJob('00 0 5 * * *',function(){
    //     this.analyse = new analyse()
    //    });
    }
}
export default new Main()