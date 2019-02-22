'use strict';

import express from 'express'
import ExportPdf from '../controller/exportpdf'

const router = express.Router()

router.get('/pdf',ExportPdf.exportPDF)
router.get('/download',ExportPdf.download)
export default router