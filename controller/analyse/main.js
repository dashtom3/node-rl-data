'use strict';

import analyse from './analyse';
import archive from '../collect/archive';

import schedule from 'node-schedule';
class Main{
    constructor(analyse,archive) {
        this.analyse = analyse
        this.archive = archive
    }
    startAnalyse(){
        this.analyse = new analyse()
    //  schedule.scheduleJob('00 0 5 * * *',function(){
    //     this.analyse = new analyse()
    //    });
    }
}
export default new Main()