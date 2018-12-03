'use strict';

import express from 'express'
import Collect from '../controller/collect/collect'
import xmlparser from 'express-xml-bodyparser';

const router = express.Router()

router.post('/collect/:id', Collect.collectWifi);
router.post('/:id',xmlparser({trim: false, explicitArray:false}),Collect.collectData);

router.post('/dswifi/:id', Collect.collectDSWIFI);
router.post('/hkrl/:id',xmlparser({trim: false, explicitArray:false}),Collect.collectHKRL);

// router.post('/register', Admin.register);
export default router