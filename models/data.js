'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const dataSchema = new Schema({
	id: Number,
	time:String,
	data: String,
	
},{ collection: 'datas'})

const Data = mongoose.model('Data', dataSchema);


export default Data
