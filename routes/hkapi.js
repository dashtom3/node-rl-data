'use strict';

import express from 'express'
import Hkapi from '../controller/thirdInterface/hkapi'

const router = express.Router()

router.get('/oneday',Hkapi.getOndayDemo)
router.get('/stayAll',Hkapi.getStayAllData)
router.get('/byday',Hkapi.getStayByday)
router.get('/byhour',Hkapi.getDataByHour)
router.get('/echartsByhour',Hkapi.getEchartsByHour)
export default router