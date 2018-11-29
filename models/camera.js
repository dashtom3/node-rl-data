'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const cameraSchema = new Schema({
	id:Number,
	start_time: String,
	end_time:String,
	enter:Number,
	exit:Number,
	pass:Number
},{ collection: 'cameradata'})

const Camera = mongoose.model('Camera', cameraSchema);


export default Camera