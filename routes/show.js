'use strict';

import express from 'express'
import Show from '../controller/show/data'

const router = express.Router()
//海康人流
router.get('/hkrl/byhour',Show.getDataRLByHour)
router.get('/hkrl/byday',Show.getDataRLByDay)
//海康热区
router.get('/hkrq/byhour',Show.getDataRQByHour)
router.get('/hkrq/byday',Show.getDataRQByDay)
router.get('/hkrq/byall',Show.getDataRQTotal)
router.get('/hkrq/byecharts',Show.getDataRQEchartsByHour)
router.get('/hkrq/byOneDay',Show.getDataRQByOneDay)
//店小喵
router.get('/dxmrl/bypeople',Show.getDataDXMbyPeople)
router.get('/dxmrl/byDetail',Show.getDataDXMbyDetail)
router.get('/dxmrl/byFlowTrend',Show.getDataDXMByFlowTrend)
router.get('/dxmrl/isOnline',Show.getDXMDeviceIsOnline)

//海康逗留时长
router.get('/hkdl/byDay',Show.getDataHKDLByDay)
router.get('/hkdl/byHour',Show.getDataHKDLByHour)
export default router