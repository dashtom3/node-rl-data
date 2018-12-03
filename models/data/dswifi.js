'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const Data_DSWIFISchema = new Schema({
	id: Number,
	time:String,
	data: String,
})

const Data_DSWIFI = mongoose.model('Data_DSWIFI', Data_DSWIFISchema);


export default Data_DSWIFI