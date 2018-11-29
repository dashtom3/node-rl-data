'use strict';

import express from 'express'
import Camera from '../controller/camera'

const router = express.Router()
router.get('/byhour',Camera.searchByHour)
router.get('/byday',Camera.searchByday)
export default router