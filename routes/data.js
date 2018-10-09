'use strict';

import express from 'express'
import Data from '../controller/data'
const router = express.Router()

router.post('/collect/:id', Data.collectData);
// router.post('/register', Admin.register);

export default router