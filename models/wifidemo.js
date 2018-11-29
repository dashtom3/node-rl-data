'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const wifiSchema = new Schema({
	id: Number,
	time:String,
	data: String,
	
},{collection:'datas'})

const Wifi = mongoose.model('Wifi', wifiSchema);


export default Wifi
