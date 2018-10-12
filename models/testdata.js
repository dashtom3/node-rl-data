'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const dataSchema = new Schema({
	id: Number,
    data: String,
    time:Date
},{collection:'testdatas'})

const testData = mongoose.model('testData', dataSchema);


export default testData
