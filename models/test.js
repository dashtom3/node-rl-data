'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const testSchema = new Schema({
	id: Number,
	start_time:String,
	end_time: String,
	enter:Number,
	exit:Number,
	pass:Number
},{ collection: 'cameradata'})

const Test = mongoose.model('Test', testSchema);


export default Test
