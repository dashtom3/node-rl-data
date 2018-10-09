'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const dataSchema = new Schema({
	id: Number,
	data: String
})

const Data = mongoose.model('Data', dataSchema);


export default Data
