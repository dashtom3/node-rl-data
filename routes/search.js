'use strict';

import express from 'express'
import Search from '../controller/search'

const router = express.Router()

router.get('/', Search.searchData);
router.get('/byhour',Search.searchByHour)
router.get('/byday',Search.searchByday)
export default router