'use strict';

import express from 'express'
import Collect from '../controller/collect/collect'

const router = express.Router()

router.post('/collect/:id', Collect.collectDSWIFI);
router.post('/:id',xmlparser({trim: false, explicitArray:false}),Collect.collectHKRL);

router.post('/collect/dswifi/:id', Collect.collectDSWIFI);
router.post('/collect/hkrl/:id',xmlparser({trim: false, explicitArray:false}),Collect.collectHKRL);

// router.post('/register', Admin.register);
export default router