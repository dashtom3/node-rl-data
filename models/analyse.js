'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const analyseSchema = new Schema({
	id:Number,
	mac: String,
	creat_time:String,
	from_time: String,
	to_time:String,
},{ collection: 'analyse'})

const Analyse = mongoose.model('Analyse', analyseSchema);


export default Analyse
