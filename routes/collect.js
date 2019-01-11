'use strict';

import express from 'express'
import Collect from '../controller/collect/collect'
import xmlparser from 'express-xml-bodyparser';
import Archive from '../controller/collect/archive'

const router = express.Router()

router.post('/collect/:id', Collect.collectDSWIFI);//wifi(旧)
router.post('/:id',xmlparser({trim: false, explicitArray:false}),Collect.collectHKRL);//摄像头(旧)

router.post('/dswifi/:id', Collect.collectDSWIFI);
router.post('/hkrl/:id',xmlparser({trim: false, explicitArray:false}),Collect.collectHKRL);

router.get('/archive',Archive.getDataByHour)//收集热区数据
// router.post('/register', Admin.register);
export default router