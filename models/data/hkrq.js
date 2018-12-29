'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const Data_HKRQSchema = new Schema({
	deviceId:String,
	deviceSerial:String,
	areaId:String,
	areaName:String,
	start_time: String,
	end_time:String,
	staySecond:String,
	stayPeopleCount:Number
})

const Data_HKRQ = mongoose.model('Data_HKRQ', Data_HKRQSchema);


export default Data_HKRQ