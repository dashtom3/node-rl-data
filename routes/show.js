'use strict';

import express from 'express'
import Show from '../controller/show/data'

const router = express.Router()

router.get('/byhour',Show.getDataRLByhour)
router.get('/byday',Show.getDataRLByday)

export default router