'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
	id: String,
    type: Number,
    brand:String,
    create_time:String,
})

const Data = mongoose.model('Device', deviceSchema);

export default Data
