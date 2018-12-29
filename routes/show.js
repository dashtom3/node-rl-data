'use strict';

import express from 'express'
import Show from '../controller/show/data'

const router = express.Router()

router.get('/byhour',Show.getDataRLByhour)
router.get('/byday',Show.getDataRLByday)
router.get('/hkdl/byDay',Show.getDataHKDLByDay)
router.get('/hkdl/byHour',Show.getDataHKDLByHour)
export default router