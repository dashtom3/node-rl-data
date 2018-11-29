'use strict';

import express from 'express'
import Test from '../controller/test'
import xmlparser from 'express-xml-bodyparser';
const router = express.Router()

router.post('/:id',xmlparser({trim: false, explicitArray:false}),Test.collectData);
// router.post('/register', Admin.register);
export default router