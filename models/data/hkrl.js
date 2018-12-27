'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const Data_HKRLSchema = new Schema({
	id:Number,
	start_time: String,
	end_time:String,
	enter:Number,
	exit:Number,
	pass:Number
})

const Data_HKRL = mongoose.model('Data_HKRL', Data_HKRLSchema);


export default Data_HKRL