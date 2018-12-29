'use strict';

import analyse from './analyse';

import schedule from 'node-schedule';
import hkdl from './hkdl'
class Main{

    constructor(analyse,test,hkdl) {
        // this.analyse = analyse
        // this.test = test
        this.hkdl = hkdl
    }
    startAnalyse(){
        this.hkdl = new hkdl()

    }
}
export default new Main()