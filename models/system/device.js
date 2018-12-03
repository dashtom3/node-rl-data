'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
	id: Number,
    type: Number,
    brand:String,
})

const Data = mongoose.model('Device', deviceSchema);


export default Data
