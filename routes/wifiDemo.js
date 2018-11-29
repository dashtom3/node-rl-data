'use strict';

import express from 'express'
import wifiDemo from '../controller/wifiDemo'

const router = express.Router()

router.get('/collect', wifiDemo.collectData);
// router.post('/register', Admin.register);
export default router