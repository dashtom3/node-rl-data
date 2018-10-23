'use strict';

import analyse from './analyse';
import test from './test';
class Main{
    constructor(analyse,test) {
        this.analyse = analyse
        this.test = test
    }
    startAnalyse(){
        this.analyse = new analyse()
        // this.test = new test()
    }
}
export default new Main()