'use strict';

import express from 'express'
import Device from '../controller/system/device'
import Subshop from '../controller/system/subshop'
import Data from '../controller/system/data'

const router = express.Router()

router.post('/device/operate', Device.operateDevice);
router.get('/device/all', Device.getDeviceList);
router.post('/subshop/operate', Subshop.operateShop);
router.get('/subshop/all', Subshop.getShopList);

router.get('/getrldata/bydimension',Data.getHKRLDataBydimension)
export default router