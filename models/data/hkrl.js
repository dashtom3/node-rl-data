'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const Data_DHRLSchema = new Schema({
	id:Number,
	start_time: String,
	end_time:String,
	enter:Number,
	exit:Number,
	pass:Number
})

const Data_DHRL = mongoose.model('Data_DHRL', Data_DHRLSchema);


export default Data_DHRL