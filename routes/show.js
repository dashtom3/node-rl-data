'use strict';

import express from 'express'
import Show from '../controller/show/data'

const router = express.Router()
//海康人流
router.get('/hkrl/byhour',Show.getDataRLByhour)
router.get('/hkrl/byday',Show.getDataRLByday)
//海康热区
router.get('/hkrq/byhour',Show.getDataRQByhour)
router.get('/hkrq/byday',Show.getDataRQByday)
router.get('/hkrq/byall',Show.getDataRQTotal)
router.get('/hkrq/byecharts',Show.getDataRQEchartsByhour)

router.get('/dxmrl/bypeople',Show.getDataDXMbyPeople)
router.get('/byhour',Show.getDataRLByhour)
router.get('/byday',Show.getDataRLByday)
router.get('/hkdl/byDay',Show.getDataHKDLByDay)
router.get('/hkdl/byHour',Show.getDataHKDLByHour)
export default router