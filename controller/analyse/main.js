'use strict';

import analyse from './analyse';
import archive from '../collect/archive';

import schedule from 'node-schedule';
import hkdl from './hkdl'
class Main{
    constructor(analyse,archive) {
        this.analyse = analyse
        this.archive = archive
    }
    startAnalyse(){
        // schedule.scheduleJob('30 * * * * *',()=>{
        //     this.archive =  archive
        // }); 
        
    }
}
export default new Main()