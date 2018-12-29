'use strict';

import express from 'express'
import Hkapi from '../controller/thirdInterface/hkapi'

import Archive from '../controller/collect/archive'//测试
const router = express.Router()

router.get('/oneday',Hkapi.getOndayDemo)
router.get('/stayAll',Hkapi.getStayAllData)
router.get('/byday',Hkapi.getStayByday)
router.get('/byhour',Hkapi.getDataByHour)
router.get('/echartsByhour',Hkapi.getEchartsByHour)

router.get('/archive',Archive.getDataByHour)//测试
export default router